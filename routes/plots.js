import express from "express";
import { getAllPlots, plotadd } from "../controller/plotController.js";

export const plotRoute = express.Router();

plotRoute.post("/addPlot", plotadd);
plotRoute.get("/getPlotList", getAllPlots);