import { dbConnection } from "../database/db";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";

export const getPlotData = async () => {
  try {
    // Fetch all plots and customer plot IDs from the database
    const [plots] = await dbConnection.query("SELECT * FROM plots");
    const [customerPlots] = await dbConnection.query("SELECT plotId FROM customer");

    // Extract plot IDs associated with customers
    const customerPlotIds = customerPlots.map(cus => cus.plotId);

    return { plots, customerPlotIds };
  } catch (error) {
    console.error("Error fetching plot data:", error.message);
    throw new Error("Failed to fetch plot data from the database.");
  }
};

export const highlightPlotsInPDF = async (inputPdfPath, outputPdfPath) => {
  try {
    // Step 1: Fetch the data
    const { customerPlotIds } = await getPlotData();

    // Step 2: Load the existing PDF
    const pdfBytes = fs.readFileSync(inputPdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Step 3: Highlight customer-associated plots (adjust coordinates as needed)
    customerPlotIds.forEach((plotId) => {
      // Placeholder: Map plotId to actual coordinates (x, y, width, height)
      const plotCoordinates = getPlotCoordinates(plotId);

      if (plotCoordinates) {
        firstPage.drawRectangle({
          x: plotCoordinates.x,
          y: plotCoordinates.y,
          width: plotCoordinates.width,
          height: plotCoordinates.height,
          color: rgb(1, 0, 0), // Red color for highlight
          opacity: 0.5, // Semi-transparent
        });
      }
    });

    // Step 4: Save the modified PDF
    const updatedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, updatedPdfBytes);

    console.log("PDF updated and saved to", outputPdfPath);
  } catch (error) {
    console.error("Error highlighting plots in PDF:", error.message);
    throw new Error("Failed to highlight plots in the PDF.");
  }
};

// Helper function to map plotId to coordinates
const getPlotCoordinates = (plotId) => {
  // Placeholder for actual coordinates mapping logic
  const coordinatesMap = {
    1: { x: 100, y: 200, width: 50, height: 30 },
    2: { x: 150, y: 180, width: 50, height: 30 },
    3: { x: 200, y: 160, width: 50, height: 30 },
    // Add all plotId to coordinates mappings here
  };

  return coordinatesMap[plotId] || null;
};
