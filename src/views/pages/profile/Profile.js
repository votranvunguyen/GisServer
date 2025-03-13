import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
  CImage, CButton
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import serviceData from '../../../../public/serviceCommon.json';
import avatar8 from '../../../assets/images/avatars/default_login.jpg'

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const objectAuthen = serviceData.authentication
  const API_REGISTER = objectAuthen.APIGet_Register
  const productid = objectAuthen.Product_id
  const tokenRegister = localStorage.getItem("vbd_token");

  // Cấu hình host và port (thay thế giá trị thực tế)


  useEffect(() => {
    const url = `${API_REGISTER}?productid=${productid}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': tokenRegister, // Giá trị token theo yêu cầu
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        if (result.code === 200 && result.data && result.data.users) {
          // Lấy phần tử đầu tiên của mảng users
          setUserData(result.data.users[result.data.users.length - 1]);

        } else {
          console.error('Lỗi API:', result.message);
        }
      })
      .catch(error => {
        console.error('Lỗi khi fetch user data:', error);
        // Nếu cần chuyển hướng về trang login khi có lỗi
        navigate("/login")
      });
  }, [productid, navigate]);
 

  return (
    <CCard className="mx-auto" style={{ maxWidth: '800px' }}>
      <CCardHeader>
        <h2>Profile Info</h2>
      </CCardHeader>
      <CCardBody>
        <div className="text-center mb-3">
          {userData.avatar ? (
            <CImage
              src={avatar8}
              rounded
              className="mb-2"
              style={{ width: '100px', height: '100px' }}
            />
          ) : (
            <div
              className="bg-secondary rounded-circle mb-2"
              style={{ width: '100px', height: '100px', lineHeight: '100px', color: '#fff', fontSize: '2rem' }}
            >
              {userData.name ? userData.name.charAt(0) : ''}
            </div>
          )}
        </div>
        <CListGroup flush>
          <CListGroupItem>
            <strong>Full Name:</strong> {userData.name}
          </CListGroupItem>
          <CListGroupItem>
            <strong>Username:</strong> {userData.user_name}
          </CListGroupItem>
          <CListGroupItem>
            <strong>Email:</strong> {userData.email}
          </CListGroupItem>
          <CListGroupItem>
            <strong>Phone Number:</strong> {userData.phone_number}
          </CListGroupItem>
          <CListGroupItem>
            <strong>Address:</strong> {userData.address}
          </CListGroupItem>
          <CListGroupItem>
            <strong>ID:</strong> {userData.id}
          </CListGroupItem>
        </CListGroup>
        <div className="text-center mt-4">
          <CButton color="primary" onClick={() => navigate("/about")}>
            Go to About
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default Profile;
