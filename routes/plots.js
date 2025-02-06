import express from "express";
import { allPlotsDetails, getAllPlots, getAvailabalePlot, getAvailabalePlotByprojctId, getPlotById,  getPlotsByProjectId,  getSellPlotsByProjectId,  plotadd } from "../controller/plotController.js";

export const plotRoute = express.Router();

plotRoute.post("/addPlot", plotadd);
plotRoute.get("/getPlotList", getAllPlots);
plotRoute.get("/availablePlots", getAvailabalePlot);
plotRoute.get("/getPlotById/:plotId", getPlotById); 
plotRoute.get("/getAllLength", allPlotsDetails); 
plotRoute.get("/getPlotsByProjectId/:projectId", getPlotsByProjectId); 
plotRoute.get("/getAvailablePlots/:projectId", getAvailabalePlotByprojctId); 
plotRoute.get("/getSellPlotsByProjectId/:projectId", getSellPlotsByProjectId); 