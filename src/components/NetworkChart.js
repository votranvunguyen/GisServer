import React from "react";
import PropTypes from "prop-types";
import { CSpinner } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";

const NetworkChart = ({ data }) => {
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
      <>
     <CChartLine
  redraw
  data={{
    labels: data.map((d) => d.time), // Trục X - Thời gian
    datasets: [
      {
        label: "Network Receive (Kbps)",
        data: data.map((d) => d.netRecive), // Giá trị netRecive
        borderColor: "#1E90FF", // Màu DodgerBlue
        backgroundColor: "rgba(30, 144, 255, 0.3)",
        tension: 0.4, // Đường cong mềm
        borderWidth: 2,
        pointBackgroundColor: "#1E90FF",
        pointRadius: 4,
      },
      {
        label: "Network Transmit (Kbps)",
        data: data.map((d) => d.netTransmit), // Giá trị netTransmit
        borderColor: "#32CD32", // Màu LimeGreen
        backgroundColor: "rgba(50, 205, 50, 0.3)",
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#32CD32",
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
        title: { display: true, text: "Speed (Kbps)", font: { size: 16 } },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
        beginAtZero: true,
      },
    },
  }}
/>

    </>
  );
};

NetworkChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      netRecive: PropTypes.number.isRequired,
      netTransmit: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default NetworkChart;
