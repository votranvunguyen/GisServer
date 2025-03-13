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
  CFormSelect,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import serviceData from '../../../public/serviceCommon.json';

// Hàm giải mã JWT
function parseJwt(token, navigate) {
  try {
    if (!token || token === '') {
      navigate("/login")
      return null;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    alert("Lỗi parse token: " + error);
    navigate("/login")
    return null;
  }
};

// Hàm trích xuất thông tin userRoles từ payload JWT
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
};

// Hàm kiểm tra xem mảng userRoles có chứa roleid hợp lệ hay không
function hasRole(userRoles, roleValid) {
  return userRoles.some((role) => role.roleid === roleValid);
}

const ListTable = ({ host, port, apiList, apiDetal, name, serverName }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger reload
  const [visible, setVisible] = useState(false); // Modal thêm mới
  const [newId, setNewId] = useState('');
  const [newBody, setNewBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Modal xác nhận delete
  const [itemToDelete, setItemToDelete] = useState(null); // Lưu item cần xóa

  let defaultValue = "";
  if (name === "WMTS") {
    defaultValue = "1.0.0";
  } else if (name === "WMS") {
    defaultValue = "1.3.0";
  } else if (name === "WFS") {
    defaultValue = "2.0.0";
  }

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  // Lấy token và xử lý quyền
  const rawToken = localStorage.getItem("vbd_token");
  const token = parseJwt(rawToken, navigate);
  const userRoles = extractUserRoleData(token);
  const objectRole = serviceData.authentication.DefineRole;
  const roleAdmin = hasRole(userRoles, objectRole.admin_system);
  const roleEditor = hasRole(userRoles, objectRole.editor);

  const isValidName = name === 'WMTS' || name === 'WMS' || name === 'WFS';
  const keyServiceName = serverName === 'MapConfig' ? '' : `?SERVERNAME=${serverName}`;
  const urlDetail = port === 0 ? `${host}${apiDetal}` : `${host}:${port}${apiDetal}`;

  // Fetch list items
  useEffect(() => {
    if (isValidName) {
      const url = `${host}:${port}${apiList}&SERVERNAME=${serverName}`;
      fetch(url, { method: 'GET' })
        .then((response) => response.json())
        .then((result) => {
          if (result.success === "true" && result.data && result.data.id) {
            setItems(result.data.id);
          }
        })
        .catch((error) => {
          console.error('Lỗi khi fetch API:', error);
        });
    } else if (name === "CSW") {
      setItems(["VietbandoCSW"]);
    } else if (name === "WPS") {
      setItems(["VietbandoWPS"]);
    }
  }, [host, port, apiList, name, isValidName, refreshKey, serverName]);

  // Xử lý hiển thị modal xác nhận xóa
  const handleDeleteClick = (processedItem = '') => {
    setItemToDelete(processedItem);
    setDeleteModalVisible(true);
  };

  // Hàm thực hiện delete khi xác nhận "Yes"
  const confirmDelete = () => {
    const deleteUrl = isValidName ? `${urlDetail}${itemToDelete}` : urlDetail;
    const encodedId = encodeURIComponent(keyServiceName);
    fetch(`${deleteUrl}${encodedId}`, { method: 'DELETE' })
      .then((response) => {
        if (response.status === 200) {
          alert('Delete success!');
          setRefreshKey(prev => prev + 1);
        } else {
          alert('Delete failed!');
        }
      })
      .catch((error) => {
        alert('Delete failed!');
        console.error('Lỗi khi xóa:', error);
      })
      .finally(() => {
        setDeleteModalVisible(false);
        setItemToDelete(null);
      });
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
    console.log("Giá trị đã chọn:", e.target.value);
  };

  // Xử lý thêm mới Capability
  const handleAdd = () => {
    if (!newId || !newBody) {
      alert('Vui lòng nhập đầy đủ ID và Body!');
      return;
    }
    const urlAdd = isValidName ? `${urlDetail}${newId}` : urlDetail;
    fetch(`${urlAdd}${keyServiceName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: newBody,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "true") {
          alert('Add new success!');
          setTimeout(() => {
            setVisible(false);
            setRefreshKey(prev => prev + 1);
          }, 1500);
        } else {
          alert('Add new failed!');
        }
      })
      .catch((error) => {
        alert(`Lỗi khi thêm mới: ${error.message}`);
      });
  };

  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between">
          <span>List Capabilites</span>
          {(roleAdmin || roleEditor) && (
            <div>
              {isValidName ? (
                <CButton color="primary" onClick={() => setVisible(true)}>+ Add</CButton>
              ) : (
                <CButton color="primary" onClick={() => setVisible(false)}>+ Add</CButton>
              )}
            </div>
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
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">STT</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Name</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Version</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Details</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredItems.map((item, index) => {
                // Nếu item có dạng "xxx:yyyy", lấy phần sau dấu ":" (yyyy)
                const processedItem = item.includes(':') ? item.substring(item.indexOf(':') + 1) : item;
                return (
                  <CTableRow key={index}>
                    <CTableDataCell className="bg-body-tertiary text-center">{index + 1}</CTableDataCell>
                    <CTableDataCell className="bg-body-tertiary text-center">{item}</CTableDataCell>
                    <CTableDataCell className="bg-body-tertiary text-center">
                      {name === "WMTS" && (
                        <CFormSelect value={selectedValue} onChange={handleSelectChange}>
                          <option value="1.0.0">1.0.0</option>
                        </CFormSelect>
                      )}
                      {name === "WMS" && (
                        <CFormSelect value={selectedValue} onChange={handleSelectChange}>
                          <option value="1.3.0">1.3.0</option>
                          <option value="1.1.1">1.1.1</option>
                        </CFormSelect>
                      )}
                      {name === "WFS" && (
                        <CFormSelect value={selectedValue} onChange={handleSelectChange}>
                          <option value="2.0.0">2.0.0</option>
                          <option value="1.1.0">1.1.0</option>
                          <option value="1.0.0">1.0.0</option>
                        </CFormSelect>
                      )}
                      {name === "WPS" && (
                        <CFormSelect value={selectedValue} onChange={handleSelectChange}>
                          <option value="1.0.0">1.0.0</option>
                        </CFormSelect>
                      )}
                      {name === "CSW" && (
                        <CFormSelect value={selectedValue} onChange={handleSelectChange}>
                          <option value="2.0.2">2.0.2</option>
                        </CFormSelect>
                      )}
                    </CTableDataCell>
                    <CTableDataCell className="bg-body-tertiary text-center">
                      {isValidName ? (
                        <CButton
                          color="info"
                          size="sm"
                          href={`${urlDetail}${processedItem}?VERSION=${selectedValue}&SERVERNAME=${serverName}`}
                        >
                          Details
                        </CButton>
                      ) : (
                        <CButton color="info" size="sm" href={urlDetail}>
                          Details
                        </CButton>
                      )}
                    </CTableDataCell>
                    <CTableDataCell className="bg-body-tertiary text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {(roleAdmin || roleEditor) && (
                          <>
                            {isValidName ? (
                              <CButton color="danger" size="sm" onClick={() => handleDeleteClick(processedItem)}>
                                Delete
                              </CButton>
                            ) : (
                              <CButton color="danger" size="sm" onClick={() => setVisible(false)}>
                                Delete
                              </CButton>
                            )}
                          </>
                        )}
                        {isValidName && (
                          <CButton color="warning" size="sm">
                            View
                          </CButton>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
      {/* Modal Thêm mới Capability */}
      <CModal size="xl" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Capability</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            placeholder="Capabilities ID"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="mb-3"
          />
          <CFormTextarea
            placeholder="Body"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={10}
            className="mb-3"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAdd}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Modal Xác nhận Delete */}
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
  )
}

export default ListTable;
