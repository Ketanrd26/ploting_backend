import { dbConnection } from "../database/db.js";

export const projectAdd = async (project) => {
  try {
    const project_query = `INSERT INTO projects (projectname, projectarea, projectlocation, projectGatId, projectAmt) VALUES (?,?,?,?,?)`;
    const project_value = [
      project.projectname,
      project.projectarea,
      project.projectlocation,
      project.projectGatId,
      project.projectAmt
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
