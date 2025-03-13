import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CAlert,
  CRow,
  CCol,
} from '@coreui/react';
import ValidUser from 'src/components/Authentication/ValidUser';
import serviceData from '../../../public/serviceCommon.json';

const UpdatePassword = () => {
  const [isShowCRow, setIsShowCRow] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const objectAuthen = serviceData.authentication;
  const API_REGISTER = objectAuthen.APIGet_Register;
  const productid = objectAuthen.Product_id;
  const tokenRegister = localStorage.getItem('vbd_token');

  // Kiểm tra token khi component mount
  useEffect(() => {
    if (!tokenRegister) {
      navigate('/login');
    }
  }, [tokenRegister, navigate]);

  function parseJwt(token) {
    try {
      if (!token) {
        navigate('/login');
        return null;
      }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error.message);
      navigate('/login');
      return null;
    }
  }

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Kiểm tra hợp lệ các trường nhập liệu
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all information!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Confirmation password does not match!');
      return;
    }

    const parsedToken = parseJwt(tokenRegister);
    if (!parsedToken || !parsedToken.aud) {
      // Nếu token không hợp lệ, parseJwt đã chuyển hướng về /login
      return;
    }
    const id_user = parsedToken.aud;

    // Xây dựng API URL và body dữ liệu
    const apiUrl = `${API_REGISTER}?productid=${productid}`;
    const body = {
      id: id_user,
      new_password: newPassword,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: tokenRegister,
        },
        body: JSON.stringify(body),
      });

      // Kiểm tra trạng thái của response
      if (response.ok) {
        alert('Password updated successfully!');
        // Xóa token và chuyển hướng về trang đăng nhập sau 2 giây
        localStorage.removeItem('vbd_token');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        // Nếu response không ok, hiển thị thông báo lỗi từ API (nếu có)
        const errorData = await response.json();
        alert(errorData.message || 'Password update failed!');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      alert('An error occurred while updating password!');
    }
  };

  return (
    <>
      <ValidUser onLoaded={() => setIsShowCRow(true)} />
      {isShowCRow && (
        <CCard className="shadow-sm" style={{ maxWidth: '600px', margin: '20px auto' }}>
          <CCardHeader style={{ backgroundColor: '#4CAF50', color: '#fff', fontWeight: 'bold' }}>
            Update Password
          </CCardHeader>
          <CCardBody style={{ backgroundColor: '#f9f9f9' }}>
            {error && <CAlert color="danger">{error}</CAlert>}
            {message && <CAlert color="success">{message}</CAlert>}
            <CForm onSubmit={handleApply}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel style={{ fontWeight: '600' }}>New Password</CFormLabel>
                  <CFormInput
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ borderColor: '#4CAF50' }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel style={{ fontWeight: '600' }}>Confirm New Password</CFormLabel>
                  <CFormInput
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ borderColor: '#4CAF50' }}
                  />
                </CCol>
              </CRow>
              <div style={{ textAlign: 'center' }}>
                <CButton
                  type="submit"
                  color="primary"
                  style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
                >
                  Apply
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      )}
    </>
  );
};

export default UpdatePassword;
