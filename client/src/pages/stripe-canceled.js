import React from 'react'
import { WarningTwoTone } from "@ant-design/icons"

const StripeCanceled = () => {
    return (
        <div className=" d-flex justify-content-center fw-bold" style={{ height: "98vh" }}>
            <div className="d-flex align-items-center ">
                <h3>PAYMENT CANCELED</h3>
                <WarningTwoTone style={{ fontSize: "50px" }} />
            </div>
        </div>
    )
}

export default StripeCanceled