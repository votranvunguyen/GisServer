import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow, CFormSelect
} from '@coreui/react'

const ViewMap = () => {  
  return (  
    <div>  
      <CCard className="mb-4">
        {/* <CCardHeader>   <h1>MISSGeoportal</h1>  </CCardHeader> */}
   
      <iframe   
        src="http://10.225.1.1:3012/"   
        width="100%"   
        height="1000"   
        title="OGC Client"  
      />  
      </CCard>
    </div>  
  );  
};  
export default ViewMap;  
