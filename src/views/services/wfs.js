import React, { useState } from 'react'
import ServiceCommon from './serviceCommon';
import ValidUser from 'src/components/Authentication/ValidUser'


const WFS = () => {
    const [isShowCRow, setIsShowCRow] = useState(false);

    return (
        <>
            <ValidUser onLoaded={() => setIsShowCRow(true)} />
            {
                isShowCRow && <>
                    <ServiceCommon name='WFS' />
                </>
            }
        </>
    )
}

export default WFS

