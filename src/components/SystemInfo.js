import PropTypes from "prop-types";
import { Alert, Grid, Typography } from "@mui/material";
import { CSpinner } from "@coreui/react";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import SpeedIcon from "@mui/icons-material/Speed";

const SystemInfo = ({ data }) => {
    // Kiểm tra nếu dữ liệu hợp lệ
    const latestData = data && data.length > 0 ? data[data.length - 1] : null;

    if (!latestData) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <CSpinner color="info" />
                <Typography variant="body1">Loading system data...</Typography>
            </div>
        );
    }

    // Tính toán màu sắc dựa trên mức sử dụng CPU và RAM
    const getSeverity = (value, threshold) => {
        return value > threshold ? "error" : value > threshold * 0.7 ? "warning" : "info";
    };

    return (
        <Grid container spacing={2} padding={2}>
            {/* Cột 1: RAM & CPU */}
            <Grid item xs={12} md={6}>
                <Alert severity="info">
                    <SpeedIcon /> ⚡ Time: {latestData.time}
                </Alert>
                <Alert severity="info">
                    <MemoryIcon /> ⚡ Total RAM (GB): {latestData.totalRam}
                </Alert>
                <Alert severity="info">
                    <MemoryIcon /> ⚡ Free RAM (GB): {latestData.freeRam}
                </Alert>
                <Alert severity={getSeverity(latestData.usedRam, latestData.totalRam)}>
                    <MemoryIcon /> ⚡ Used RAM (GB): {latestData.usedRam}
                </Alert>
                <Alert severity={getSeverity(latestData.CPU, 100)}>
                    <SpeedIcon /> ⚡ CPU Usage (%): {latestData.CPU}
                </Alert>
            </Grid>

            {/* Cột 2: Disk & Network */}
            <Grid item xs={12} md={6}>
                <Alert severity="info">
                    <StorageIcon /> ⚡ Total Disk (GB): {latestData.freeDisk + latestData.usedDisk}
                </Alert>
                <Alert severity="info">
                    <StorageIcon /> ⚡ Free Disk (GB): {latestData.freeDisk}
                </Alert>
                <Alert severity="warning">
                    <StorageIcon /> ⚡ Used Disk (GB): {latestData.usedDisk}
                </Alert>
                <Alert severity="info">
                    <NetworkCheckIcon /> ⚡ Net Receive (Kbps): {latestData.netRecive}
                </Alert>
                <Alert severity="info">
                    <NetworkCheckIcon /> ⚡ Net Transmit (Kbps): {latestData.netTransmit}
                </Alert>
            </Grid>
        </Grid>
    );
};

SystemInfo.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            time: PropTypes.string.isRequired,
            totalRam: PropTypes.number.isRequired,
            freeRam: PropTypes.number.isRequired,
            usedRam: PropTypes.number.isRequired,
            freeDisk: PropTypes.number.isRequired,
            usedDisk: PropTypes.number.isRequired,
            netRecive: PropTypes.number.isRequired,
            netTransmit: PropTypes.number.isRequired,
            CPU: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default SystemInfo;
