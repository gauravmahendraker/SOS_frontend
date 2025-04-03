import React, { useState } from "react";
import axios from "axios";

const SearchDoctors = () => {
    const [searchParams, setSearchParams] = useState({
        name: "",
        specialization: "",
        location: "",
    });
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/doctor`, {
                params: searchParams,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.status === 200) {
                setDoctors(response.data.data);
            }
        } catch (err) {
            setError("No doctors found or an error occurred.");
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-doctors">
            <h3>Search Doctors</h3>
            
            {/* Search Inputs */}
            <input
                type="text"
                name="name"
                placeholder="Doctor's Name"
                value={searchParams.name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={searchParams.specialization}
                onChange={handleChange}
            />
            <input
                type="text"
                name="location"
                placeholder="Location"
                value={searchParams.location}
                onChange={handleChange}
            />
            
            <button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>

            {/* Display Results */}
            {error && <p className="error">{error}</p>}
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor._id}>
                        <p><strong>{doctor.name}</strong> - {doctor.specialization}</p>
                        <p>Location: {doctor.location}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchDoctors;
