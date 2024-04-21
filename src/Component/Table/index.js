import React, { useState } from "react";
import { Table, Container, Form, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Table.scss";
import { Link } from "react-router-dom";

const TableComponent = ({ data }) => {
    const [searchText, setSearchText] = useState("");
    const [typeValue, setTypeValue] = useState([]);
    const [statusValue, setStatusValue] = useState("All");

    // console.log(data);
    const headers = ["STT", "Name", "Pet Type", "Owner", "Date of birth", "Last date vistit", "Status"];

    const handleChangeCheckbox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setTypeValue((prev) => [...prev, value]);
        } else {
            setTypeValue((prev) => [...removeElement(prev, value)]);
        }
    };

    const handleChangeRadio = (e) => {
        setStatusValue(e.target.value);
    };

    const removeElement = (array, elem) => {
        var index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    };

    return (
        <div>
            <Container>
                <h1 className="text-center mt-4">List Pet</h1>
                <Form>
                    <InputGroup className="my-3">
                        <Form.Control
                            value={searchText}
                            placeholder="Search pets"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </InputGroup>
                </Form>

                <div>
                    <div>
                        <h5>Select by Type pet</h5>
                        <Form>
                            <Form.Check
                                onChange={handleChangeCheckbox}
                                value="dog"
                                inline
                                name="petType"
                                type="checkbox"
                                label="Dog"
                            />
                            <Form.Check
                                onChange={handleChangeCheckbox}
                                value="cat"
                                inline
                                name="petType"
                                type="checkbox"
                                label="Cat"
                            />
                        </Form>
                    </div>

                    <div>
                        <h5>Select by Status</h5>
                        <Form>
                            <Form.Check
                                onChange={handleChangeRadio}
                                checked={statusValue === "Alive"}
                                value="Alive"
                                inline
                                name="status"
                                type="radio"
                                label="Alive"
                            />
                            <Form.Check
                                onChange={handleChangeRadio}
                                checked={statusValue === "Deceased"}
                                value="Deceased"
                                inline
                                name="status"
                                type="radio"
                                label="Deceased"
                            />
                            <Form.Check
                                onChange={handleChangeRadio}
                                checked={statusValue === "All"}
                                value="All"
                                inline
                                name="status"
                                type="radio"
                                label="All"
                            />
                        </Form>
                    </div>
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {headers.map((headerItem, index) => (
                                <th key={index}>{headerItem}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter((pet) => {
                                const searchByText =
                                    pet.name.toLowerCase().includes(searchText) ||
                                    pet.ownerId.toLowerCase().includes(searchText) ||
                                    pet.dob.toLowerCase().includes(searchText);

                                if (statusValue === "All") {
                                    return typeValue.length
                                        ? searchByText && typeValue.includes(pet.petType)
                                        : searchByText;
                                }

                                return (
                                    searchByText &&
                                    (statusValue === "Alive" ? pet.status === "alive" : pet.status !== "alive") &&
                                    (typeValue.length ? typeValue.includes(pet.petType) : true)
                                );
                            })
                            .map((pet, index) => (
                                <tr key={pet.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link className="link" state={{ id: pet.id }} to="/petdetail">
                                            {pet.name}
                                        </Link>
                                    </td>
                                    <td>{pet.petType}</td>
                                    <td>{pet.ownerId}</td>
                                    <td>{pet.dob}</td>
                                    <td>{pet.date}</td>
                                    <td
                                        className={`${
                                            pet.status === "alive"
                                                ? "alive"
                                                : pet.status === "deceased"
                                                ? "deceased"
                                                : "missing"
                                        }`}
                                    >
                                        {pet.status}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default TableComponent;
