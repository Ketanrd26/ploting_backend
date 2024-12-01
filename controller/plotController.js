import { PlotModel } from "../class/class.js";
import { dbConnection } from "../database/db.js";
import { addPlots } from "../service/plotService.js";

export const plotadd = async (req, res) => {
  try {
    const { projectId, plotarea, plotrate, plotdirection } = req.body;

    if (!projectId || !plotarea || !plotrate || !plotdirection) {
      return res.status(400).json({
        status: "error",
        message:
          "All fields (projectId, plotarea, plotrate, plotdirection) are required.",
      });
    }

    const plotAmount = plotarea * plotrate;

    const plot = {
      projectId,
      plotarea,
      plotrate,
      plotamount: plotAmount,
      plotdirection,
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
        message: "Fields are not proper. Could not add plot.",
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

export const getAllPlots = async (req,res) => {
  try {
    const [response] = await dbConnection.query(`SELECT * FROM projects AS proj INNER JOIN plots AS plo ON proj.projectId = plo.projectId`);
res.status(201).json({
    status:"success",
    data:response
})
  } catch (error) {
    res.status(500).json({
        status:"error",
        message:error.message
    })
  }
};
