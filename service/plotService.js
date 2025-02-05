import { dbConnection } from "../database/db.js";

export const addPlots = async (plots) => {
  try {
    // SQL query to insert plot data
    const queries = `
        INSERT INTO plots (projectId, plotarea,plotNumber, plotrate, plotamount,north,south,east,west ) 
        VALUES (?, ?, ?,?, ?, ?,?,?,?)
      `;
    const values = [
      plots.projectId,
      plots.plotarea,
      plots.plotNumber,
      plots.plotrate,
      plots.plotamount,
      plots.north,
      plots.south,
      plots.east,
      plots.west,
    ];

    await dbConnection.query(queries, values);


    const plotNumberquery = `SELECT COUNT(*) AS count FROM plots WHERE plotNumber =?`;

    const [plotNumberCheck] = await dbConnection.query(plotNumberquery,[plots.plotNumber]);

    if(plotNumberCheck.count > 0){
      return{
        success:false,
        message:"plotnumber added already"
      }
    }

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
