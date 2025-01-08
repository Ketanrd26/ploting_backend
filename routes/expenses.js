import express from "express";
import { addExpnses, getExpense, getExpenseByProjectId } from "../controller/expensesController.js";

export const expensesRoute = express.Router();


expensesRoute.post("/addExpenses", addExpnses);
expensesRoute.get("/getExpense", getExpense);
expensesRoute.get("/getExpenseByProjId/:projectId", getExpenseByProjectId);