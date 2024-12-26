import express from "express";
import { allPlotsDetails, getAllPlots, getAvailabalePlot, getPlotById,  plotadd } from "../controller/plotController.js";

export const plotRoute = express.Router();

plotRoute.post("/addPlot", plotadd);
plotRoute.get("/getPlotList", getAllPlots);
plotRoute.get("/availablePlots", getAvailabalePlot);
plotRoute.get("/getPlotById/:plotId", getPlotById); 
plotRoute.get("/getAllLength", allPlotsDetails); 