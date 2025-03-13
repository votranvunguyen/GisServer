import React from "react";
import PropTypes from "prop-types";
import { CChartLine } from "@coreui/react-chartjs";
import { CSpinner } from "@coreui/react";

const RamChart = ({ data }) => {
  console.log("Dữ liệu truyền vào biểu đồ:", data);

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <CSpinner color="info" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <CChartLine
    redraw
    data={{
      labels: data.map((d) => d.time), // Trục X - Thời gian
      datasets: [
        {
          label: "Used RAM (GB)",
          data: data.map((d) => d.usedRam), // Giá trị usedRam
          borderColor: "#228B22", // Màu ForestGreen
          backgroundColor: "rgba(34, 139, 34, 0.2)",
          tension: 0.4, // Đường cong mềm mại
          borderWidth: 2,
          pointBackgroundColor: "#228B22",
          pointRadius: 4,
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: { size: 14, weight: "bold" },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
        },
      },
      scales: {
        x: {
          display: true,
          title: { display: true, text: "Time", font: { size: 16 } },
          grid: { color: "rgba(200, 200, 200, 0.2)" },
        },
        y: {
          display: true,
          title: { display: true, text: "Total RAM (GB)", font: { size: 16 } },
          grid: { color: "rgba(200, 200, 200, 0.2)" },
          suggestedMin: 0,
          suggestedMax: Math.max(...data.map((d) => d.totalRam)),
        },
      },
    }}
  />
  
  );
};

RamChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      totalRam: PropTypes.number.isRequired,
      usedRam: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default RamChart;
