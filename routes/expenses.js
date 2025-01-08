import express from "express";
import { addExpnses, getExpense } from "../controller/expensesController.js";

export const expensesRoute = express.Router();


expensesRoute.post("/addExpenses", addExpnses);
expensesRoute.get("/getExpense", getExpense)