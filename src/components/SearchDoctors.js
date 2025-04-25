import React, { useState } from "react";
import axios from "axios";
import "./searchDoctors.css";

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
    <div className="card shadow-sm p-4 bg-light mb-4">
      <h3 className="mb-4">🔍 Search Doctors</h3>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Doctor's Name"
            value={searchParams.name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="specialization"
            className="form-control"
            placeholder="Specialization"
            value={searchParams.specialization}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Location"
            value={searchParams.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="btn btn-primary mb-3"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {doctors.length > 0 && (
        <div className="list-group">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="list-group-item">
              <h5>{doctor.name}</h5>
              <p className="mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
              <p className="mb-0"><strong>Location:</strong> {doctor.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDoctors;
