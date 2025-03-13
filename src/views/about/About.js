// AboutPage.js
import React from 'react';
// Import dữ liệu JSON từ folder khác (src/config)
import serviceData from '../../../public/serviceCommon.json';
// Import logo theo cách thông thường
import logoVBD from '../../../public/logoVBD.png';

import { CCard, CCardBody, CCardHeader, CListGroup, CListGroupItem, CImage } from "@coreui/react";
import { Card, Typography } from "@mui/material";
const AboutPage = () => {
  // Lấy thông tin about từ file JSON
  const aboutData = serviceData.about;
  const buildInfo = aboutData["build_Information"];

  return (
    <div className="d-flex justify-content-center">
      <CCard className="mb-4" style={{ boxShadow: '0 4px 6px rgba(17, 16, 16, 0.1)' }}>

        <Card
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(to right, rgb(66, 78, 78),rgb(229, 230, 241))",
            color: "black",
            textAlign: "center",
          }}
        >
        
          <Typography variant="h2">{aboutData.title}</Typography>
          {/* Hiển thị logo */}

          <CImage src={logoVBD} alt="Logo VBDGeoServer" width={200} />


          {/* Tiêu đề phụ */}
          <Typography variant="h4">🌍 {aboutData.titleChild} </Typography>
          
        </Card>
        <CCardBody>
          {/* Tiêu đề chính */}


          {/* Thông tin Build */}
          <CCard className="mt-3">
            <CCardHeader> <strong>Build Information </strong></CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem><strong>Version:</strong> {buildInfo.version}</CListGroupItem>
                <CListGroupItem><strong>Build Date:</strong> {buildInfo.buildDate}</CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>

          {/* More Information */}
          <CCard className="mt-3">
            <CCardHeader> <strong>More Information</strong></CCardHeader>
            <CCardBody>
              {aboutData["more_Information"].split("\n").map((line, index) => (
                <p key={index} className="mb-1">{line}</p>
              ))}
            </CCardBody>
          </CCard>

          {/* Vietbando Information */}
          <CCard className="mt-3">
            <CCardHeader> <strong>Vietbando Information </strong></CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {aboutData["vietbando_Information"].map((info, index) => (
                  <CListGroupItem key={index}>
                    <a href={info} target="_blank" rel="noopener noreferrer">{info}</a>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>

          {/* Useful Links */}
          <CCard className="mt-3">
            <CCardHeader> <strong>Useful Links </strong></CCardHeader>
            <CCardBody>
              <CListGroup flush>
                {aboutData["useful_Links"].map((link, index) => (
                  <CListGroupItem key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>

        </CCardBody>
      </CCard>
    </div>
  );
};

export default AboutPage;
