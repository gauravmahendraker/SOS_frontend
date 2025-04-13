import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./AppointmentHistory.css";
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
                setError(
                    err.response && err.response.status === 401
                        ? "Authentication error. Please login again."
                        : "Failed to load appointments. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [API_URL]);

    const formatDateTime = (dateString) => {
        try {
            return format(new Date(dateString), "PPP 'at' p");
        } catch {
            return "Invalid date";
        }
    };

    const calculateEndTime = (startTime, durationMinutes) => {
        try {
            const endTime = new Date(new Date(startTime).getTime() + durationMinutes * 60000);
            return format(endTime, "p");
        } catch {
            return "Unknown";
        }
    };

    const getStatusBadge = (status) => {
        const statusClass = {
            confirmed: "success",
            canceled: "danger",
            completed: "secondary",
        }[status] || "dark";

        return <span className={`badge bg-${statusClass} text-capitalize`}>{status}</span>;
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const response = await axios.post(
                `${API_URL}/appointment/cancel`,
                { appointmentId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (response.status === 200) {
                setAppointments((prev) =>
                    prev.map((a) => (a._id === appointmentId ? { ...a, status: "canceled" } : a))
                );
            }
        } catch (err) {
            console.error("Error canceling appointment:", err);
            alert("Failed to cancel appointment. Please try again.");
        }
    };

    if (loading) return <div className="text-center my-4">Loading your appointments...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">📅 My Appointments</h2>

            {selectedAppointmentId && (
                <AppointmentDetails
                    appointmentId={selectedAppointmentId}
                    onClose={() => setSelectedAppointmentId(null)}
                />
            )}

            {appointments.length > 0 ? (
                <div className="row g-3">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="col-md-6">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="card-title mb-0">Dr. {appointment.doctorName}</h5>
                                        {getStatusBadge(appointment.status)}
                                    </div>
                                    <h6 className="card-subtitle text-muted mb-2">{appointment.doctorSpecialization}</h6>
                                    <p className="card-text mb-1">
                                        <strong>Date:</strong> {formatDateTime(appointment.timeSlotStart)}
                                    </p>
                                    <p className="card-text mb-1">
                                        <strong>Duration:</strong> {appointment.duration} minutes (
                                        {format(new Date(appointment.timeSlotStart), "p")} -{" "}
                                        {calculateEndTime(appointment.timeSlotStart, appointment.duration)})
                                    </p>
                                    {appointment.googleEventId && (
                                        <p className="text-success mb-2">
                                            <i className="bi bi-calendar-event"></i> Added to your Google Calendar
                                        </p>
                                    )}
                                    <div className="d-flex gap-2">
                                        {appointment.status === "confirmed" && (
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setSelectedAppointmentId(appointment._id)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-5">
                    <div style={{ fontSize: "3rem" }}>📭</div>
                    <p className="mt-2">You don't have any appointments yet.</p>
                    <a href="/search-doctors" className="btn btn-primary mt-2">
                        Book Your First Appointment
                    </a>
                </div>
            )}
        </div>
    );
};

export default AppointmentHistory;
