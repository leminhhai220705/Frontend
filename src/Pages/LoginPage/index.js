import React from "react";
import axios from "axios";
import { DOCTOR_ROLE } from "../../Authentication/Auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./LoginPage.scss"

const API_URL = "http://localhost:4000";

const Login = ({ isLoggedIn, setIsLoggedIn }) => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement authentication API call here
        axios
            .post(`${API_URL}/login`, {
                email,
                password,
            })
            .then((response) => {
                setIsLoggedIn(true);

                let url = response.data.access_token === DOCTOR_ROLE ? "/doctor" : "/user";
                localStorage.setItem("accessToken", response.data.access_token);
                navigate(url, { state: { id: response.data.id } });
            })
            .catch((error) => {
                setIsLoggedIn(false);
                toast.error(error.response.data, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            });
    };

    return (
        <div>
            <div className="App">
                <form className="form" onSubmit={handleSubmit}>
                    <div>
                        <label className="email">Email:</label>
                        <input className="email-input" type="text" value={email} onChange={handleUsernameChange} />
                    </div>
                    <div>
                        <label className="password">Password:</label>
                        <input className="password-input" type="password" value={password} onChange={handlePasswordChange} />
                    </div>
                    <button className="btn-login" type="submit">Login</button>
                </form>

                {isLoggedIn || <ToastContainer autoClose={5000} position="top-right" />}
            </div>
        </div>
    );
};

export default Login;
