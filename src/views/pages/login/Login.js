import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import serviceData from '../../../../public/serviceCommon.json';

/**
 * Component thực hiện gọi API đăng nhập khi nhận được thông tin đăng nhập
 * Props:
 * - userName: string
 * - password: string
 * - onSuccess: callback khi đăng nhập thành công (ví dụ: chuyển hướng)
 * - onError: callback khi đăng nhập thất bại (nhận vào thông báo lỗi)
 */
const LoginComponent = ({ userName, password, onSuccess, onError }) => {
  const objectAuthen = serviceData.authentication;
  const API_LOGIN = objectAuthen.APILogin;
  const productid = objectAuthen.Product_id;

  useEffect(() => {
    const doLogin = async () => {
      const requestBody = {
        productid: productid,
        user_name: userName,
        password: password,
        hold_login: true,
      }
      try {
        const response = await fetch(API_LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })
        const result = await response.json()
        console.log(result);

        if (result.code === 200) {
          // Lấy accessToken và lưu vào localStorage với key "vbd_token"
          localStorage.setItem("vbd_token", result.data.accessToken)
          onSuccess()
        } else {
          onError(result.message || "Đăng nhập thất bại")
        }
      } catch (err) {
        onError("Lỗi khi gọi API: " + err.message)
      }
    }

    // Thực hiện đăng nhập chỉ khi có userName và password
    if (userName && password) {
      doLogin()
    }
  }, [userName, password, productid, API_LOGIN, onSuccess, onError])

  return null
}

const Login = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loginTriggered, setLoginTriggered] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate("/about")
  }

  const handleLoginError = (errMsg) => {
    setError(errMsg)
    setLoginTriggered(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoginTriggered(true)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
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
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  {/* Khi loginTriggered = true thì gọi LoginComponent để thực thi đăng nhập */}
                  {loginTriggered && (
                    <LoginComponent
                      userName={userName}
                      password={password}
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginError}
                    />
                  )}
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <h3>
                      Create an account now to use our services
                    </h3>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
