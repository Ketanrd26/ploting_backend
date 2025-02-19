import { dbConnection } from "../database/db.js";

export const billingController = async (req, res) => {
  try {
    const { customerId, paymentId, bankDetailsId } = req.body;

    // Validate input
    if (!customerId || !paymentId || !bankDetailsId) {
      return res.status(400).json({
        status: "error",
        message: "Missing required parameters.",
      });
    }

    // Fetch customer details
    const [customerDetailsRows] = await dbConnection.query(
      `SELECT * FROM customer AS cus
      INNER JOIN plots AS plot ON plot.plotId = cus.plotId
      INNER JOIN projects AS proj ON proj.projectId = plot.projectId
      WHERE cus.customerId = ?`,
      [customerId]
    );
    if (customerDetailsRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found.",
      });
    }
    const customerDetails = customerDetailsRows[0];

    console.log(customerDetails, "customerdata")

    // Fetch payment details
    const [paymentDetailsRows] = await dbConnection.query(
      `SELECT * FROM payment WHERE paymentId = ?`,
      [paymentId]
    );
    if (paymentDetailsRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Payment not found.",
      });
    }
    const paymentDetails = paymentDetailsRows[0];

    // Fetch bank details
    const [bankDetailsRows] = await dbConnection.query(
      `SELECT * FROM bankDetails WHERE bankDetailsId = ?`,
      [bankDetailsId]
    );
    if (bankDetailsRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Bank details not found.",
      });
    }
    const bankDetails = bankDetailsRows[0];

    // Insert into billing table
    const [billingResult] = await dbConnection.query(
      `INSERT INTO billing 
      (date, name, address, mob_number, email, projectName, gatNumber, plotNumber, plotarea, plotrate, total_amount,north,south,east,west, customer_amount, payment_type, plotPurchasedType, amountInWords, bankName, cheqNum, cheqDate, branchName) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerDetails.date,
        customerDetails.cName,
        customerDetails.address,
        customerDetails.mob_Number,
        customerDetails.email,
        customerDetails.projectname,
        customerDetails.projectGatId,
        customerDetails.plotNumber,
        customerDetails.plotarea,
        customerDetails.plotrate,
        customerDetails.plotamount,
        customerDetails.north,
        customerDetails.south,
        customerDetails.east,
        customerDetails.west,
        paymentDetails.bookingAmt,
        paymentDetails.payment_type,
        customerDetails.plotPurchasedType,
        paymentDetails.amountInWords,
        bankDetails.bankName,
        bankDetails.cheqNum,
        bankDetails.cheqDate,
        bankDetails.branchName,
      ]
    );

    // Respond with success and billing ID
    res.status(201).json({
      data: billingResult.insertId,
      status: "success",
    });
  } catch (error) {
    console.error("Error in billingController:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

export const getBillById = async (req, res) => {
  try {
    const { billingId } = req.params;
    const [response] = await dbConnection.query(
      `SELECT * FROM billing WHERE billingId=?`,
      [billingId]
    );

    res.status(201).json({
      status: "success",
      response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
    });
  }
}
