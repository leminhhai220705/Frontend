import React from "react";
import "./Pet.scss";
import { Link } from "react-router-dom";

const Pet = ({ name, petType, id }) => {
    return (
        <Link to="/petdetail" state={{id: id}} className="link">
            <div className={`${petType === "dog" ? "dog" : "cat"} pet`}>
                <h1>{name}</h1>
                <div>{petType}</div>
            </div>
        </Link>
    );
};

export default Pet;
