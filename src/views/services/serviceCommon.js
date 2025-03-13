import React, { useState, useEffect } from 'react';

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow, CFormSelect
} from '@coreui/react'

import { Card, Typography, Alert } from "@mui/material";
import serviceData from '../../../public/serviceCommon.json';
import ExportToPDF from '../../components/ExportToPDF'
import ListTable from './listTable';

const ServiceCommon = ({ name = '' }) => {
  
    const services = serviceData.services;
    const selectedService = services.find(service => service.name === name);

    if (!selectedService)
        return <h3 style={{ textAlign: "center", color: "red" }}>Service not found</h3>;
    

    const defaultMap = serviceData.defaultMap;
    const objWMTS = services.find(service => service.name === 'WMTS');
    const apiWMTS = objWMTS.port === '' ?
        `${objWMTS.host}/Vietbando/api/v1/wmts?SERVICE=WMTS&REQUEST=ServerExternal` :
        `${objWMTS.host}:${objWMTS.port}/Vietbando/api/v1/wmts?SERVICE=WMTS&REQUEST=ServerExternal`;
        
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});

    useEffect(() => {
        fetch(apiWMTS, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                const newItems = [...data.Servers, defaultMap]
                setItems(newItems)
            })
            .catch((error) => console.error('Lỗi khi đọc file JSON:', error));
    }, [apiWMTS, defaultMap]);
    // Hàm xử lý khi chọn item
    const handleSelectChange = (event) => {
        const selectedName = event.target.value;
        const foundItem = items.find(item => item.Id === selectedName);
        setSelectedItem(foundItem);    
    };

    return (
        <>
            {/* Banner Chào mừng */}
            <div style={{ marginBottom: "5px" }}>
                <Card
                    sx={{
                        p: 3,
                      
                        background: "linear-gradient(to right, rgb(59, 158, 89), #00f2fe)",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h4">🚀 Welcome to the {name} </Typography>
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
                                {/* Combobox sử dụng CoreUI CFormSelect */}
                                <CFormSelect onChange={handleSelectChange}>
                                <option value="">-- Select MapService --</option>
                                    {items.map((item, index) => (
                                        <option key={index} value={item.Id}>
                                            {item.Id}
                                        </option>
                                    ))}
                                </CFormSelect>
                                <br />                      
                            {selectedItem && (
                                <CCard className="mb-4" style={{ boxShadow: '0 4px 6px rgba(17, 16, 16, 0.1)' }}>
                                    <CCardHeader>
                                        <strong> MapService Information:</strong>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow>
                                            <CCol xs={12} sm={4}>
                                                <strong>Id:</strong> {selectedItem.Id}
                                            </CCol>
                                            <CCol xs={12} sm={4}>
                                                <strong>Host:</strong> {selectedItem.Host}
                                            </CCol>
                                            <CCol xs={12} sm={4}>
                                                <strong>Port:</strong> {selectedItem.Port}
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            )}

                            {/* Hiển thị thông tin dịch vụ */}
                            <CCard className="mb-4" style={{ boxShadow: '0 4px 6px rgba(17, 16, 16, 0.1)' }}>
                                <CCardHeader>
                                    Service Information: {selectedService.name}
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


                            {/* Hiển thị danh sách bảng từ API */}
                            <ListTable
                                host={selectedService.host}
                                port={selectedService.port}
                                apiList={selectedService.APIGetList}
                                apiDetal={selectedService.APIDetail}
                                name={selectedService.name}
                                //SERVERNAME= ${Id}
                                serverName={selectedItem.Id}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};


export default ServiceCommon

