import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Logout from "../../Component/Logout";
import Form from "react-bootstrap/Form";
import { Table } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ToastContainer, toast, Bounce } from "react-toastify";
import PopupComponent from "../../Component/Popup";
import { DOCTOR_ROLE } from "../../Authentication/Auth";
import "./PetDetail.scss";

const API_URL = "http://localhost:4000";

const PetDetail = () => {
    const status = ["alive", "deceased", "other", "missing"];

    let { state } = useLocation();

    console.log(state);
    const token = localStorage.getItem("accessToken");

    const [pet, setPet] = useState();
    const [selectDisable, setSelectDisable] = useState(true);
    const [commentDisable, setCommentDisable] = useState(true);
    const [select, setSelect] = useState();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    const transformPetData = (pet, users, visits) => {
        // Tìm tên của chủ thú cưng
        const owner = users.find((user) => user.id === pet.ownerId);
        const ownerName = owner ? owner.name : null;

        // Tìm các visits của pet
        const petVisits = visits.filter((visit) => visit.petId === pet.id);

        // Chỉnh sửa object pet
        const modifiedPet = {
            ...pet,
            ownerId: ownerName, // Thay ownerId bằng tên của chủ nhân
            visits: petVisits, // Thêm mảng visits vào object pet
        };

        return modifiedPet;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    authorization: `Bearer ${token}`,
                };

                const responsePetDetail = await axios.get(`${API_URL}/pets/${state.id}`, { headers });
                const responseVisits = await axios.get(`${API_URL}/visits`, { headers });
                console.log(responsePetDetail);
                console.log(responseVisits);

                if (token === DOCTOR_ROLE) {
                    const responseUsers = await axios.get(`${API_URL}/users`, { headers });

                    setPet(transformPetData(responsePetDetail.data, responseUsers.data, responseVisits.data));
                    setComment(
                        transformPetData(responsePetDetail.data, responseUsers.data, responseVisits.data)
                            .doctorsComment,
                    );
                } else {
                    setPet({
                        ...responsePetDetail.data,
                        visits: responseVisits.data.filter((visit) => visit.petId === responsePetDetail.data.id),
                    });
                }

                setLoading(false);
                // console.log(transformPetData(responsePetDetail.data, responseUsers.data, responseVisits.data));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const headers = {
                authorization: `Bearer ${token}`,
            };

            const dataRequest = {
                status: select || pet.status,
                comment: comment,
            };

            const response = await axios.put(`${API_URL}/pets/${state.id}`, dataRequest, { headers });

            toast.success(response.data.message, {
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

            console.log(response);
            setPet({ ...response.data.pet, ownerId: pet.ownerId, visits: pet.visits });
            setLoading(false);
        } catch (error) {
            toast.error("Pet fail updated", {
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
        <div className="petdetail">
            <Logout />
            <div>
                <div>Pet Name: {pet && pet.name}</div>
                <div>Date of Birth: {pet && pet.dob}</div>
                <div className={token !== DOCTOR_ROLE ? "hidden" : ""}>
                    <div>Owner Name: {pet && pet.ownerId}</div>
                </div>
                <div>Pet Type: {pet && pet.petType}</div>
                <div className={token !== DOCTOR_ROLE ? "" : "hidden"}>Status: {pet && pet.status}</div>
                <div className={token !== DOCTOR_ROLE ? "hidden" : ""}>
                    <div className="status">
                        <Form.Select
                            value={select}
                            onChange={(e) => setSelect(e.target.value)}
                            className="form-select"
                            disabled={selectDisable}
                        >
                            <option value={pet && pet.status}>{pet && pet.status}</option>
                            {status
                                .filter((status) => status !== (pet && pet.status))
                                .map((status, index) => (
                                    <option key={index} value={status}>
                                        {status}
                                    </option>
                                ))}
                        </Form.Select>
                        <Button
                            onClick={() => {
                                setSelectDisable(!selectDisable);
                            }}
                        >
                            Change Status
                        </Button>
                    </div>
                    <h3>Doctor's comments</h3>
                    <div className="comment">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <textarea
                                className="textarea"
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                                disabled={commentDisable}
                            />
                        )}
                        <Button
                            onClick={() => {
                                setCommentDisable(!commentDisable);
                            }}
                        >
                            Change Comment
                        </Button>
                    </div>
                </div>
                <h3>Visits</h3>
                <Table className="table" striped bordered hover>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pet &&
                            pet.visits.map((visit, index) => (
                                <tr key={index}>
                                    <td>{visit.date}</td>
                                    <td>{visit.comment}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
                <Button
                    className={token !== DOCTOR_ROLE ? "hidden" : ""}
                    onClick={handleUpdate}
                    disabled={commentDisable && selectDisable ? true : false}
                >
                    Update
                </Button>
                <ToastContainer position="top-right" autoClose={5000} />;
                <PopupComponent id={state.id} />
            </div>
        </div>
    );
};

export default PetDetail;
