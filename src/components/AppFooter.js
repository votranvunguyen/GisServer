import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      {/* <div>
        <a href="http://maps.vietbando.com/" target="_blank" rel="noopener noreferrer">
          Vietbando
        </a>
        <span className="ms-1">&copy; 2025 create.</span>
      </div> */}
      <div className="ms-auto">
        <span className="me-1">&copy; OGC Standard</span>
        <a href="https://www.ogc.org/publications/" target="_blank" rel="noopener noreferrer">
        https://www.ogc.org
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
