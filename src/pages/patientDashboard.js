import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "../components/Profile";
import AppointmentHistory from "../components/AppointmentHistory";
import SearchDoctors from "../components/SearchDoctors";
import ScheduleAppointment from "../components/ScheduleAppointment";

const PatientDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`${API_URL}/patient/me`, {
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
        fetchPatientData();
    }, []);

    if (loading) return <div>Loading Profile...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>No profile data available.</div>;

    return (
        <div className="patient-dashboard">
            <h2>Welcome, {profile.name}</h2>

            {/* Tabs */}
            <div className="tabs">
                <button onClick={() => setActiveTab("profile")}>Profile</button>
                <button onClick={() => setActiveTab("appointments")}>Appointment History</button>
                <button onClick={() => setActiveTab("search")}>Search Doctors</button>
                <button onClick={() => setActiveTab("schedule")}>Schedule Appointment</button>
            </div>

            {/* Load Components Conditionally */}
            {activeTab === "profile" && <Profile profile={profile} />}
            {activeTab === "appointments" && <AppointmentHistory appointments={profile.appointmentHistory} />}
            {activeTab === "search" && <SearchDoctors />}
            {activeTab === "schedule" && <ScheduleAppointment />}
        </div>
    );
};

export default PatientDashboard;
