import mysql from "mysql2/promise.js";
import dotenv from "dotenv"

dotenv.config();

const dbConnection = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB_NAME
});

const checkDatabase = async ()=>{
try {
    const connection = await dbConnection.getConnection();
    console.log("database connected successfully");
    connection.release()
} catch (error) {
    console.log(error)
}
}

export {dbConnection, checkDatabase}