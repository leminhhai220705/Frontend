import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Logout from "../../Component/Logout";
import Pet from "../../Component/Pet";
import Popup from "reactjs-popup";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "reactjs-popup/dist/index.css";
import { useLocation } from "react-router-dom";
import "./HomePage.scss";

const API_URL = "http://localhost:4000";

const HomePage = () => {
    const [pets, setPets] = useState([]);
    const [petName, setPetName] = useState("");
    const [petDate, setPetDate] = useState("");
    const [petType, setPetType] = useState("");

    const location = useLocation();
    let { state } = location;

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    authorization: `Bearer ${token}`,
                };
                const responsePets = await axios.get(`${API_URL}/pets`, { headers });
                setPets(responsePets.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleAddPet = async () => {
        try {
            const headers = {
                authorization: `Bearer ${token}`,
            };

            const dataRequest = {
                name: petName !== "" ? petName : undefined ,
                petType: petType !== "" ? petType : undefined,
                dob: petDate !== "" ? petDate : undefined,
                ownerId: state.id,
            };


            const responsePet = await axios.post(`${API_URL}/pets`, dataRequest, { headers });
            toast.success(responsePet.data.message, {
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
            setPets(prev => [...prev, responsePet.data.pet]);

            setPetName("")
            setPetDate("")
            setPetType("")
        } catch (error) {
            toast.error(error.response.data.error, {
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
        }
    };

    return (
        <div>
            <Logout />
            <div className="pets-container">
                {pets.map((pet, index) => (
                    <Pet key={index} {...pet} />
                ))}
            </div>

            <Popup trigger={<button className="btn-popup button"> Add Pet </button>} modal nested>
                {(close) => (
                    <div className="popup-create">
                        <button className="btn-popup closee" onClick={close}>
                            &times;
                        </button>
                        <label htmlFor="petName">Pet Name:</label>
                        <input
                            required
                            type="text"
                            id="petName"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                        />
                        {/* Ô nhập ngày tháng năm */}
                        <label htmlFor="petDate">Pet Date:</label>
                        <input
                            required
                            type="date"
                            id="petDate"
                            value={petDate}
                            onChange={(e) => setPetDate(e.target.value)}
                        />
                        {/* Ô nhập loại pet */}
                        <label htmlFor="petType">Pet Type:</label>
                        <input
                            required
                            type="text"
                            id="petType"
                            value={petType}
                            onChange={(e) => setPetType(e.target.value)}
                        />

                        <div className="btn-create-pet">
                            <button onClick={handleAddPet}>Add Pet</button>
                        </div>

                        <ToastContainer position="top-right" autoClose={5000} />
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default HomePage;
