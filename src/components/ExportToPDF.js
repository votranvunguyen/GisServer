import React from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const ExportToPDF = () => {
  const handleExportPDF = () => {
    const input = document.body; // Xuất toàn bộ màn hình

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("VBDGeoServer_export.pdf");
    });
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExportPDF}>
      Export
    </Button>
  );
};

export default ExportToPDF;
