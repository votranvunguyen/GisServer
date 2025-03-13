import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import { Card, Typography, Alert } from "@mui/material";
import GetStatusComponent from 'src/components/StatusService'
import serviceData from '../../../public/serviceCommon.json';;
import ExportToPDF from '../../components/ExportToPDF'
import ValidUser from 'src/components/Authentication/ValidUser'
import { useNavigate } from 'react-router-dom'

// Hàm giải mã JWT, nếu token rỗng hoặc parse thất bại thì chuyển hướng về "/login"
function parseJwt(token, navigate) {
  try {
    if (!token) {
      navigate("/login");
      return null;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    alert("Lỗi parse token: " + error.message);
    navigate("/login");
    return null;
  }
}

// Hàm trích xuất thông tin user roles từ payload, trả về mảng (rỗng nếu không hợp lệ)
function extractUserRoleData(payload) {
  if (!payload || !payload.authorization) return [];
  try {
    const authArray = JSON.parse(payload.authorization);
    return authArray.map((item) => ({
      userid: item.userid,
      roleid: item.roleid,
    }));
  } catch (error) {
    console.error("Lỗi parse authorization:", error);
    return [];
  }
}

// Hàm kiểm tra xem trong mảng userRoles có roleid phù hợp hay không
function hasRole(userRoles, roleValid) {
  return userRoles.some((role) => role.roleid === roleValid);
}

const Dashboard = () => {
  const navigate = useNavigate();
  const services = serviceData.services;
  const timeFetch = serviceData.timeFetch;
  const [isShowCRow, setIsShowCRow] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0]);

  // Lấy token từ localStorage và parse nó
  const rawToken = localStorage.getItem("vbd_token");
  const token = parseJwt(rawToken, navigate);
  const userRoles = extractUserRoleData(token);
  const objectRole = serviceData.authentication.DefineRole;
  const roleAdmin = hasRole(userRoles, objectRole.admin_system);
  const roleEditor = hasRole(userRoles, objectRole.editor);

  // Nếu không có quyền admin hoặc editor, chuyển hướng về trang chủ
  useEffect(() => {
    if (!roleAdmin && !roleEditor) {
      navigate("/");
    }
  }, [roleAdmin, roleEditor, navigate]);

  return (
    <>
      <ValidUser onLoaded={() => setIsShowCRow(true)} />
      {isShowCRow && (
        <>
          <div style={{ marginBottom: "20px" }}>
            {/* Banner Chào mừng */}
            <Card
              sx={{
                p: 3,
                mb: 3,
                background: "linear-gradient(to right, #4facfe, #00f2fe)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography variant="h4">🚀 Welcome to the Dashboard!</Typography>
              <Typography variant="body1">
                Here is an overview of today's system.
              </Typography>
            </Card>
          </div>

          <CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardBody>
                  <div style={{ padding: "20px" }}>
                    {/* Hiển thị nút cho mỗi dịch vụ */}
                    <CRow>
                      <CCol>
                        <h3>Select service</h3>
                      </CCol>
                      <CCol className="text-end">
                        <ExportToPDF />
                      </CCol>
                    </CRow>

                    <br />
                    <CRow className="mb-4" xs={{ gutter: 4 }}>
                      {services.map((service, index) => (
                        <CCol key={index} sm={6} xl={4} xxl={3}>
                          <CButton
                            color="primary"
                            className="mb-3 w-100"
                            onClick={() => setSelectedService(service)}
                          >
                            {service.name}
                          </CButton>
                        </CCol>
                      ))}

                      <Alert severity="info">
                        ⚡ Data is updated every {timeFetch / 1000} seconds.
                      </Alert>

                      {/* Hiển thị thông tin dịch vụ được chọn */}
                      {selectedService && (
                        <CCard>
                          <CCardHeader>
                            <strong> Service Information:</strong>{" "}
                            <strong>{selectedService.name}</strong>
                          </CCardHeader>
                          <CCardBody>
                            <CRow>
                              <CCol xs={12} sm={6}>
                                <strong>Host:</strong> {selectedService.host}
                              </CCol>
                              <CCol xs={12} sm={6}>
                                <strong>Port:</strong> {selectedService.port}
                              </CCol>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      )}
                    </CRow>
                  </div>
                  <CRow>
                    <GetStatusComponent
                      apiUrl={
                        selectedService.port === 0
                          ? `${selectedService.host}${selectedService.APIstatus}`
                          : `${selectedService.host}:${selectedService.port}${selectedService.APIstatus}`
                      }
                      timeFetch={timeFetch}
                    />
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
}

export default Dashboard;
