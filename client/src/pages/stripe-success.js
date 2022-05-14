import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import { SyncOutlined } from "@ant-design/icons"
import { UserContext } from '../context'


const StripeSuccess = ({ history }) => {
    const [state, setState] = useContext(UserContext);

    useEffect(() => {
        const getSubscriptionStatus = async () => {
            const { data } = await axios.get('/api/subscription-status');

            if (data && data.length === 0) {
                history.push("/")
            } else {
                //update user in storange
                const auth = JSON.parse(localStorage.getItem('auth'))
                auth.user = data;

                localStorage.setItem('auth', JSON.stringify(auth))
                //update user in context
                setState(auth)

                setTimeout(() => {
                    history.push("/account")
                })

            }
        }
        getSubscriptionStatus();
    }, [])
    return (
        <div className=" d-flex justify-content-center fw-bold" style={{ height: "98vh" }}>
            <div className="d-flex align-items-center">
                <SyncOutlined spin style={{ fontSize: "50px" }} />
            </div>
        </div>
    )
}

export default StripeSuccess