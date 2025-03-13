import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAddressBook, cilLockLocked, cilPhone, cilUser } from '@coreui/icons'
import serviceData from '../../../../public/serviceCommon.json';

const Register = () => {
  const navigate = useNavigate()
  const objectAuthen = serviceData.authentication
  const API_REGISTER = objectAuthen.APIGet_Register
  const productid = objectAuthen.Product_id
  const tokenRegister=objectAuthen.tokenRegister
  // State cho các trường input
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Kiểm tra password trùng khớp
    if (password !== repeatPassword) {
      setError("Mật khẩu nhập lại không khớp!")
      return
    }
    
    const requestBody = {
      user_name: userName,
      password: password,
      email: email,
      name: fullName,
      productid: productid,
      phone_number: phoneNumber,
      address: address,
    }
  
    try {
      const response = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "token":tokenRegister
         },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      
      if (result.code === 200) {
        setSuccess("Đăng ký thành công! Chuyển hướng về trang đăng nhập...")
        // Sau 2 giây chuyển hướng
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(result.message || "Đăng ký thất bại")
      }
    } catch (err) {
      setError("Lỗi khi gọi API: " + err.message)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Full Name"
                      autoComplete="fullname"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Phone Number"
                      autoComplete="phone_number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilAddressBook} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Address"
                      autoComplete="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {success && <p style={{ color: "green" }}>{success}</p>}
                  <div className="d-grid">
                    <CButton color="success" type="submit">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
