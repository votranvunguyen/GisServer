import React, { useState } from 'react'
import ServiceCommon from './serviceCommon';
import ValidUser from 'src/components/Authentication/ValidUser'


const WMS = () => {
  
    const [isShowCRow, setIsShowCRow] = useState(false);

    return (
        <>
            <ValidUser onLoaded={() => setIsShowCRow(true)} />
            {
                isShowCRow && <>
                    <ServiceCommon name='WMS' />
                </>
            }
        </>
    )
}

export default WMS

