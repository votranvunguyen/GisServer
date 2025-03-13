import React from "react";
import PropTypes from "prop-types";
import { CChartLine } from "@coreui/react-chartjs";
import { CSpinner } from "@coreui/react";


const CPUChart = ({ data }) => {
  console.log("Dữ liệu truyền vào biểu đồ:", data);

  if (!data || data.length === 0) {
    return (
      <div>
        <CSpinner color="info" />
        <p>Loading....</p>
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
          label: "Used CPU (%)",
          data: data.map((d) => d.CPU), // Giá trị usedCPU
          borderColor: "#FF4500", // Màu OrangeRed
          backgroundColor: "rgba(255, 69, 0, 0.2)",
          tension: 0.4, // Đường cong mềm mại
          borderWidth: 2,
          pointBackgroundColor: "#FF4500",
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
          title: { display: true, text: "CPU (%)", font: { size: 16 } },
          grid: { color: "rgba(200, 200, 200, 0.2)" },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    }}
  />
  

  );
};

CPUChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      CPU: PropTypes.number.isRequired,
      totalprocsRunning: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CPUChart;
