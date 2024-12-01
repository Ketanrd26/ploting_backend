import express from "express";
import { add_project, allProjectList, projectById } from "../controller/projectController.js";

export const projectRoutes = express.Router();

projectRoutes.post("/addprojects", add_project);
projectRoutes.get("/getprojectsList", allProjectList);
projectRoutes.get("/getProjectById/:projectId", projectById);

