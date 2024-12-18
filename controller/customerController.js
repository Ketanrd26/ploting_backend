import { dbConnection } from "../database/db.js";

export const customerAdd = async (req, res) => {
  const { customer, payment, bankDetails } = req.body;
  let connection;

  try {
    // Get a connection from the pool
    connection = await dbConnection.getConnection();
    await connection.beginTransaction();

    // Insert into customer table
    const cusQuery = `INSERT INTO customer (cName, address, mob_Number, email,projectId, plotId) VALUES (?, ?, ?, ?,?, ?)`;
    const cusValues = [
      customer.cName,
      customer.address,
      customer.mob_Number,
      customer.email,
      customer.projectId,
      customer.plotId,
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
    
      SELECT * 
      FROM customer AS cus
      INNER JOIN payment AS pay ON cus.customerId = pay.customerId
      INNER JOIN bankDetails AS bank ON pay.paymentId = bank.paymentId
      ;
      `
    );

    res.status(200).json({
        status:"success",
        data:response
    })
  } catch (error) {
    res.status(500).json({
        status:"error",
        message:error.response
    })
  }
};
