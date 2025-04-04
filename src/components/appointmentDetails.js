import React, { useState, useEffect } from "react";
import axios from "axios";
import "./appointmentDetails.css";

const AppointmentDetails = ({ appointmentId, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.post(
                    `${API_URL}/appointment/appointment-details`,
                    { appointmentId },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );
                if (response.status === 200) {
                    setDetails(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching appointment details:", err);
                setError("Failed to load appointment details.");
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchDetails();
        }
    }, [appointmentId, API_URL]);

    if (loading) return <div className="loading">Loading details...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="appointment-details-modal">
            <div className="modal-content">
                <h3>Appointment Details</h3>
                <p><strong>Doctor:</strong> Dr. {details.doctorName} ({details.doctorSpecialization})</p>
                <p><strong>Doctor Email:</strong> {details.doctorEmail}</p>
                <p><strong>Patient:</strong> {details.patientName}</p>
                <p><strong>Patient Email:</strong> {details.patientEmail}</p>
                <p><strong>Date:</strong> {details.date}</p>
                <p><strong>Time Slot:</strong> {details.timeSlotStart}</p>
                <p><strong>Duration:</strong> {details.duration} minutes</p>
                <p><strong>Status:</strong> {details.status}</p>
                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AppointmentDetails;
