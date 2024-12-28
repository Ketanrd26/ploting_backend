import { dbConnection } from "../database/db.js";

export const addExpnses = async (req, res) => {
  try {
    const { projectId, workDetails, amount } = req.body;
    const [response] = await dbConnection.query(
      `INSERT INTO expenses (projectId,workDetails,amount) VALUES (?,?,?)`,
      [projectId, workDetails, amount]
    );

    res.status(201).json({
        status:"success",
        data:response.insertId
    })
  } catch (error) {
    res.status(500).json({
        status:"error",
        error
    })
  }
};
