import express from "express";
import { getStatement } from "../controller/statementController.js";

export const statementRoute = express.Router();

statementRoute.get("/getStatement", getStatement)