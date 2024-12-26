import { dbConnection } from "../database/db.js";

export const customerAdd = async (req, res) => {
  const { customer, payment, bankDetails } = req.body;
  let connection;

  try {
    // Get a connection from the pool
    connection = await dbConnection.getConnection();
    await connection.beginTransaction();

    // Insert into customer table
    const cusQuery = `INSERT INTO customer (cName, address, mob_Number, email,projectId, plotId,date) VALUES (?, ?, ?, ?,?, ?,?)`;
    const cusValues = [
      customer.cName,
      customer.address,
      customer.mob_Number,
      customer.email,
      customer.projectId,
      customer.plotId,
      customer.date,
    ];

    const [customerResult] = await connection.query(cusQuery, cusValues);

    // Insert into payment table
    const payQuery = `INSERT INTO payment (customerId, bookingAmt, payment_type) VALUES (?, ?, ?)`;
    const payValues = [
      customerResult.insertId, // Use the customerId from the newly inserted customer
      payment.bookingAmt,
      payment.payment_type,
    ];

    const [paymentResult] = await connection.query(payQuery, payValues);

    // Insert into bankDetails table
    const bankDetailsQuery = `INSERT INTO bankDetails (paymentId, bankName, cheqNum, cheqDate, branchDate) VALUES (?, ?, ?, ?, ?)`;
    const bankDetailsValues = [
      paymentResult.insertId, // Use the paymentId from the newly inserted payment
      bankDetails.bankName,
      bankDetails.cheqNum,
      bankDetails.cheqDate,
      bankDetails.branchDate,
    ];

    const [bankDetailsResult] = await connection.query(
      bankDetailsQuery,
      bankDetailsValues
    );

    // Commit the transaction
    await connection.commit();

    // Respond with the success message
    res.status(200).json({
      status: "success",
      message: "Customer added successfully",
      data: {
        customerId: customerResult.insertId,
        payment: paymentResult.insertId,
        bankdetailsId: bankDetailsResult.insertId,
      },
    });
  } catch (error) {
    if (connection) {
      // Rollback the transaction in case of error
      await connection.rollback();
    }
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding customer.",
    });
  } finally {
    if (connection) {
      // Release the connection back to the pool
      connection.release();
    }
  }
};

// customer fetch
export const customerFetch = async (req, res) => {
  try {
    const [response] = await dbConnection.query(
      `
      SELECT 
          cus.customerId,
          cus.cName,
          cus.address,
          cus.mob_Number,
          cus.email,
          cus.projectId,
          cus.plotId,
          cus.date,
          pay.paymentId,
          pay.bookingAmt,
          pay.payment_type,
          bank.bankDetailsId,
          bank.bankName,
          bank.cheqNum,
          bank.cheqDate,
          bank.branchDate
      FROM 
          customer AS cus
      LEFT JOIN 
          payment AS pay ON cus.customerId = pay.customerId
      LEFT JOIN 
          bankDetails AS bank ON pay.paymentId = bank.paymentId
      `
    );

    // Group customers and their respective payments
    const groupedData = response.reduce((acc, row) => {
      const customerId = row.customerId;

      if (!acc[customerId]) {
        // Create a new customer object if not already present
        acc[customerId] = {
          customerId: row.customerId,
          cName: row.cName,
          address: row.address,
          mob_Number: row.mob_Number,
          email: row.email,
          projectId: row.projectId,
          plotId: row.plotId,
          date: row.date,
          payments: [],
        };
      }

      // Add payment details for the customer
      if (row.paymentId) {
        acc[customerId].payments.push({
          paymentId: row.paymentId,
          bookingAmt: row.bookingAmt,
          payment_type: row.payment_type,
          bankDetails: row.bankDetailsId
            ? {
                bankDetailsId: row.bankDetailsId,
                bankName: row.bankName,
                cheqNum: row.cheqNum,
                cheqDate: row.cheqDate,
                branchDate: row.branchDate,
              }
            : null,
        });
      }

      return acc;
    }, {});

    // Convert the grouped data to an array
    const customerData = Object.values(groupedData);

    res.status(200).json({
      status: "success",
      data: customerData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while fetching customers.",
    });
  }
};

// customer fetch on Id

