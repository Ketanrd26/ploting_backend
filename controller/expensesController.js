import { dbConnection } from "../database/db.js";

export const addExpnses = async (req, res) => {
  let connection;
  try {
   

    connection = await dbConnection.getConnection();

    await connection.beginTransaction();
    



    const { projectId, workDetails, amount,date } = req.body;
    const [response] = await connection.query(
      `INSERT INTO expenses (projectId,workDetails,amount,date) VALUES (?,?,?,?)`,
      [projectId, workDetails, amount,date]
    );


    const statement = await connection.query(`INSERT INTO statement (expenseId) VALUES(?)`,[response.insertId]);



    await connection.commit();

    res.status(201).json({
      status: "success",
      data: response.insertId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const getExpense = async (req, res) => {
  try {
    const [response] = await dbConnection.query(`SELECT * FROM expenses`);

    const totalAmount = response.reduce((acc, row) => {
      return acc + parseFloat(row.amount);
    }, 0);

    res.status(201).json({
      status: "success",
      response,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

export const getExpenseByProjectId = async (req, res) => {
  try {
    const {projectId} = req.params;
    const [response] = await dbConnection.query(
      `SELECT * FROM expenses WHERE projectId = ?`,
      [projectId]
    );
    const totalamount = response.reduce((acc, row) => {
      return acc + parseFloat(row.amount);
    }, 0);

    res.status(201).json({
      status: "success",
      response,
      totalamount,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error,
    });
  }
};
