import { dbConnection } from "../database/db.js";

const userTable = `CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(350) NOT NULL,
    role VARCHAR(45) NOT NULL
)
`;

const projectTable = `CREATE TABLE IF NOT EXISTS projects(
  projectId INT AUTO_INCREMENT PRIMARY KEY,
  projectname VARCHAR(100) NOT NULL,
  projectarea VARCHAR(100) NOT NULL,
  projectlocation VARCHAR(250) NOT NULL,
  projectGatId VARCHAR(250) NOT NULL
)`;

const plottable = `CREATE TABLE IF NOT EXISTS plots(
  projectId INT NOT NULL,
  plotId INT AUTO_INCREMENT PRIMARY KEY,
  plotarea VARCHAR(400) NOT NULL, 
  plotrate INT (100) NOT NULL,  
  plotamount INT (100) NOT NULL,
  plotdirection VARCHAR (400) NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(projectId) 
    ON DELETE CASCADE ON UPDATE CASCADE
)`;

const customerTable = `CREATE TABLE IF NOT EXISTS customer(
  customerId INT AUTO_INCREMENT PRIMARY KEY,
  cName VARCHAR(400) NOT NULL,
  address VARCHAR(500),
  mob_Number VARCHAR(15),
  email VARCHAR(100) ,
  projectId INT NOT NULL,
  FOREIGN KEY(projectId) REFERENCES projects(projectId),
  plotId INT NOT NULL,
  FOREIGN KEY(plotId) REFERENCES plots(plotId)


)`;

const paymentTable = `CREATE TABLE IF NOT EXISTS payment(
  customerId INT NOT NULL,
  paymentId INT AUTO_INCREMENT PRIMARY KEY,
  bookingAmt VARCHAR(250),
  payment_type VARCHAR(250),
  FOREIGN KEY(customerId) REFERENCES customer(customerId)
  ON DELETE CASCADE ON UPDATE CASCADE
)`;

const bankDetailsTable = `CREATE TABLE IF NOT EXISTS bankDetails(
  paymentId INT NOT NULL,
bankDetailsId INT AUTO_INCREMENT PRIMARY KEY,
bankName VARCHAR(400),
cheqNum VARCHAR(400),
cheqDate VARCHAR(400),
branchDate VARCHAR(400),
FOREIGN KEY (paymentId) REFERENCES payment(paymentId)
ON DELETE CASCADE ON UPDATE CASCADE
)`;

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
    await createTable("customers", customerTable); 
    await createTable("payments", paymentTable); 
    await createTable("bankDetails", bankDetailsTable); 

    console.log("all tabels created");
  } catch (error) {
    console.log(error);
  }
};

export default createAllTable;
