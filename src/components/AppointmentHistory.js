import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./appointmentHistory.css";
import AppointmentDetails from "./appointmentDetails.js";

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${API_URL}/appointment/my-appointments`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.status === 200) {
                    setAppointments(response.data.data);
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

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const response = await axios.post(
                `${API_URL}/appointments/cancel`,
                { appointmentId },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            if (response.status === 200) {
                setAppointments(appointments.map(appointment =>
                    appointment._id === appointmentId
                        ? { ...appointment, status: "canceled" }
                        : appointment
                ));
            }
        } catch (err) {
            console.error("Error canceling appointment:", err);
            alert("Failed to cancel appointment. Please try again.");
        }
    };

    if (loading) {
        return <div className="loading-spinner">Loading your appointments...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="appointments-container">
            <h2>My Appointments</h2>

            {selectedAppointmentId && (
                <AppointmentDetails
                    appointmentId={selectedAppointmentId}
                    onClose={() => setSelectedAppointmentId(null)}
                />
            )}

            {appointments?.length > 0 ? (
                <div className="appointments-list">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="appointment-card">
                            <div className="appointment-header">
                                <h3>Dr. {appointment.doctorName}</h3>
                                <span className={getStatusBadgeClass(appointment.status)}>
                                    {appointment.status}
                                </span>
                            </div>

                            <div className="appointment-details">
                                <p className="specialization">{appointment.doctorSpecialization}</p>
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

                                {appointment.googleEventId && (
                                    <p className="calendar-info">
                                        <i className="calendar-icon"></i> Added to your Google Calendar
                                    </p>
                                )}
                            </div>

                            <div className="appointment-actions">
                                {appointment.status === "confirmed" && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleCancelAppointment(appointment._id)}
                                    >
                                        Cancel Appointment
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
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <p>You don't have any appointments yet.</p>
                    <button
                        className="book-appointment-btn"
                        onClick={() => window.location.href = "/search-doctors"}
                    >
                        Book Your First Appointment
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentHistory;