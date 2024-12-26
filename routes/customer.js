import express from "express";
import { AddPayment, customerAdd, customerFetch, customerFetchById, newCustomerList } from "../controller/customerController.js";

export const customerRoute = express.Router();

customerRoute.post("/customerAdd", customerAdd);
customerRoute.get("/getAllCustomers", customerFetch);
customerRoute.get("/getCustomerById/:customerId", customerFetchById);
customerRoute.post("/addpayment", AddPayment);
customerRoute.get("/newCustomer", newCustomerList);