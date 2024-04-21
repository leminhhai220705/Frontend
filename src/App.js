import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Pages/LoginPage";
import DovtorPage from "./Pages/DoctorPage";
import HomePage from "./Pages/HomePage";
import PetDetail from "./Pages/PetDetail";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}></Route>
                <Route path="/doctor" element={isLoggedIn ? <DovtorPage /> : <Navigate to="/" />}></Route>
                <Route path="/user" element={<HomePage />}></Route>
                <Route path="/petdetail" element={<PetDetail />}></Route>
            </Routes>
        </div>
    );
}

export default App;
