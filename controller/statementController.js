import { dbConnection } from "../database/db.js";

export const getStatement = async (req, res) => {
  try {
    // Query to join and fetch data
    const [response] = await dbConnection.query(
      `SELECT 
    statement.id AS statementId, 
    statement.expenseId, 
    statement.paymentId,
    expenses.date AS expenseDate, 
    expenses.id AS expenseId, 
    expenses.amount AS expenseAmount, 
    expenses.workDetails AS expenseDescription, 
    projects.projectname AS projectName,
    payment.date AS paymentDate, 
    payment.paymentId AS paymentId, 
    payment.bookingAmt AS paymentAmount, 
    payment.payment_type AS paymentType, 
    customer.cName AS customerName,
    customer.plotId AS plotId
  FROM statement 
  LEFT JOIN expenses ON statement.expenseId = expenses.id 
  LEFT JOIN payment ON statement.paymentId = payment.paymentId
  LEFT JOIN customer ON payment.customerId = customer.customerId
  LEFT JOIN projects ON expenses.projectId = projects.projectId`
    );

    // Process the result to group details in individual statement objects
    const formattedResponse = response.map((row) => {
      const statement = {
        id: row.statementId,
        expenseId: row.expenseId,
        paymentId: row.paymentId,
        date: row.date,
      };

      if (row.expenseId) {
        // Add expense details if expenseId is not null
        statement.expenseDetails = {
          id: row.expenseId,
          exp_amount: row.expenseAmount,
          description: row.expenseDescription,
          projectname: row.projectName,
          date: row.expenseDate,
        };
      }
      console.log(statement.expenseDetails);

      if (row.paymentId) {
        // Add payment details if paymentId is not null
        statement.paymentDetails = {
          paymentId: row.paymentId,
          pay_amount: row.paymentAmount, // Add relevant columns from payment table
          customerName: row.customerName, // From customer table
          method: row.paymentType,
          date: row.paymentDate,
          plotId: row.plotId,
        };
      }

      return statement;
    });

    res.status(201).json({
      status: "success",
      response: formattedResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
