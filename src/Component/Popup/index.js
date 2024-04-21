import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useState } from "react";
import "./Popup.scss";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";

const API_URL = "http://localhost:4000";

const PopupComponent = ({ id }) => {
    const [visitDate, setVisitDate] = useState("");
    const [comment, setComment] = useState("");

    const token = localStorage.getItem("accessToken");

    const handleAddVisit = async () => {

        if (new Date(visitDate) <= new Date()) {
            alert("Please select a date in the future.");
        } else {
            try {
                const headers = {
                    authorization: `Bearer ${token}`,
                };

                const dataRequest = {
                    petId: id,
                    date: visitDate,
                    comment: comment,
                };
                const responseVisit = await axios.post(`${API_URL}/visits/`, dataRequest, { headers });
                setComment('')
                setVisitDate('')
                
                toast.success(responseVisit.data.message, {
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
            } catch (e) {

            }
        }
    };

    return (
        <div>
            <Popup trigger={<button className="btn-popup button"> Add visit </button>} modal nested>
                {(close) => (
                    <div>
                        <button className="btn-popup closee" onClick={close}>
                            &times;
                        </button>
                        <label htmlFor="visitDate">Visit Date:</label>
                        <input
                            type="date"
                            id="visitDate"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            required
                        />
                        <div>
                            <label htmlFor="comment">Comment:</label>
                            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                        </div>
                        <div className="btn-add-container">
                            <button className="btn-popup btn-add" onClick={handleAddVisit}>
                                Add Visit
                            </button>
                        </div>

                        <ToastContainer position="top-right" autoClose={5000} />;
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default PopupComponent;
