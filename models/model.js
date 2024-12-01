import { dbConnection } from "../database/db.js";

const userTable = `
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(350) NOT NULL,
    role VARCHAR(45) NOT NULL
);
`;



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
    console.log("all tabels created");
  } catch (error) {
    console.log(error);
  }
};

export default createAllTable;
