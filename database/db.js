import mysql from "mysql2/promise";
import dotenv from "dotenv"

dotenv.config();

const dbConnection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 75,
    connectTimeout: 60000,
    ssl: {
      rejectUnauthorized: true, // or false, based on your requirements
    },
});

  


  const checkDatabase = async () => {
    try {
    
          const connection = await dbConnection.getConnection();
          console.log("database connected successfully");
          // Perform database operations
          connection.release();
    
    } catch (error) {
      console.log(error);
    }
  };

export {dbConnection, checkDatabase}