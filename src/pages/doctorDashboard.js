import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorProfile from "../components/DoctorProfile";
import DoctorAppointments from "../components/doctorAppointments";
import UploadPrescription from "../components/uploadPrescription";
import "./doctorDashboard.css";

const DoctorDashboard = ({ darkMode }) => {
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

    if (loading) return <div className="text-center text-blue-600 mt-8">Loading Profile...</div>;
    if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
    if (!profile) return <div className="text-center text-gray-600 mt-8">No profile data available.</div>;

    return (
        <div className={`p-6 md:p-10 bg-gray-50 min-h-screen ${darkMode ? "dark-mode" : "light-mode"}`}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Welcome, Dr. {profile.name}
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-6">
                {["profile", "appointments", "prescriptions", "patients"].map(tab => (
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
                        {tab === "appointments" && "Appointments"}
                        {tab === "prescriptions" && "Upload Prescriptions"}
                        {tab === "patients" && "Patient Records"}
                    </button>
                ))}
            </div>

            {/* Load Components Conditionally */}
            <div className="bg-white p-6 rounded-lg shadow">
                {activeTab === "profile" && <DoctorProfile
                    profile={profile}
                    onUpdate={async (updatedData) => {
                        try {
                            const response = await fetch(`${API_URL}/doctor/${updatedData.email}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                                },
                                body: JSON.stringify(updatedData),
                            });

                            const result = await response.json();
                            if (!response.ok) throw new Error(result.message);

                            alert("Doctor profile updated successfully!");
                            // Optionally update local state here with result.data
                        } catch (err) {
                            console.error("Error updating doctor:", err);
                            alert("Failed to update doctor profile.");
                        }
                    }}
                />
                }
                {activeTab === "appointments" && <DoctorAppointments />}
                {activeTab === "prescriptions" && <UploadPrescription />}
                {activeTab === "patients" && (
                    <div className="text-gray-600 text-center">Coming Soon: Patient Records</div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;