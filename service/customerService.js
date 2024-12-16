import { dbConnection } from "../database/db";

export const addCustomers = async (cus) => {
  try {
 
    const cusQuries = `INSERT INTO customer (cName,address,mob_Number,email,projectId,plotId) VALUES (?,?,?,?,?,?)`

  } catch (error) {


  }
};
