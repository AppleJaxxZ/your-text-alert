import React, { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context"
import { Link } from 'react-router-dom'

const Login = ({ history }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //context
  const [state, setState] = useContext(UserContext);

  const handleClick = async (e) => {

    try {
      e.preventDefault();
      const { data } = await axios.post("/api/login", {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error)
      } else {
        setEmail('')
        setPassword('')
        setState(data)
        toast.success(`Hey ${data.user.name}.  Welcome back!  `);
        localStorage.setItem('auth', JSON.stringify(data))
        history.push("/account")
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
          <h1 className="pt-5 fw-bold">Login</h1>
          <p className="lead pb-4">
            Access your subscriptions.  Anytime.  Anywhere.
          </p>

          <div className="form-group">

            <Input
              label="Email"
              type="email"
              value={email}
              setValue={setEmail}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />

            <div className="d-grid">
              <Button
                handleClick={handleClick}
                type="danger"
                text="Login"
                size="sm"
              />

              <Link to='/forgotPassword'><p>Forgot Password</p></Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
