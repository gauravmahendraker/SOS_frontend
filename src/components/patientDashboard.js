import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`${API_URL}/patient/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);
                if (response.status === 200) {
                    setProfile(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch profile.");
                }
            } catch (err) {
                console.error("Error fetching patient data:", err);
                setError("An error occurred while fetching your profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, []);

    if (loading) {
        return <div>Loading Profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    return (
        <div className="patient-dashboard">
            <h2>Welcome, {profile.name}</h2>

            {/* Patient Profile */}
            <div className="profile">
                <h3>Profile Information</h3>
                <p>Email: {profile.email}</p>
                <p>Contact: {profile.phone}</p>
            </div>

            {/* Appointment History */}
            <div className="appointments">
                <h3>Appointment History</h3>
                {profile.appointmentHistory?.length > 0 ? (
                    <ul>
                        {profile.appointmentHistory.map((appointment) => (
                            <li key={appointment._id}>
                                <p>Doctor: {appointment.doctor.name}</p>
                                <p>Date: {new Date(appointment.date).toLocaleString()}</p>
                                {/* Add other appointment details here */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You don't have any appointments yet.</p>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
