import React, { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context"
import { Link } from 'react-router-dom'

const ForgotPassword = ({ history }) => {

    const [email, setEmail] = useState("");
    const [pinNumber, setPinNumber] = useState("");
    const [password, setPassword] = useState("");
    //context
    const [state, setState] = useContext(UserContext);

    const handleClick = async (e) => {

        try {
            e.preventDefault();
            const { data } = await axios.post("/api/forgotPassword", {
                email,
                pinNumber,
                password,
            });

            if (data.error) {
                toast.error(data.error)
            } else {
                setEmail('')
                setPassword('')
                setPinNumber('')
                setState(data)
                toast.success(`Hey ${email}. You successfully changed your password, time to login!  `);

                history.push("/login")
            }


        } catch (err) {
            console.log(err);
            toast.error("Something went wrong. Try again");
        }
    };

    return (
        <div className="d-flex justify-content-center" style={{ height: "80vh" }}>
            <div className="container align-items-center d-flex">
                <div className="row col-md-6 offset-md-3 text-center">
                    <h1 className="pt-5 fw-bold">Forgot Password</h1>
                    <p className="lead pb-4">
                        Lets Change your password. First, enter in the details below.
                    </p>

                    <div className="form-group">

                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            setValue={setEmail}
                        />
                        <Input
                            label="pinNumber"
                            type="text"
                            value={pinNumber}
                            setValue={setPinNumber}
                        />

                        <Input
                            label="New Password"
                            type="password"
                            value={password}
                            setValue={setPassword}
                        />

                        <div className="d-grid">
                            <Button
                                handleClick={handleClick}
                                type="danger"
                                text="Find Account"
                                size="sm"
                            />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
