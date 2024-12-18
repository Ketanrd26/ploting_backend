import express from "express";
import { customerAdd, customerFetch } from "../controller/customerController.js";

export const customerRoute = express.Router();

customerRoute.post("/customerAdd", customerAdd);
customerRoute.get("/getAllCustomers", customerFetch);