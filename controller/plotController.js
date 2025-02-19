import { PlotModel } from "../class/class.js";
import { dbConnection } from "../database/db.js";
import { addPlots } from "../service/plotService.js";

export const plotadd = async (req, res) => {
  try {
    const {
      projectId,
      plotarea,
      plotNumber,
      plotrate,
      north,
      south,
      east,
      west,
    } = req.body;

  

    if (!projectId || !plotarea || !plotrate || !plotNumber) {
      return res.status(400).json({
        status: "error",
        message:
          "All fields (projectId, plotarea,plotNumber, plotrate) are required.",
      });
    }

    const plotAmount = plotarea * plotrate;

    const plot = {
      projectId,
      plotarea,
      plotNumber,
      plotrate,
      plotamount: plotAmount,
      north,
      south,
      east,
      west,
    };

    const response = await addPlots(plot);

    if (response.success) {
      return res.status(201).json({
        status: "success",
        message: response.message,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Fields are not proper. Could not add plot. plot number already <addedd></addedd>",
      });
    }
  } catch (error) {
    console.error("Error in plotadd:", error.message);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

//   getallplots

export const getAllPlots = async (req, res) => {
  try {
    const [response] = await dbConnection.query(
      `SELECT * FROM projects AS proj INNER JOIN plots AS plo ON proj.projectId = plo.projectId`
    );


    res.status(201).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getPlotById = async (req, res) => {
  try {
    const { plotId } = req.params;

    const [response] = await dbConnection.query(
      `SELECT * FROM plots WHERE plotId = ?`,
      [plotId]
    );

    if (!response) {
      res.status(401).json({
        status: "error",
        message: "data not found",
      });
    }
    res.status(201).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.response,
    });
  }
};

export const getAvailabalePlot = async (req, res) => {
  try {
    const [customerplots] = await dbConnection.query(
      `SELECT plotId FROM customer`
    );
    const [plots] = await dbConnection.query(`SELECT * FROM plots`);

    const customerPlotIds = customerplots.map((customer) => customer.plotId);
    const availabalePlots = plots.filter(
      (plot) => !customerPlotIds.includes(plot.plotId)
    );

    res.status(201).json({
      staus: "success",
      data: availabalePlots,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
    });
  }
};
export const getAvailabalePlotByprojctId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const [customerplots] = await dbConnection.query(
      `SELECT plotId FROM customer WHERE projectId = ?`,
      [projectId]
    );
    const [plots] = await dbConnection.query(
      `SELECT * FROM plots WHERE projectId = ?`,
      [projectId]
    );

    const customerPlotIds = customerplots.map((customer) => customer.plotId);
    const availabalePlots = plots.filter(
      (plot) => !customerPlotIds.includes(plot.plotId)
    );

    res.status(201).json({
      staus: "success",
      data: availabalePlots,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
    });
  }
};

export const allPlotsDetails = async (req, res) => {
  try {
    const [projects] = await dbConnection.query(`SELECT 
    * FROM projects
    `);

    const [plots] = await dbConnection.query(`SELECT * FROM plots`);

    const [sellPlots] = await dbConnection.query(`SELECT * FROM customer`);

    const soldplots = sellPlots.map((item) => item.plotId);

    const availablePlots = plots.filter(
      (item) => !soldplots.includes(item.plotId)
    );

    res.status(201).json({
      status: "success",
      data: {
        totalProject: projects.length,
        totalPlots: plots.length,
        sellPlots: sellPlots.length,
        avilablePlots: availablePlots.length,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messgae: error,
    });
  }
};

export const getPlotsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [response] = await dbConnection.query(
      `SELECT * FROM plots WHERE projectId = ?`,
      [projectId]
    );

    const projectid = response[0].projectId;
    const [projectDetails] = await dbConnection.query(`SELECT * FROM projects WHERE projectId=?`,[projectid])
    res.status(201).json({
      status: "success",
      data: {
        plotDetails : response,
        projectDetails:projectDetails
      },
      length: response.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error,
    });
  }
};


export const getSellPlotsByProjectId = async (req,res)=>{
  try {
    const {projectId} = req.params;

    const [plotResponse] = await dbConnection.query(`SELECT * FROM plots WHERE projectId = ?`, [projectId]);

    const [customerResponse] = await dbConnection.query(`SELECT plotId FROM customer WHERE projectId = ?`, [projectId]);

    const customerPlotIds = customerResponse.map((customer) => customer.plotId);
    const availablePlots = plotResponse.filter(
      (plot) =>  customerPlotIds.includes(plot.plotId)
    );

    res.status(201).json({
      staus: "success",
      data: availablePlots,
    });
  } catch (error) {
    res.status(500).json({
      message:"internal server error"
    })
  }
}