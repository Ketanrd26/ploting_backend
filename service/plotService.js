import { dbConnection } from "../database/db.js";

export const addPlots = async (plots) => {
  try {
    // SQL query to insert plot data
    const queries = `
        INSERT INTO plots (projectId, plotarea,plotNumber, plotrate, plotamount, plotdirection) 
        VALUES (?, ?, ?,?, ?, ?)
      `;
    const values = [
      plots.projectId,
      plots.plotarea,
      plots.plotNumber,
      plots.plotrate,
      plots.plotamount,
      plots.plotdirection,
    ];

    await dbConnection.query(queries, values);

    return {
      success: true,
      message: "Plot data added successfully",
    };
  } catch (error) {
    console.error("Error in addPlots:", error.message);
    return {
      success: false,
      message: "An error occurred while adding plot data",
      error: error.message,
    };
  }
};
