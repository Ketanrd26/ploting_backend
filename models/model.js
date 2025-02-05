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
  projectGatId VARCHAR(250) NOT NULL,
  projectAmt VARCHAR(250) NOT NULL
)`;

const plottable = `CREATE TABLE IF NOT EXISTS plots(
  projectId INT NOT NULL,
  plotId INT AUTO_INCREMENT PRIMARY KEY,
  plotarea VARCHAR(400) NOT NULL, 
  plotNumber VARCHAR(400) NOT NULL UNIQUE, 
  plotrate INT (100) NOT NULL,  
  plotamount INT (100) NOT NULL,
  north VARCHAR(200),
  south VARCHAR(200),
  east VARCHAR(200),
  west VARCHAR(200),
  FOREIGN KEY (projectId) REFERENCES projects(projectId) 
    ON DELETE CASCADE ON UPDATE CASCADE
)`;

const customerTable = `CREATE TABLE IF NOT EXISTS customer (
  customerId INT AUTO_INCREMENT PRIMARY KEY,
  cName VARCHAR(400) NOT NULL,
  address VARCHAR(500),
  mob_Number VARCHAR(15),
  email VARCHAR(100),
  emiAmt Varchar(200),
  emiPeriod Varchar(200),
  projectId INT NOT NULL,
  progress VARCHAR(100) NOT NULL,
  plotPurchasedType VARCHAR(100) NOT NULL,
  date VARCHAR(100) NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(projectId),
  plotId INT NOT NULL,
  FOREIGN KEY (plotId) REFERENCES plots(plotId) 
)`;

const paymentTable = `CREATE TABLE IF NOT EXISTS payment(
  customerId INT NOT NULL,
  paymentId INT AUTO_INCREMENT PRIMARY KEY,
  bookingAmt VARCHAR(250),
  date VARCHAR(100) NOT NULL,
  payment_type VARCHAR(250),
  amountInWords VARCHAR(45) NOT NULL,
  FOREIGN KEY(customerId) REFERENCES customer(customerId)
  ON DELETE CASCADE ON UPDATE CASCADE
)`;

const bankDetailsTable = `CREATE TABLE IF NOT EXISTS bankDetails(
  paymentId INT NOT NULL,
bankDetailsId INT AUTO_INCREMENT PRIMARY KEY,
bankName VARCHAR(400),
cheqNum VARCHAR(400),
cheqDate VARCHAR(400),
branchName VARCHAR(400),
FOREIGN KEY (paymentId) REFERENCES payment(paymentId)
ON DELETE CASCADE ON UPDATE CASCADE
)`;

const billingTable = ` CREATE TABLE IF NOT EXISTS billing (
  billingId INT AUTO_INCREMENT PRIMARY KEY,
  date VARCHAR(50) NOT NULL,
  name VARCHAR(400) NOT NULL,
  address VARCHAR(500) NOT NULL,
  mob_number VARCHAR(20) NOT NULL,
  email VARCHAR(200) NOT NULL,
  projectName VARCHAR(500) NOT NULL,
  gatNumber VARCHAR(300) NOT NULL,
  plotNumber VARCHAR(300) NOT NULL,
  plotarea VARCHAR(200) NOT NULL,
  plotrate VARCHAR(200) NOT NULL,
  total_amount VARCHAR(200) NOT NULL,
  plot_direction VARCHAR(300) NOT NULL,
  customer_amount VARCHAR(300) NOT NULL,
  payment_type VARCHAR(300) NOT NULL,
  plotPurchasedType VARCHAR(300) NOT NULL,
  amountInWords VARCHAR(500) NOT NULL,
  bankName VARCHAR(300) NOT NULL,
  cheqNum VARCHAR(200) NOT NULL,
  cheqDate VARCHAR(200) NOT NULL,
  branchName VARCHAR(500) NOT NULL
)`;

const expenseTable = `CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projectId INT NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(projectId),
  workDetails VARCHAR(500) NOT NULL,
  amount VARCHAR(300) NOT NULL,
  date VARCHAR(45) NOT NULL
)`;

const enquiryForm = `CREATE TABLE IF NOT EXISTS enquiry (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(400) NOT NULL,
number VARCHAR (20) NOT NULL,
enquiry VARCHAR(500),
feedback VARCHAR(400),
status VARCHAR(45)
)`;

const statementTable = `CREATE TABLE IF NOT EXISTS statement (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expenseId INT,
  FOREIGN KEY (expenseId) REFERENCES expenses(id)
    ON DELETE CASCADE ON UPDATE CASCADE
  ,
  paymentId INT,
  FOREIGN KEY (paymentId) REFERENCES payment(paymentId)
  ON DELETE CASCADE ON UPDATE CASCADE
);`;

const ImageTable = `Create Table If NOT EXISTS projectImages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projectId INT NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(projectId),
  image VARCHAR(500) NOT NULL
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
    await createTable("billing_table", billingTable);
    await createTable("expensesTable", expenseTable);
    await createTable("enquiryTable", enquiryForm);
    await createTable("statementTable", statementTable);
    await createTable("imagesTable", ImageTable);

    console.log("all tabels created");
  } catch (error) {
    console.log(error);
  }
};

export default createAllTable;
