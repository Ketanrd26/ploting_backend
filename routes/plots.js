import express from "express";
import { getAllPlots, getPlotById, plotadd } from "../controller/plotController.js";

export const plotRoute = express.Router();

plotRoute.post("/addPlot", plotadd);
plotRoute.get("/getPlotList", getAllPlots);
plotRoute.get("/getPlotById/:plotId", getPlotById); 