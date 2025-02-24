import { ProjectModel } from "../class/class.js";
import { dbConnection } from "../database/db.js";
import { projectAdd } from "../service/projectService.js";

export const add_project = async (req, res) => {
  try {
    const {
      projectname,
      projectarea,
      projectlocation,
      projectGatId,
      projectAmt,
    } = req.body;
    if (!projectname || !projectarea || !projectAmt) {
      res.status(404).json({
        status: "error",
        message: `${projectname || projectarea} required compulsory`,
      });
    }

    const project = new ProjectModel({
      projectname,
      projectarea,
      projectlocation,
      projectGatId,
      projectAmt,
    });

    const response = await projectAdd(project);

    if (response.success) {
      res.status(201).json({
        status: "success",
        data: response,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error",
      error: error,
    });
  }
};

// get all projects
export const allProjectList = async (req, res) => {
  try {
    const [response] = await dbConnection.query(`SELECT * FROM projects`);

    res.status(201).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
};

// get project data by Id

export const projectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const [response] = await dbConnection.query(
      `SELECT * FROM projects WHERE projectId = ?`,
      [projectId]
    );

    res.status(201).json({
      status: "success",
      data: response[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error,
    });
  }
};

export const AddImage = async (req, res) => {
  try {
    console.log("File received:", req.file);
    const { projectId } = req.body;
    const image = req.file?.filename;
    console.log(projectId);
    const [response] = await dbConnection.query(
      `INSERT INTO projectImages (projectId,image) VALUES (?,?)`,
      [projectId, image]
    );

    res.status(201).json({
      message: "success",
      data: response.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

export const showImageByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const [response] = await dbConnection.query(
      `SELECT * FROM projectImages AS projimg LEFT JOIN projects AS proj ON projimg.projectId = proj.projectId WHERE proj.projectId = ?`,
      [projectId]
    );

    res.status(201).json({
      data: response,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: error,
    });
  }
};