export const customerFetchById = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Query to fetch customer details along with all their payments
    const [response] = await dbConnection.query(
      `
      SELECT 
          cus.customerId,
          cus.cName,
          cus.address,
          cus.mob_Number,
          cus.email,
          cus.projectId,
          cus.plotId,
          cus.date,
          pay.paymentId,
          pay.bookingAmt,
          pay.payment_type,
          bank.bankDetailsId,
          bank.bankName,
          bank.cheqNum,
          bank.cheqDate,
          bank.branchDate
      FROM 
          customer AS cus
      LEFT JOIN 
          payment AS pay ON cus.customerId = pay.customerId
      LEFT JOIN 
          bankDetails AS bank ON pay.paymentId = bank.paymentId
      WHERE 
          cus.customerId = ?
      `,
      [customerId]
    );

    // If the response has data, format it to group payments under the customer
    if (response.length > 0) {
      const customerData = {
        customerId: response[0].customerId,
        cName: response[0].cName,
        address: response[0].address,
        mob_Number: response[0].mob_Number,
        email: response[0].email,
        projectId: response[0].projectId,
        plotId: response[0].plotId,
        date: response[0].date,
        payments: response.map((row) => ({
          paymentId: row.paymentId,
          bookingAmt: row.bookingAmt,
          payment_type: row.payment_type,
          bankDetails: row.bankDetailsId
            ? {
                bankDetailsId: row.bankDetailsId,
                bankName: row.bankName,
                cheqNum: row.cheqNum,
                cheqDate: row.cheqDate,
                branchDate: row.branchDate,
              }
            : null,
        })),
      };

      res.status(200).json({
        status: "success",
        data: customerData,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }
  } catch (error) {
    console.error("Error fetching customer with payments:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching customer data.",
    });
  }
};

export const AddPayment = async (req, res) => {
  let connection;
  const { payment, bankDetails } = req.body;
  try {
    connection = await dbConnection.getConnection();

    await connection.beginTransaction();

    const [paymentResponse] = await dbConnection.query(
      "INSERT INTO payment (customerId, bookingAmt, payment_type) VALUES (?,?,?)",

      [payment.customerId, payment.bookingAmt, payment.payment_type]
    );
    const [bankResponse] = await dbConnection.query(
      "INSERT INTO bankDetails (paymentId, bankName, cheqNum,cheqDate,branchDate) VALUES (?,?,?,?,?)",

      [
        paymentResponse.insertId,
        bankDetails.bankName,
        bankDetails.cheqNum,
        bankDetails.cheqDate,
        bankDetails.branchDate,
      ]
    );

    await connection.commit();

    res.status(200).json({
      status: "success",
      data: {
        paymentId: paymentResponse.insertId,
        bankDetailsId: bankResponse.insertId,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({
      data: error.response,
      status: "error",
    });
  }
};

export const newCustomerList = async (req, res) => {
  try {
    const [response] = await dbConnection.query(`SELECT * FROM customer`);

    const newCus = response.reverse().slice(0, 10);

    if (newCus.length > 0) {
      res.status(201).json({
        status: "success",
        data: newCus,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
};

export const customerFetchByProjId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await dbConnection.query(
      `SELECT 
        c.customerId, c.cName, c.address, c.mob_Number, c.email, c.projectId, c.plotId, c.date,
        p.paymentId, p.bookingAmt, p.payment_type,
        b.bankDetailsId, b.bankName, b.cheqNum, b.cheqDate, b.branchDate
       FROM customer c
       LEFT JOIN payment p ON c.customerId = p.customerId
       LEFT JOIN bankDetails b ON p.paymentId = b.paymentId
       WHERE c.projectId = ?`,
      [projectId]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "No data found",
      });
    }


    const customers = rows.reduce((acc, row) => {
      let customer = acc.find(c => c.customerId === row.customerId);
      if (!customer) {
        customer = {
          customerId: row.customerId,
          cName: row.cName,
          address: row.address,
          mob_Number: row.mob_Number,
          email: row.email,
          projectId: row.projectId,
          plotId: row.plotId,
          date: row.date,
          payments: [],
        };
        acc.push(customer);
      }

      if (row.paymentId) {
        let payment = customer.payments.find(p => p.paymentId === row.paymentId);
        if (!payment) {
          payment = {
            paymentId: row.paymentId,
            bookingAmt: row.bookingAmt,
            payment_type: row.payment_type,
            bankDetails: [],
          };
          customer.payments.push(payment);
        }

        if (row.bankDetailsId) {
          payment.bankDetails.push({
            bankDetailsId: row.bankDetailsId,
            bankName: row.bankName,
            cheqNum: row.cheqNum,
            cheqDate: row.cheqDate,
            branchDate: row.branchDate,
          });
        }
      }

      return acc;
    }, []);

    res.status(200).json({
      status: "success",
      data: customers,
      length: customers.length,
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "An unexpected error occurred",
    });
  }
};
