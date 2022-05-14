import React, { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context"

import ReactTooltip from "react-tooltip";




const Register = ({ history }) => {
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

      const { data } = await axios.post("/api/register", {
        name,
        email,
        password,
        checkPassword,
        dateOfBirth,
        pinNumber,
        phoneNumber
      })



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
      toast.error("One of the fields wasnt entered correctly, please try again");
    }
  };



  return (
    <div className="d-flex justify-content-center " style={{ height: "80vh" }}>
      <div className="container align-items-center d-flex">
        <div className="row col-md-6 offset-md-3 text-center">
          <h1 className="pt-5 fw-bold mt-5">Register For Free!</h1>



          <div className="form-group">
            <Input label="Name" value={name} tip="This will be your username, but you will sign on with your email and password." setValue={setName} />
            <Input
              tip='Using your real address will help you keep on track of your payments, email must be valid!'
              label="Email"
              type="email"
              value={email}
              setValue={setEmail}
            />

            <Input
              tip='Password must be 6 characters in length and contain: one UPPERCASE letter, one lowercase letter, one number, and one special character !@#$%^A&*'
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />
            <Input label="Check Password" type="password" value={checkPassword} setValue={setCheckPassword} />


            <Input label="Date Of Birth" type='text' tip='Date of Birth Must be entered in mm/dd/yyyy format or your credentials wont work.' value={dateOfBirth} setValue={setDateOfBirth} placeHolder="mm/dd/yyy format" />

            <Input label="7 digit pin" type='text' tip="YOUR AVER-HEALTH ASSIGNED PIN!" value={pinNumber} setValue={setPinNumber} />
            <Input label="Valid 11 digit Phone Number" type='phone number' tip=" Ex. 1610255455  NO SPACES, DASHES or OTHER KEYS" value={phoneNumber} setValue={setPhoneNumber} placeHolder="Must start with 1.  ex 14841235555" />
            <div className="d-grid mt-5 mb-5">
              <Button
                handleClick={handleClick}

                type="danger"
                text="Register"
                size="sm"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Register;


