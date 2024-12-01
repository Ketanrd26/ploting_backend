import { dbConnection } from "../database/db.js";

export const projectAdd = async (project) => {
  try {
    const project_query = `INSERT INTO projects (projectname, projectarea, projectlocation) VALUES (?,?,?)`;
    const project_value = [
      project.projectname,
      project.projectarea,
      project.projectlocation,
    ];

    await dbConnection.query(project_query, project_value);
    return{
        success:true, message:"project added successfully"
    }
  } catch (error) {
    console.log(error);
    return{
        success:false, messgae:`something error ${error}`
    }
  }
};
