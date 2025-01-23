import express from "express";
import { AddImage, add_project, allProjectList, projectById, showImageByProjectId } from "../controller/projectController.js";
import multer from "multer";
import path from "path";
import fs from "fs"
export const projectRoutes = express.Router();


const multerStorage = multer.diskStorage({
   destination:(req,file,cb)=>{
    const customePath = "./projectImages";


    if (!fs.existsSync(customePath)) {
        fs.mkdirSync(customePath, { recursive: true });
      }
    cb(null,customePath)
   },

   filename:(req,file,cb)=>{
    const customeName = file.originalname.split(".")[0];
    cb(null, `${customeName}_${path.extname(file.originalname)}`)
   }
});


const upload = multer({
    storage:multerStorage
})








projectRoutes.post("/addprojects", add_project);
projectRoutes.get("/getprojectsList", allProjectList);
projectRoutes.get("/getProjectById/:projectId", projectById);
projectRoutes.post("/addImages", upload.single("image"), AddImage);
projectRoutes.get("/showImageByProjectId/:projectId",showImageByProjectId )

