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
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const loadRazorpay = () => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => setRazorpayLoaded(true);  // Set razorpayLoaded to true after script loads
            script.onerror = () => setError("Failed to load Razorpay script");
            document.body.appendChild(script);
        };

        loadRazorpay();  // Load Razorpay script when component mounts
    }, []);
    
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

        return <span className={`badge bg-${statusClass}`}>{status}</span>;
    };

    const handlePayment = async (appointment) => {
        if (!razorpayLoaded) {
            alert("Razorpay is not loaded. Please try again.");
            return;
        }
        
        try {
            console.log('Razorpay Loaded:', razorpayLoaded);
            const res = await axios.post(
                `${API_URL}/payment/create-order`,
                { appointmentId: appointment._id },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            const { orderId, amount, currency } = res.data.data;
            // console.log(res.data.data);

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY,  // from Razorpay dashboard
                amount,
                currency,
                name: "Doctor Appointment",
                description: "Appointment Payment",
                order_id: orderId,
                handler: async (response) => {
                    // Send this to backend for verification
                    await axios.post(
                        `${API_URL}/payment/verify`,
                        {
                            appointmentId: appointment._id,
                            ...response, // includes payment_id, order_id, signature
                        },
                        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );

                    alert("Payment Successful!");
                    window.location.reload(); // or update state accordingly
                },
                prefill: {
                    name: "Patient Name", // optional
                    email: "email@example.com", // optional
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (err) {
            console.error("Payment error:", err);
            alert("Payment failed. Please try again.");
        }
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

    // Categorize appointments
    const categorizeAppointments = () => {
        const now = new Date();
        const upcoming = [];
        const completed = [];
        const canceled = [];
        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.timeSlotStart);

            if (appointment.status === "canceled") {
                canceled.push(appointment);
            } else if (appointment.status === "completed" || appointmentDate < now) {
                completed.push(appointment);
            } else {
                upcoming.push(appointment);
            }
        });

        // Sort upcoming by date (ascending)
        upcoming.sort((a, b) => new Date(a.timeSlotStart) - new Date(b.timeSlotStart));

        // Sort completed by date (descending)
        completed.sort((a, b) => new Date(b.timeSlotStart) - new Date(a.timeSlotStart));

        // Sort canceled by date (descending)
        canceled.sort((a, b) => new Date(b.timeSlotStart) - new Date(a.timeSlotStart));

        return { upcoming, completed, canceled };
    };

    const renderAppointmentCard = (appointment) => (
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
                        {appointment.status === "confirmed" && !appointment.isPaid && (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => handlePayment(appointment)}
                            >
                                Pay Now
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
    );

    const { upcoming, completed, canceled } = categorizeAppointments();

    if (loading) return <div className="text-center my-4">Loading your appointments...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    const noAppointments = upcoming.length === 0 && completed.length === 0 && canceled.length === 0;
    return (
        <div className="container my-4">
            <h2 className="mb-4">📅 My Appointments</h2>

            {selectedAppointmentId && (
                <AppointmentDetails
                    appointmentId={selectedAppointmentId}
                    onClose={() => setSelectedAppointmentId(null)}
                />
            )}

            {noAppointments ? (
                <div className="no-appointments">
                    <div style={{ fontSize: "3rem" }}>📭</div>
                    <p className="mt-2">You don't have any appointments yet.</p>
                    <a href="/search-doctors" className="btn btn-primary mt-2">
                        Book Your First Appointment
                    </a>
                </div>
            ) : (
                <>
                    {upcoming.length > 0 && (
                        <div className="appointment-section">
                            <h3 className="section-title">Upcoming Appointments</h3>
                            <div className="row">
                                {upcoming.map(renderAppointmentCard)}
                            </div>
                        </div>
                    )}

                    {completed.length > 0 && (
                        <div className="appointment-section">
                            <h3 className="section-title">Completed Appointments</h3>
                            <div className="row">
                                {completed.map(renderAppointmentCard)}
                            </div>
                        </div>
                    )}

                    {canceled.length > 0 && (
                        <div className="appointment-section">
                            <h3 className="section-title">Canceled Appointments</h3>
                            <div className="row">
                                {canceled.map(renderAppointmentCard)}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AppointmentHistory;