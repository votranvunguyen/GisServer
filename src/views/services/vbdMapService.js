import React, { useState } from 'react'
import HandleMapService from './handlerMapService';
import ValidUser from 'src/components/Authentication/ValidUser'


const VBDMapService = () => {
const [isShowCRow, setIsShowCRow] = useState(false);
  return (
    <>
      <ValidUser onLoaded={() => setIsShowCRow(true)} />
      {
        isShowCRow && <>
          <HandleMapService />
        </>
      }
    </>
  )
}

export default VBDMapService

