import express from "express";
import {
  AddPayment,
  customerAdd,
  customerFetch,
  customerFetchById,

  customerFetchByProjId,

  newCustomerList,
} from "../controller/customerController.js";
import { billingController, getBillById } from "../controller/billingController.js";
import { addReminder } from "../controller/reminder.js";

export const customerRoute = express.Router();

customerRoute.post("/customerAdd", customerAdd);
customerRoute.get("/getAllCustomers", customerFetch);
customerRoute.get("/getCustomerById/:customerId", customerFetchById);
customerRoute.post("/addpayment", AddPayment);
customerRoute.post("/billing", billingController);
customerRoute.get("/viewBill/:billingId", getBillById);
customerRoute.get("/newCustomer", newCustomerList);
customerRoute.get("/getCustomerByProjId/:projectId", customerFetchByProjId)
customerRoute.post("/sendmessage", addReminder)
