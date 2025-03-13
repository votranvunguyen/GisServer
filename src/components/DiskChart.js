import PropTypes from "prop-types";
import { CChartPie } from "@coreui/react-chartjs";
import { CSpinner } from "@coreui/react";

const DiskChart = ({ data }) => {
    // Kiểm tra nếu dữ liệu hợp lệ
    const latestData = data && data.length > 0 ? data[data.length - 1] : null;

    if (!latestData) {
        return <div>
            <CSpinner color="info" />
            <p>Loading....</p>
        </div>;
    }

    const { usedDisk, freeDisk } = latestData;

    return (
        <>
            <CChartPie
                redraw
                data={{
                    labels: ["Used Disk", "Free Disk"],
                    datasets: [
                        {
                            data: [usedDisk, freeDisk],
                            backgroundColor: ["#FF6384", "#36A2EB"],
                            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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
                }}
            />

        </>
    );
};

DiskChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            time: PropTypes.string.isRequired,
            usedDisk: PropTypes.number.isRequired,
            freeDisk: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default DiskChart;
