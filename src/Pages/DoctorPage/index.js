import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import TableComponent from "../../Component/Table";
import Logout from "../../Component/Logout";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const API_URL = "http://localhost:4000";

const DovtorPage = () => {
    const [data, setData] = useState(null);
    const token = localStorage.getItem("accessToken");
    
    toast.success("Login successful", {
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

    const addDateInData = (arrayPets, arrayVisits) => {
        let latestDates = {};

        // Lặp qua mảng lịch sử khám bệnh để tìm ngày gần nhất cho mỗi petId
        arrayVisits.forEach((record) => {
            if (!latestDates[record.petId] || new Date(record.date) > new Date(latestDates[record.petId])) {
                latestDates[record.petId] = record.date;
            }
        });

        // Thêm khóa mới là "date" vào mảng pets
        arrayPets.forEach((pet) => {
            pet.date = latestDates[pet.id] || null;
        });

        return arrayPets;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    authorization: `Bearer ${token}`,
                };

                const responsePets = await axios.get(`${API_URL}/pets`, { headers });

                const responseUsers = await axios.get(`${API_URL}/users`, { headers });

                const responseVisits = await axios.get(`${API_URL}/visits`, { headers });

                // eslint-disable-next-line react-hooks/exhaustive-deps
                const dataReal = responsePets.data.map((pet) => {
                    const ownerId = pet.ownerId;
                    return { ...pet, ownerId: responseUsers.data[ownerId - 1].name };
                });

                addDateInData(dataReal, responseVisits.data);
                setData(dataReal);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <ToastContainer autoClose={5000} position="top-right"/>
            <Logout/>
            {data && <TableComponent data={data} />}
        </div>
    );
};

export default DovtorPage;
