import express from "express";
import { addExpnses } from "../controller/expensesController.js";

export const expensesRoute = express.Router();


expensesRoute.post("/addExpenses", addExpnses)