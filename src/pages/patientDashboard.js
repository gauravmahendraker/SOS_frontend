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
    }, [API_URL]);

    if (loading) return <div className="text-center text-blue-600 mt-8">Loading Profile...</div>;
    if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
    if (!profile) return <div className="text-center text-gray-600 mt-8">No profile data available.</div>;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Welcome, {profile.name}
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-6">
                {["profile", "appointments", "search", "schedule"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                            ${activeTab === tab 
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
                            }`}
                    >
                        {tab === "profile" && "Profile"}
                        {tab === "appointments" && "Appointment History"}
                        {tab === "search" && "Search Doctors"}
                        {tab === "schedule" && "Schedule Appointment"}
                    </button>
                ))}
            </div>

            {/* Load Components Conditionally */}
            <div className="bg-white p-6 rounded-lg shadow">
                {activeTab === "profile" && <Profile profile={profile} />}
                {activeTab === "appointments" && (
                    <AppointmentHistory appointments={profile.appointmentHistory} />
                )}
                {activeTab === "search" && <SearchDoctors />}
                {activeTab === "schedule" && <ScheduleAppointment />}
            </div>
        </div>
    );
};

export default PatientDashboard;
