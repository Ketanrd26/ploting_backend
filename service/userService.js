import { dbConnection } from "../database/db.js";
import brcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secret_key = process.env.SECRET_KEY;
// register
export const register = async (user) => {
  try {
    const [existnguser] = await dbConnection.query(
      `SELECT * FROM users WHERE username = ?`,
      [user.username]
    );

    if (existnguser.length > 0) {
      return { success: false, message: "user already exists" };
    }

    await dbConnection.query(
      `ALTER TABLE users MODIFY COLUMN password VARCHAR(255)`
    );
    const hassedPass = await brcrypt.hash(user.password, 10);
    const queries = `INSERT INTO users (username, password,role) VALUES (?,?,?)`;
    const values = [user.username, hassedPass, user.role];

    await dbConnection.query(queries, values);
    return { success: true, message: "registerd successfully" };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: "something error",
    };
  }
};

// LOGIN
export const login = async (username, password) => {
  try {
    const [usernameCheck] = await dbConnection.query(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );

    if (usernameCheck.length === 0) {
      return { success: false, message: "user not found" };
    }
    const user = usernameCheck[0];
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      secret_key,
      {
        expiresIn:"1d"
      }
    );
    const passcheck = await brcrypt.compare(password, user.password);

    if (!passcheck) {
      return {
        success: false,
        message: "password wrong",
      };
    }

    return {
      success: true,
      message: "loggin successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
    };
  }
};
