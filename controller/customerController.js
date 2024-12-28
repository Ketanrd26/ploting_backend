import { ToWords } from "to-words";
import { dbConnection } from "../database/db.js";

export const customerAdd = async (req, res) => {
  const { customer, payment, bankDetails } = req.body;
  let connection;

  try {
    // Get a connection from the pool
    connection = await dbConnection.getConnection();
    await connection.beginTransaction();

    // Insert into customer table
    const cusQuery = `INSERT INTO customer (cName, address, mob_Number, email,projectId, plotId,date, plotPurchasedType, progress) VALUES (?, ?, ?, ?,?, ?,?,?,?)`;
    const cusValues = [
      customer.cName,
      customer.address,
      customer.mob_Number,
      customer.email,
      customer.projectId,
      customer.plotId,
      customer.date,
      customer.plotPurchasedType,
      customer.progress,
    ];

    const [customerResult] = await connection.query(cusQuery, cusValues);

    const toWords = new ToWords();
    const numericAmount = parseFloat(payment.bookingAmt); // Convert the string to a number

    if (isNaN(numericAmount)) {
      res.status(404).json({
        message: "invalid amount",
        status: "error",
      });
    }

    const amountInWords = `${toWords.convert(numericAmount)} rupees only`;

    // Insert into payment table
    const payQuery = `INSERT INTO payment (customerId, bookingAmt, payment_type, amountInWords) VALUES (?, ?, ?, ?)`;
    const payValues = [
      customerResult.insertId, // Use the customerId from the newly inserted customer
      payment.bookingAmt,
      payment.payment_type,
      amountInWords,
    ];

    const [paymentResult] = await connection.query(payQuery, payValues);

    // Insert into bankDetails table
    const bankDetailsQuery = `INSERT INTO bankDetails (paymentId, bankName, cheqNum, cheqDate, branchName) VALUES (?, ?, ?, ?, ?)`;
    const bankDetailsValues = [
      paymentResult.insertId, // Use the paymentId from the newly inserted payment
      bankDetails.bankName,
      bankDetails.cheqNum,
      bankDetails.cheqDate,
      bankDetails.branchName,
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
          cus.plotPurchasedType,
          cus.progress,
          pay.paymentId,
          pay.bookingAmt,
          pay.payment_type,
          pay.amountInwords,
          bank.bankDetailsId,
          bank.bankName,
          bank.cheqNum,
          bank.cheqDate,
          bank.branchName,
          plot.plotId,
          plot.plotarea,
          plot.plotamount,
          proj.projectname
      FROM 
          customer AS cus
      LEFT JOIN 
          payment AS pay ON cus.customerId = pay.customerId
      LEFT JOIN 
          bankDetails AS bank ON pay.paymentId = bank.paymentId
          LEFT JOIN plots AS plot ON cus.plotId = plot.plotId
          LEFT JOIN projects AS proj ON plot.projectId = proj.projectId
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
          plotPurchasedType: row.plotPurchasedType,
          progress: row.progress,
          projectId: row.projectId,
          plotId: row.plotId,
          date: row.date,
          plotdetails: row.plotId
            ? {
                plotId: row.plotId,
                projectname: row.projectname,
                plotarea: row.plotarea,
                plotamount: row.plotamount,
              }
            : null,

          payments: [],
          paymentTotalAmount: 0,
        };
      }

      // Add payment details for the customer
      if (row.paymentId) {
        const bookingAmt = parseFloat(row.bookingAmt) || 0;
        acc[customerId].payments.push({
          paymentId: row.paymentId,
          bookingAmt: row.bookingAmt,
          payment_type: row.payment_type,
        });
        acc[customerId].paymentTotalAmount += bookingAmt;
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
          cus.plotPurchasedType,
          cus.progress,
          pay.paymentId,
          pay.bookingAmt,
          pay.payment_type,
          pay.amountInwords,
          bank.bankDetailsId,
          bank.bankName,
          bank.cheqNum,
          bank.cheqDate,
          bank.branchName,
          plot.plotId,
          plot.plotarea,
          plot.plotamount,
          plot.plotdirection,
          plot.plotrate,
          proj.projectId,
          proj.projectname,
          proj.projectarea,
          proj.projectlocation,
          proj.projectGatId
      FROM 
          customer AS cus
      LEFT JOIN 
          payment AS pay ON cus.customerId = pay.customerId
      LEFT JOIN 
          bankDetails AS bank ON pay.paymentId = bank.paymentId
          LEFT JOIN plots AS plot ON cus.plotId = plot.plotId
          LEFT JOIN projects AS proj ON cus.projectId = proj.projectId
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
        plotPurchasedType: response[0].plotPurchasedType,
        progress: response[0].progress,
        projectId: response[0].projectId,
        plotId: response[0].plotId,
        date: response[0].date,
        projectsDetails: {
          projectId: response[0].projectId,
          projectname: response[0].projectname,
          projectarea: response[0].projectarea,
          projectlocation: response[0].projectlocation,
          projectGatId: response[0].projectGatId,
        },
        plotdetails: {
          plotId: response[0].plotId,
          plotarea: response[0].plotarea,
          plotrate: response[0].plotrate,
          plotamount: response[0].plotamount,
          plotdirection: response[0].plotdirection,
        },
        payments: response.map((row) => ({
          paymentId: row.paymentId,
          bookingAmt: row.bookingAmt,
          payment_type: row.payment_type,
          amountInwords: row.paymentInwords,
          bankDetails: row.bankDetailsId
            ? {
                bankDetailsId: row.bankDetailsId,
                bankName: row.bankName,
                cheqNum: row.cheqNum,
                cheqDate: row.cheqDate,
                branchName: row.branchName,
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
    const toWords = new ToWords();

    const amountInwords = toWords.convert(payment.amount);
    const [paymentResponse] = await dbConnection.query(
      "INSERT INTO payment (customerId, bookingAmt, payment_type, amountInWords) VALUES (?,?,?,?)",

      [
        payment.customerId,
        payment.bookingAmt,
        payment.payment_type,
        amountInwords,
      ]
    );
    const [bankResponse] = await dbConnection.query(
      "INSERT INTO bankDetails (paymentId, bankName, cheqNum,cheqDate,branchName) VALUES (?,?,?,?,?)",

      [
        paymentResponse.insertId,
        bankDetails.bankName,
        bankDetails.cheqNum,
        bankDetails.cheqDate,
        bankDetails.branchName,
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
    const [response] = await dbConnection.query(` 
      SELECT 
          cus.customerId,
          cus.cName,
          cus.address,
          cus.mob_Number,
          cus.email,
          cus.projectId,
          cus.plotId,
          cus.date,
          cus.plotPurchasedType,
          cus.progress,
          pay.paymentId,
          pay.bookingAmt,
          pay.payment_type,
          plot.plotId,
          plot.projectId,
          plot.plotarea,
          plot.plotamount,
          proj.projectName
      FROM 
          customer AS cus
      LEFT JOIN 
          payment AS pay ON cus.customerId = pay.customerId
     
          LEFT JOIN 
          plots AS plot ON cus.plotId = plot.plotId
          LEFT JOIN projects AS proj ON plot.projectId = proj.projectId
    `);

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
          plotPurchasedType: row.plotPurchasedType,
          progress: row.progress,
          projectId: row.projectId,
          plotId: row.plotId,
          date: row.date,

          plotDetails: row.plotId
            ? {
                projectName: row.projectName,
                plotId: row.plotId,
                plotarea: row.plotarea,
                plotamount: row.plotamount,
              }
            : null,
          payments: [],
          totalBookingAmount: 0, // Initialize the totalBookingAmount
        };
      }

      // Add payment details for the customer
      if (row.paymentId) {
        const bookingAmt = parseFloat(row.bookingAmt) || 0; // Handle null or invalid bookingAmt
        acc[customerId].payments.push({
          paymentId: row.paymentId,
          bookingAmt: row.bookingAmt,
          payment_type: row.payment_type,
        });

        // Add to the totalBookingAmount
        acc[customerId].totalBookingAmount += bookingAmt;
      }

      return acc;
    }, {});

    // Convert the grouped data to an array and get the latest 10 records
    const customerData = Object.values(groupedData).reverse().slice(0, 10);

    if (customerData.length > 0) {
      res.status(201).json({
        status: "success",
        data: customerData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "An unexpected error occurred",
    });
  }
};

export const customerFetchByProjId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [response] = await dbConnection.query(
      `SELECT 
          cus.customerId,
          cus.cName,
          cus.address,
          cus.mob_Number,
          cus.email,
          cus.projectId,
          cus.plotId,
          cus.date,
          cus.plotPurchasedType,
          cus.progress,
          pay.paymentId,
          pay.bookingAmt,
          pay.payment_type,
          bank.bankDetailsId,
          bank.bankName,
          bank.cheqNum,
          bank.cheqDate,
          bank.branchName,
          plot.plotId,
          plot.plotarea,
          plot.plotamount,
          plot.plotdirection,
          plot.plotrate,
          proj.projectId,
          proj.projectname,
          proj.projectarea,
          proj.projectlocation,
          proj.projectGatId
      FROM 
          customer AS cus
      LEFT JOIN 
          payment AS pay ON cus.customerId = pay.customerId
      LEFT JOIN 
          bankDetails AS bank ON pay.paymentId = bank.paymentId
          LEFT JOIN plots AS plot ON cus.plotId = plot.plotId
          LEFT JOIN projects AS proj ON cus.projectId = proj.projectId
      WHERE 
          cus.projectId = ?`,
      [projectId]
    );

    if (response.length === 0) {
      return res.status(400).json({
        message: "No data found",
      });
    }
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
          plotPurchasedType: row.plotPurchasedType,
          progress: row.progress,
          projectId: row.projectId,
          plotId: row.plotId,
          date: row.date,
          plotdetails: row.plotId
            ? {
                plotId: row.plotId,
                projectname: row.projectname,
                plotarea: row.plotarea,
                plotamount: row.plotamount,
              }
            : null,

          payments: [],
          paymentTotalAmount: 0,
        };
      }

      // Add payment details for the customer
      if (row.paymentId) {
        const bookingAmt = parseFloat(row.bookingAmt) || 0;
        acc[customerId].payments.push({
          paymentId: row.paymentId,
          bookingAmt: row.bookingAmt,
          payment_type: row.payment_type,
        });
        acc[customerId].paymentTotalAmount += bookingAmt;
      }

      return acc;
    }, {});

    // Convert the grouped data to an array
    const customerData = Object.values(groupedData);

    res.status(200).json({
      status: "success",
      data: customerData,
      length: customerData.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "An unexpected error occurred",
    });
  }
};
