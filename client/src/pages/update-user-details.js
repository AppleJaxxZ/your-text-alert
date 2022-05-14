import React, { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context"

const UpdateUser = ({ history }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [pinNumber, setPinNumber] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    //context
    const [state, setState] = useContext(UserContext);

    const handleClick = async (e) => {

        try {
            e.preventDefault();
            const { data } = await axios.post("/api/updateUser", {
                name,
                email,
                password,
                checkPassword,
                dateOfBirth,
                pinNumber,
                phoneNumber
            });

            if (data.error) {
                toast.error(data.error);
            } else {
                setName('')
                setEmail('')
                setPassword('')
                setCheckPassword('')
                setDateOfBirth('')
                setPinNumber("")
                setPhoneNumber('')
                toast.success(`Hey ${data.user.name}.  Thanks for registering!  `);
                setState(data)
                localStorage.setItem('auth', JSON.stringify(data))
                history.push("/");
            }


        } catch (err) {
            console.log(err);
            toast.error("One of the fields wasnt entered correctly, please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center" style={{ height: "80vh" }}>
            <div className="container mt-5 align-items-center ">
                <div className="row col-md-6 offset-md-3 text-center">
                    <h1 className="pt-5 fw-bold mt-5">Update Your User Credentials</h1>





                    <Input label="Name" value={name} setValue={setName} /> <Button
                        handleClick={handleClick}
                        type="danger"
                        text="Update Name"
                        size="sm"
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        setValue={setEmail}
                    /><Button
                        handleClick={handleClick}
                        type="danger"
                        text="Update Email"
                        size="sm"
                    />
                    <form>
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            setValue={setPassword}
                        />
                        <Input label="Check Password" type="password" value={checkPassword} setValue={setCheckPassword} />

                        <Button
                            handleClick={handleClick}
                            type="danger"
                            text="Update Password"
                            size="sm"
                        />

                    </form>
                    <Input label="Date Of Birth" type='text' value={dateOfBirth} setValue={setDateOfBirth} placeHolder="mm/dd/yyy format" /><Button
                        handleClick={handleClick}
                        type="danger"
                        text="Register"
                        size="sm"
                    />
                    <Input label="7 digit pin" type='text' value={pinNumber} setValue={setPinNumber} /><Button
                        handleClick={handleClick}
                        type="danger"
                        text="Register"
                        size="sm"
                    />
                    <Input label="Valid 11 digit Phone Number" type='phone number' value={phoneNumber} setValue={setPhoneNumber} placeHolder="Must start with 1.  ex 14841235555" /><Button
                        handleClick={handleClick}
                        type="danger"
                        text="Update"
                        size="sm"
                    />



                </div>
            </div>



        </div>
    );
};

export default UpdateUser;