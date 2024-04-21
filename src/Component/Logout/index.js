import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Logout.scss";
import { DOCTOR_ROLE } from "../../Authentication/Auth";

const Logout = () => {
    let navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate("/");
    };

    return (
        <div className="group">
            <h2>Hello {token === DOCTOR_ROLE ? "Doctor" : "User"}</h2>
            <Button size="lg" onClick={handleLogout}>
                Log Out
            </Button>
        </div>
    );
};

export default Logout;
