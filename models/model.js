import { dbConnection } from "../database/db.js";

const userTable = `
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(350) NOT NULL,
    role VARCHAR(45) NOT NULL
);
`;

const projectTable = `
CREATE TABLE IF NOT EXISTS projects(
  projectId INT AUTO_INCREMENT PRIMARY KEY,
  projectname VARCHAR(100) NOT NULL,
  projectarea VARCHAR(100) NOT NULL,
  projectlocation VARCHAR(250) NOT NULL
)
`

const plottable = `
CREATE TABLE IF NOT EXISTS plots(
  projectId INT NOT NULL,
  plotId INT AUTO_INCREMENT PRIMARY KEY,
  plotarea VARCHAR(400) NOT NULL, 
  plotrate INT (100) NOT NULL,  
  plotamount INT (100) NOT NULL,
  plotdirection VARCHAR (400) NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(projectId) 
    ON DELETE CASCADE ON UPDATE CASCADE
)
`

const createTable = async (tablename, query) => {
  try {
    await dbConnection.query(query);
    console.log(`${tablename} table created successfully`);
  } catch (error) {
    console.log(`Error creating ${tablename}`, error);
  }
};

const createAllTable = async () => {
  try {
    await createTable("Users", userTable);
    await createTable("projectTable", projectTable);
    await createTable("plotstable", plottable);

    console.log("all tabels created");
  } catch (error) {
    console.log(error);
  }
};

export default createAllTable;
