import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./AppointmentHistory.css";
import AppointmentDetails from "./appointmentDetails.js";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState(null);
    const [prescriptionAppointmentId, setprescriptionAppointmentId] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${API_URL}/appointment/doctor/booked-slots`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.status === 200) {
                    setAppointments(response.data.data);
                    console.log(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching appointments:", err);
                if (err.response && err.response.status === 401) {
                    setError("Authentication error. Please login again.");
                } else {
                    setError("Failed to load appointments. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [API_URL]);

    const formatDateTime = (dateString) => {
        try {
            return format(new Date(dateString), "PPP 'at' p");
        } catch (err) {
            return "Invalid date";
        }
    };

    const calculateEndTime = (startTime, durationMinutes) => {
        try {
            const endTime = new Date(new Date(startTime).getTime() + durationMinutes * 60000);
            return format(endTime, "p");
        } catch (err) {
            return "Unknown";
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "confirmed":
                return "status-badge confirmed";
            case "canceled":
                return "status-badge canceled";
            case "completed":
                return "status-badge completed";
            default:
                return "status-badge";
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const response = await axios.post(
                `${API_URL}/appointments/update-status`,
                { appointmentId, status: newStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            if (response.status === 200) {
                setAppointments(appointments.map(appointment =>
                    appointment._id === appointmentId
                        ? { ...appointment, status: newStatus }
                        : appointment
                ));
            }
        } catch (err) {
            console.error("Error updating appointment status:", err);
            alert(`Failed to update appointment to ${newStatus}. Please try again.`);
        }
    };

    const handleAddPrescription = (appointmentId) => {
        setprescriptionAppointmentId(appointmentId);
        setFile(null);
        setDescription("");
    };

    const handleUpload = async () => {
        if (!file || !prescriptionAppointmentId) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", description);
        formData.append("appointmentId", prescriptionAppointmentId);

        try {
            const response = await axios.post(
                `${API_URL}/appointment/doctor/upload-prescription`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("Prescription uploaded successfully");
            setprescriptionAppointmentId(null);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload prescription");
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading appointment schedule...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Filter appointments into upcoming and past
    const now = new Date();
    const upcomingAppointments = appointments.filter(
        app => new Date(app.timeSlotStart) >= now && app.status !== "canceled"
    );
    const pastAppointments = appointments.filter(
        app => new Date(app.timeSlotStart) < now || app.status === "canceled"
    );
    return (
        <div className="appointments-container">
            <h2>My Appointment Schedule</h2>

            {selectedAppointmentId && (
                <AppointmentDetails
                    appointmentId={selectedAppointmentId}
                    onClose={() => setSelectedAppointmentId(null)}
                />
            )}

            {appointments?.length > 0 ? (
                <>
                    {upcomingAppointments.length > 0 && (
                        <>
                            <h3 className="section-title">Upcoming Appointments</h3>
                            <div className="appointments-list">
                                {upcomingAppointments.map((appointment) => (
                                    <div key={appointment._id} className="appointment-card">
                                        <div className="appointment-header">
                                            <h3>{appointment.patientName}</h3>
                                            <span className={getStatusBadgeClass(appointment.status)}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        <div className="appointment-details">
                                            <p className="reason">{appointment.reason || "General Consultation"}</p>
                                            <p className="date-time">
                                                <strong>Date:</strong> {formatDateTime(appointment.timeSlotStart)}
                                            </p>
                                            <p className="duration">
                                                <strong>Duration:</strong> {appointment.duration} minutes
                                                <span className="time-slot">
                                                    ({format(new Date(appointment.timeSlotStart), "p")} -
                                                    {calculateEndTime(appointment.timeSlotStart, appointment.duration)})
                                                </span>
                                            </p>
                                        </div>

                                        <div className="appointment-actions">
                                            {appointment.status === "confirmed" && (
                                                <>
                                                    <button
                                                        className="cancel-btn"
                                                        onClick={() => handleUpdateAppointmentStatus(appointment._id, "canceled")}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="complete-btn"
                                                        onClick={() => handleUpdateAppointmentStatus(appointment._id, "completed")}
                                                    >
                                                        Mark Completed
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="details-btn"
                                                onClick={() => setSelectedAppointmentId(appointment._id)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {pastAppointments.length > 0 && (
                        <>
                            <h3 className="section-title">Past Appointments</h3>
                            <div className="appointments-list">
                                {pastAppointments.map((appointment) => (
                                    <div key={appointment._id} className="appointment-card">
                                        <div className="appointment-header">
                                            <h3>{appointment.patientName}</h3>
                                            <span className={getStatusBadgeClass(appointment.status)}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        <div className="appointment-details">
                                            <p className="reason">{appointment.reason || "General Consultation"}</p>
                                            <p className="date-time">
                                                <strong>Date:</strong> {formatDateTime(appointment.timeSlotStart)}
                                            </p>
                                            <p className="duration">
                                                <strong>Duration:</strong> {appointment.duration} minutes
                                                <span className="time-slot">
                                                    ({format(new Date(appointment.timeSlotStart), "p")} -
                                                    {calculateEndTime(appointment.timeSlotStart, appointment.duration)})
                                                </span>
                                            </p>
                                        </div>

                                        <div className="appointment-actions">
                                            {prescriptionAppointmentId === appointment._id ? (
                                                <div className="upload-section">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.png"
                                                        onChange={(e) => setFile(e.target.files[0])}
                                                    />
                                                    <textarea
                                                        placeholder="Enter description (optional)"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                    <button className="upload-btn" onClick={handleUpload}>
                                                        Upload
                                                    </button>
                                                    <button className="cancel-btn" onClick={() => setprescriptionAppointmentId(null)}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="prescription-btn"
                                                    onClick={() => handleAddPrescription(appointment._id)}
                                                >
                                                    {appointment.prescriptions?.length > 0
                                                        ? "Add More Prescriptions"
                                                        : "Add Prescription"}
                                                </button>
                                            )}

                                            <button
                                                className="details-btn"
                                                onClick={() => setSelectedAppointmentId(appointment._id)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <p>You don't have any appointments scheduled yet.</p>
                    <button
                        className="set-availability-btn"
                        onClick={() => window.location.href = "/set-availability"}
                    >
                        Set Your Availability
                    </button>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;