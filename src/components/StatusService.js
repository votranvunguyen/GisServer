import { useEffect, useState } from "react";
import axios from "axios";
import RamChart from "./RamChart";
import CPUChart from "./CPUChart";
import DiskChart from "./DiskChart";
import NetworkChart from "./NetworkChart";
import SystemInfo from "./SystemInfo";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'


const previousCpuData = {};
const parsePrometheusData = (data) => {
  const lines = data.split("\n");
  const result = {};
  const cpuData = {}; // Gom nhóm dữ liệu CPU theo từng CPU

  for (const line of lines) {
    if (line.startsWith("#") || line.trim() === "") continue;

    const parts = line.split(" ");
    if (parts.length === 2) {
      const key = parts[0];
      const value = parseFloat(parts[1]);
      result[key] = value;

      // Nếu key chứa "node_cpu_seconds_total", gom nhóm theo cpu và mode.
      if (key.startsWith("node_cpu_seconds_total")) {
        // key dạng: node_cpu_seconds_total{cpu="6",mode="system"} 6037351562500
        const match = key.match(/cpu="(\d+)",mode="([^"]+)"/);
        if (match) {
          const cpu = match[1];       // ví dụ "6"
          const mode = match[2];      // ví dụ "system", "idle", "user",...
          if (!cpuData[cpu]) {
            cpuData[cpu] = {};
          }
          cpuData[cpu][mode] = (cpuData[cpu][mode] || 0) + value;
        }
      }
    }
  }
  console.log(cpuData);

  // Tính % CPU sử dụng cho mỗi CPU và thêm vào đối tượng result với key "node_CPU_pecent"
  //result["node_CPU_pecent"] = calculateCpuUsage(cpuData);
  return result;
};

// Hàm tính % CPU sử dụng cho mỗi CPU
function calculateCpuUsage(cpuData) {
  const usagePercentages = {};
  for (const cpu in cpuData) {
    const modes = cpuData[cpu];

    // Lấy dữ liệu lần trước để tính delta
    const prevModes = previousCpuData[cpu] || {};
    previousCpuData[cpu] = { ...modes }; // Cập nhật dữ liệu cũ để lần sau tính delta

    // Lấy giá trị hiện tại và trước đó của các mode (nếu không có thì gán 0)
    const currUser = modes["user"] || 0;
    const currSystem = modes["system"] || 0;
    const currIRQ = modes["irq"] || 0;
    const currSoftIRQ = modes["softirq"] || 0;
    const currIdle = modes["idle"] || 0;
    const currIOwait = modes["iowait"] || 0;

    const prevUser = prevModes["user"] || 0;
    const prevSystem = prevModes["system"] || 0;
    const prevIRQ = prevModes["irq"] || 0;
    const prevSoftIRQ = prevModes["softirq"] || 0;
    const prevIdle = prevModes["idle"] || 0;
    const prevIOwait = prevModes["iowait"] || 0;

    // Tính delta cho từng loại
    const deltaUser = currUser - prevUser;
    const deltaSystem = currSystem - prevSystem;
    const deltaIRQ = currIRQ - prevIRQ;
    const deltaSoftIRQ = currSoftIRQ - prevSoftIRQ;
    const deltaIdle = currIdle - prevIdle;
    const deltaIOwait = currIOwait - prevIOwait;

    // Áp dụng công thức tính toán
    const deltaActive = deltaUser + deltaSystem + deltaIRQ + deltaSoftIRQ;
    const deltaTotal = deltaActive + (deltaIdle + deltaIOwait);

    // Tránh chia cho 0
    let percent = deltaTotal > 0 ? (deltaActive / deltaTotal) * 100 : 0;

    // Kiểm tra NaN và gán giá trị mặc định
    if (isNaN(percent)) {
      percent = 0;
    }

    usagePercentages[cpu] = percent.toFixed(2);
  }
  return usagePercentages;
}

function calculatePercentCpu(cpuObj) {
  const cpus = Object.keys(cpuObj);
  const size = cpus.length;
  if (size === 0) return 0; // Nếu không có CPU nào, trả về 0

  // Tính tổng các giá trị (chuyển đổi từ chuỗi sang số)
  let total = 0;
  for (const key of cpus) {
    total += parseFloat(cpuObj[key]);
  }
  console.log(cpuObj);
  // Theo yêu cầu: chia tổng cho (size * 100) để lấy tỉ lệ (0-1)
  const percentCpu = total / size;
  // Trả về kết quả làm tròn 2 chữ số thập phân
  return percentCpu.toFixed(2);
}

const parseData = (rawData) => {
  const bytesToKB = (bytes) => (bytes / 1024).toFixed(2); // Chuyển bytes → KB
  const bytesToMB = (bytes) => (bytes / 1_048_576).toFixed(2); // Chuyển bytes → MB
  const bytesToGB = (bytes) => (bytes / 1_073_741_824).toFixed(2); // Chuyển bytes → GB
  // console.log(rawData.node_CPU_pecent);
  return {
    time: new Date().toLocaleTimeString(),  // Lấy thời gian hiện tại
    totalRam: parseFloat(bytesToGB(rawData.node_memory_MemTotal_bytes)),
    freeRam: parseFloat(bytesToGB(rawData.node_memory_MemFree_bytes)),
    usedRam: parseFloat(bytesToGB(
      rawData.node_memory_MemTotal_bytes - rawData.node_memory_MemFree_bytes
    )),
    freeDisk: parseFloat(bytesToGB(rawData.node_filesystem_free_bytes)),
    usedDisk: parseFloat(bytesToGB(rawData.node_filesystem_size_bytes - rawData.node_filesystem_free_bytes)),
    netRecive: parseFloat(bytesToKB(rawData.node_network_receive_bytes_total)),
    netTransmit: parseFloat(bytesToKB(rawData.node_network_transmit_bytes_total)),


    CPU: parseFloat(rawData.node_cpu_percent),
    totalprocsRunning: 100,
  };
};

function StatusService({ apiUrl, timeFetch }) {
  const [objData, setObjData] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(apiUrl, { responseType: "text" });
        // Chuyển đổi dữ liệu từ response
        const newData = parseData(parsePrometheusData(response.data));
        // Cập nhật mảng dữ liệu RAM, chỉ giữ lại 10 điểm cuối
        setObjData((prevData) => [...prevData, newData].slice(-10));
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    // Gọi API mỗi n miligiây
    const intervalId = setInterval(fetchStatus, timeFetch);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              System info
            </CCardHeader>
            <CCardBody className="chart-container">
              <SystemInfo data={objData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              Ram Chart
            </CCardHeader>
            <CCardBody className="chart-container">
              <RamChart data={objData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              CPU Chart
            </CCardHeader>
            <CCardBody className="chart-container">
              <CPUChart data={objData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              Network Chart
            </CCardHeader>
            <CCardBody className="chart-container">
              <NetworkChart data={objData} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Disk Usage</CCardHeader>
            <CCardBody style={{ height: "310px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <DiskChart data={objData} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default StatusService;
