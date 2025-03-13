import React, { useState } from 'react'
import ServiceCommon from './serviceCommon';
import ValidUser from 'src/components/Authentication/ValidUser'


const WPS = () => {
  const [isShowCRow, setIsShowCRow] = useState(false);
    return (
        <>
            <ValidUser onLoaded={() => setIsShowCRow(true)} />
            {
                isShowCRow && <>
                    <ServiceCommon name='WPS' />
                </>
            }
        </>
    )
}

export default WPS

