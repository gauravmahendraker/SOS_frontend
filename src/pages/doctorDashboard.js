import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "../components/profile";
import DoctorAppointments from "../components/doctorAppointments";
import UploadPrescription from "../components/uploadPrescription";

const DoctorDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get(`${API_URL}/doctor/me`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (response.status === 200) setProfile(response.data.data);
                else setError("Failed to fetch profile.");
            } catch {
                setError("User not logged in");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorData();
    }, [API_URL]);

    if (loading) return <div className="loading-spinner">Loading Profile...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!profile) return <div className="no-data">No profile data available.</div>;

    return (
        <div className="doctor-dashboard">
            <h2>Welcome, Dr. {profile.name}</h2>

            {/* Tabs */}
            <div className="tabs">
                <button 
                    className={activeTab === "profile" ? "active" : ""} 
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </button>
                <button 
                    className={activeTab === "appointments" ? "active" : ""} 
                    onClick={() => setActiveTab("appointments")}
                >
                    Appointments
                </button>
                <button 
                    className={activeTab === "prescriptions" ? "active" : ""} 
                    onClick={() => setActiveTab("prescriptions")}
                >
                    Upload Prescriptions
                </button>
                <button 
                    className={activeTab === "patients" ? "active" : ""} 
                    onClick={() => setActiveTab("patients")}
                >
                    Patient Records
                </button>
            </div>

            {/* Load Components Conditionally */}
            {activeTab === "profile" && <Profile profile={profile} />}
            {activeTab === "appointments" && <DoctorAppointments />}
            {activeTab === "prescriptions" && <UploadPrescription />}
        </div>
    );
};

export default DoctorDashboard;