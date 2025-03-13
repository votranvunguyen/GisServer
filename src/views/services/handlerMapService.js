import React, { useState, useEffect } from 'react'

import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormTextarea,
    CFormInput,
    CRow,
    CCol
} from '@coreui/react'

import { Card, Typography } from "@mui/material";
import serviceData from '../../../public/serviceCommon.json';
import ExportToPDF from '../../components/ExportToPDF'
import { useNavigate } from "react-router-dom";

const HandleMapService = () => {
    const defaultMap = serviceData.defaultMap;
    const [items, setItems] = useState([])
    const [refreshKey, setRefreshKey] = useState(0); // State trigger để useEffect chạy lại
    const [visible, setVisible] = useState(false) // Hiển thị modal Add
    const [newId, setNewId] = useState('')
    const [newHost, setNewHost] = useState('')
    const [newPort, setNewPort] = useState('')
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Hiển thị modal confirm Delete
    const [itemToDelete, setItemToDelete] = useState(null); // Lưu lại Id cần xóa

    const navigate = useNavigate();

    // Các hàm parse token, extract role, hasRole
    function parseJwt(token) {
        try {
            if (token === '')
                navigate("/login");
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
            alert("Lỗi parse token:", error);
            navigate("/login");
        }
    };

    function extractUserRoleData(payload) {
        if (!payload || !payload.authorization) return null;
        let authArray;
        try {
            authArray = JSON.parse(payload.authorization);
        } catch (error) {
            console.error("Lỗi parse authorization:", error);
            return null;
        }
        // Trả về mảng các đối tượng chứa userid và roleid
        return authArray.map((item) => ({
            userid: item.userid,
            roleid: item.roleid,
        }));
    };

    function hasRole(userRoles, roleValid) {
        return userRoles.some((role) => role.roleid === roleValid);
    };

    const token = parseJwt(localStorage.getItem("vbd_token"));
    const userRoles = extractUserRoleData(token);
    const objectRole = serviceData.authentication.DefineRole;
    const roleAdmin = hasRole(userRoles, objectRole.admin_system);
    const roleEditor = hasRole(userRoles, objectRole.editor);

    const serviceCommon = serviceData.services;

    // Lọc dịch vụ phù hợp với name, nếu không có thì bỏ qua
    const objWMTS = serviceCommon.find(service => service.name === 'WMTS');
    const objWMS = serviceCommon.find(service => service.name === 'WMS');
    const objWFS = serviceCommon.find(service => service.name === 'WFS');

    const apiWMS = objWMS.port === '' ?
        `${objWMS.host}/Vietbando/api/v1/wms?SERVICE=WMS&REQUEST=ServerExternal` :
        `${objWMS.host}:${objWMS.port}/Vietbando/api/v1/wms?SERVICE=WMS&REQUEST=ServerExternal`;

    const apiWMTS = objWMTS.port === '' ?
        `${objWMTS.host}/Vietbando/api/v1/wmts?SERVICE=WMTS&REQUEST=ServerExternal` :
        `${objWMTS.host}:${objWMTS.port}/Vietbando/api/v1/wmts?SERVICE=WMTS&REQUEST=ServerExternal`;

    const apiWFS = objWFS.port === '' ?
        `${objWFS.host}/Vietbando/api/v1/wfs?SERVICE=WFS&REQUEST=ServerExternal` :
        `${objWFS.host}:${objWFS.port}/Vietbando/api/v1/wfs?SERVICE=WFS&REQUEST=ServerExternal`;

    useEffect(() => {
        fetch(apiWMTS, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                // Nếu API trả về data.Servers dưới dạng mảng, ta kết hợp với defaultMap
                setItems(data.Servers);
                setItems(prevItems => [...prevItems, defaultMap]);
            })
            .catch((error) => console.error('Lỗi khi đọc file JSON:', error));
    }, [refreshKey]);

    const selectedService = items[0];

    if (!selectedService) {
        return <h3 style={{ textAlign: "center", color: "red" }}>Service not found</h3>;
    }

    // Hàm hiển thị modal xác nhận xóa
    const handleDeleteClick = (Id = '') => {
        setItemToDelete(Id);
        setDeleteModalVisible(true);
    };

    // Hàm thực hiện gọi API xóa sau khi xác nhận
    // Hàm thực hiện gọi API xóa sau khi xác nhận
    const confirmDelete = () => {
        // Mã hóa itemToDelete để xử lý ký tự đặc biệt
        const encodedId = encodeURIComponent(itemToDelete);

        // Gọi API WMS
        fetch(`${apiWMS}&Name=${encodedId}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((result) => {
                if (result.success !== "true") {
                    alert('WMS Delete Server failed!');
                    return;
                }
            })
            .catch((error) => {
                console.error('Lỗi khi fetch API WMS:', error)
            });

        // Gọi API WMTS
        fetch(`${apiWMTS}&Name=${encodedId}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((result) => {
                if (result.success !== "true") {
                    alert('WMTS Delete Server failed!');
                    return;
                }
            })
            .catch((error) => {
                console.error('Lỗi khi fetch API WMTS:', error)
            });

        // Gọi API WFS
        fetch(`${apiWFS}&Name=${encodedId}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((result) => {
                if (result.success !== "true") {
                    alert('WFS Delete Server failed!');
                    return;
                }
            })
            .catch((error) => {
                console.error('Lỗi khi fetch API WFS:', error)
            });

        setDeleteModalVisible(false);
        setItemToDelete(null);
        setRefreshKey(prev => prev + 1);
    };


    const handleAdd = () => {
        const newBody = { 'Id': newId, 'Host': newHost, 'Port': newPort };
        const bodyPayload = JSON.stringify(newBody);
        try {
            // Gọi API WMS
            fetch(apiWMS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: bodyPayload,
            }).then((response) => response.json())
                .then((result) => {
                    if (result.success !== "true") {
                        alert('WMS Addnew Server failed!');
                        return;
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi fetch API WMS:', error)
                });

            // Gọi API WMTS
            fetch(apiWMTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: bodyPayload,
            }).then((response) => response.json())
                .then((result) => {
                    if (result.success !== "true") {
                        alert('WMTS Addnew Server failed!');
                        return;
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi fetch API WMTS:', error)
                });

            // Gọi API WFS
            fetch(apiWFS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: bodyPayload,
            }).then((response) => response.json())
                .then((result) => {
                    if (result.success !== "true") {
                        alert('WFS Addnew Server failed!');
                        return;
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi fetch API WFS:', error)
                });

            alert('Add new success!');
            setTimeout(() => {
                setVisible(false)
                setRefreshKey(prev => prev + 1);
            }, 1500)
        } catch (err) {
            alert('Add new failed!');
            console.error(err);
            return;
        }
    };

    const filteredItems = items.filter((item) =>
        item.Id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div style={{ marginBottom: "20px" }}>
                <Card
                    sx={{
                        p: 3,
                        mb: 3,
                        background: "linear-gradient(to right, rgb(59, 158, 89), #00f2fe)",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h4">🚀 Welcome to the VBDMapService </Typography>
                    <Typography variant="body1">Here is an overview of today's system.</Typography>
                </Card>
            </div>
            <CRow>
                <CCol className="text-end">
                    <ExportToPDF />
                </CCol>
            </CRow>
            <br />
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                        <CCardBody>
                            {/* Hiển thị danh sách bảng từ API */}
                            <CCard>
                                <CCardHeader>
                                    <div className="d-flex justify-content-between">
                                        <span>List MapService</span>
                                        {(roleAdmin || roleEditor) && (
                                            <CButton color="primary" onClick={() => setVisible(true)} >+ Add</CButton>
                                        )}
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <CFormInput
                                        type="text"
                                        placeholder="Search by Name"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="mb-3"
                                    />
                                    <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                                        <CTable align="middle" className="mb-0 border" hover responsive>
                                            <CTableHead className="text-nowrap">
                                                <CTableRow >
                                                    <CTableHeaderCell className="bg-body-tertiary text-center">STT</CTableHeaderCell>
                                                    <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
                                                    <CTableHeaderCell className="bg-body-tertiary text-center">Host</CTableHeaderCell>
                                                    <CTableHeaderCell className="bg-body-tertiary text-center">Port</CTableHeaderCell>
                                                    <CTableHeaderCell className="bg-body-tertiary text-center">Action</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {filteredItems.map((item, index) => {
                                                    return (
                                                        <CTableRow key={index} >
                                                            <CTableDataCell className="bg-body-tertiary text-center">{index + 1}</CTableDataCell>
                                                            <CTableDataCell className="bg-body-tertiary text-center">{item.Id}</CTableDataCell>
                                                            <CTableDataCell className="bg-body-tertiary text-center">{item.Host}</CTableDataCell>
                                                            <CTableDataCell className="bg-body-tertiary text-center">{item.Port}</CTableDataCell>
                                                            <CTableDataCell className="bg-body-tertiary text-center">
                                                                {(roleAdmin || roleEditor) && (
                                                                    <CButton color="danger" size="sm" onClick={() => handleDeleteClick(item.Id)}>
                                                                        Delete
                                                                    </CButton>
                                                                )}
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    )
                                                })}
                                            </CTableBody>
                                        </CTable>
                                    </div>
                                </CCardBody>

                                {/* Modal Add MapService */}
                                <CModal size='xl' visible={visible} onClose={() => setVisible(false)}>
                                    <CModalHeader>
                                        <CModalTitle>Add New MapService</CModalTitle>
                                    </CModalHeader>
                                    <CModalBody>
                                        <CFormInput
                                            type="text"
                                            placeholder="Id"
                                            value={newId}
                                            onChange={(e) => setNewId(e.target.value)}
                                            className="mb-3"
                                        />
                                        <CFormInput
                                            type="text"
                                            placeholder="Host"
                                            value={newHost}
                                            onChange={(e) => setNewHost(e.target.value)}
                                            className="mb-3"
                                        />
                                        <CFormInput
                                            type="text"
                                            placeholder="Port"
                                            value={newPort}
                                            onChange={(e) => setNewPort(e.target.value)}
                                            className="mb-3"
                                        />
                                    </CModalBody>
                                    <CModalFooter>
                                        <CButton color="secondary" onClick={() => setVisible(false)}>Hủy</CButton>
                                        <CButton color="primary" onClick={handleAdd}>Add</CButton>
                                    </CModalFooter>
                                </CModal>

                                {/* Modal xác nhận Delete */}
                                <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                                    <CModalHeader>
                                        <CModalTitle>Confirm deletion</CModalTitle>
                                    </CModalHeader>
                                    <CModalBody>
                                        Are you sure you want to delete the item?: <strong>{itemToDelete}</strong>?
                                    </CModalBody>
                                    <CModalFooter>
                                        <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
                                            No
                                        </CButton>
                                        <CButton color="danger" onClick={confirmDelete}>
                                            Yes
                                        </CButton>
                                    </CModalFooter>
                                </CModal>

                            </CCard>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default HandleMapService;
