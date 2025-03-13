import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CFormSelect,
  CCol,
} from '@coreui/react'
import ValidUser from 'src/components/Authentication/ValidUser'
import serviceData from '../../../public/serviceCommon.json';

function parseJwt(token, navigate) {
  try {
    if (!token) {
      navigate("/login")
      return null
    }
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    alert("Lỗi parse token: " + error.message)
    navigate("/login")
    return null
  }
}

function extractUserRoleData(payload) {
  if (!payload || !payload.authorization) return []
  try {
    const authArray = JSON.parse(payload.authorization)
    return authArray.map((item) => ({
      userid: item.userid,
      roleid: item.roleid,
    }))
  } catch (error) {
    console.error("Lỗi parse authorization:", error)
    return []
  }
}

function hasRole(userRoles, roleValid) {
  return userRoles.some((role) => role.roleid === roleValid)
}

const UserRole = () => {
  const navigate = useNavigate()
  // State cho các trường thông tin
  const [roleid, setRoleid] = useState('')
  const [userid, setUserid] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isShowCRow, setIsShowCRow] = useState(false)

  const productid = serviceData.authentication.Product_id
  const objectRole = serviceData.authentication.DefineRole
  // Role mặc định đã định nghĩa sẵn
  const defaultRoleid = objectRole.editor
  const roleGuest = objectRole.user_guest
  const roleAmin = objectRole.admin_system
  // API để update role
  const APIUpdateRole = serviceData.authentication.APIUpdateRole
  const tokenRegister = localStorage.getItem("vbd_token")

  // Tính toán token và userRoles sử dụng useMemo để tránh tính toán lại không cần thiết
  const token = useMemo(() => parseJwt(tokenRegister, navigate), [tokenRegister, navigate])
  const userRoles = useMemo(() => extractUserRoleData(token), [token])

  // Kiểm tra quyền admin, nếu không có thì chuyển hướng về trang chủ
  useEffect(() => {
    if (userRoles.length > 0 && !hasRole(userRoles, objectRole.admin_system)) {
      navigate("/")
    }
  }, [userRoles, objectRole, navigate])

  // Hàm gọi API Apply
  const handleApply = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    // Kiểm tra dữ liệu bắt buộc
    if (!roleid || !userid || !productid) {
      setError('Please fill in all information!')
      return
    }

    const requestBody = {
      roleid: roleid,
      userid: userid,
      productid: productid,
    }

    try {
      const response = await fetch(APIUpdateRole, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': tokenRegister },
        body: JSON.stringify(requestBody),
      })
      const result = await response.json()
      console.log(response)
      if (result.code === 200) {
        setMessage('Apply successfully!')
        // Có thể chuyển hướng hoặc xử lý khác tại đây
      } else {
        setError(result.message || 'Apply failed!')
      }
    } catch (err) {
      setError('Lỗi khi gọi API: ' + err.message)
    }
  }

  return (
    <>
      <ValidUser onLoaded={() => setIsShowCRow(true)} />
      {isShowCRow && (
        <CCard className="mx-auto" style={{ maxWidth: '800px' }}>
          <CCardHeader>
            <h2>Update role</h2>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleApply}>
              <CRow className="mb-3">
                <CCol xs={12}>
                  <label className="form-label">Role ID</label>
                  <CFormSelect value={roleid} onChange={(e) => setRoleid(e.target.value)}>
                    <option value={roleGuest}>Guest</option>
                    <option value={defaultRoleid}>Editor</option>
                    <option value={roleAmin}>Admin-Manager</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CFormInput
                label="User ID"
                placeholder="User ID"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                className="mb-3"
                required
              />

              {error && <p style={{ color: 'red' }}>{error}</p>}
              {message && <p style={{ color: 'green' }}>{message}</p>}
              <div className="d-grid">
                <CButton color="primary" type="submit">
                  Apply
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default UserRole
