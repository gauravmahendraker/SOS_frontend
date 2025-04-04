import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import "./ScheduleAppointment.css";

const ScheduleAppointment = () => {
    const { doctorId } = useParams(); // If coming from doctor details page
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(doctorId || "");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [appointmentDuration, setAppointmentDuration] = useState(30); // Default duration in minutes
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get user's timezone

    // Fetch doctors for dropdown selection
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${API_URL}/doctor`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.status === 200) {
                    setDoctors(response.data.data);

                    // If doctorId is provided in URL and exists in the fetched doctors, select it
                    if (doctorId && response.data.data.some(doc => doc._id === doctorId)) {
                        setSelectedDoctor(doctorId);
                        checkAvailabilityForDate(new Date(), doctorId);
                    }
                }
            } catch (err) {
                console.error("Error fetching doctors:", err);
                setError("Failed to load doctors. Please try again later.");
            }
        };

        fetchDoctors();
    }, [API_URL, doctorId]);

    // Function to check availability when doctor or date changes
    const checkAvailabilityForDate = async (date, doctor = selectedDoctor) => {
        if (!doctor) {
            setError("Please select a doctor first");
            return;
        }

        setIsCheckingAvailability(true);
        setAvailableSlots([]);
        setSelectedSlot(null);

        try {
            const formattedDate = moment(date).format("YYYY-MM-DD");

            const response = await axios.post(
                `${API_URL}/appointment/check-availability`,
                {
                    doctor,
                    date: formattedDate,
                    timeZone: USER_TIMEZONE
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            if (response.status === 200) {
                // Format the slots for UI display
                const formattedSlots = response.data.data.map(slot => ({
                    start: new Date(slot.start),
                    end: new Date(slot.end),
                    display: `${moment(slot.start).format("h:mm A")} - ${moment(slot.end).format("h:mm A")}`
                }));

                setAvailableSlots(formattedSlots);

                if (formattedSlots.length === 0) {
                    setError(`No available slots on ${moment(date).format("MMMM D, YYYY")}`);
                } else {
                    setError(null);
                }
            }
        } catch (err) {
            console.error("Error checking availability:", err);
            setError("Failed to check availability. Please try again.");
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    // Handle doctor selection change
    const handleDoctorChange = (e) => {
        const newDoctorId = e.target.value;
        setSelectedDoctor(newDoctorId);
        if (newDoctorId) {
            checkAvailabilityForDate(selectedDate, newDoctorId);
        } else {
            setAvailableSlots([]);
        }
    };

    // Handle date selection change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (selectedDoctor) {
            checkAvailabilityForDate(date);
        }
    };

    // Handle slot selection
    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setError(null);
    };

    // Handle duration change
    const handleDurationChange = (e) => {
        setAppointmentDuration(parseInt(e.target.value));
    };

    // Handle booking appointment
    const handleBookAppointment = async () => {
        if (!selectedDoctor || !selectedSlot) {
            setError("Please select a doctor and time slot");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

            const response = await axios.post(
                `${API_URL}/appointment/book`,
                {
                    doctor: selectedDoctor,
                    patient: localStorage.getItem("userId"), // Assuming you store userId in localStorage
                    date: formattedDate,
                    timeSlotStart: selectedSlot.start,
                    duration: appointmentDuration,
                    timeZone: USER_TIMEZONE
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            if (response.status === 201) {
                setSuccess("Appointment booked successfully!");
                // Clear selections
                setSelectedSlot(null);

                // Redirect to appointments page after 2 seconds
                setTimeout(() => {
                    navigate("/patient-dashboard");
                }, 2000);
            }
        } catch (err) {
            console.error("Error booking appointment:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to book appointment. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Filter out past dates from date picker
    const isDateInPast = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    return (
        <div className="schedule-appointment-container">
            <h2>Schedule an Appointment</h2>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label htmlFor="doctor">Select Doctor</label>
                <select
                    id="doctor"
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
                    disabled={loading}
                >
                    <option value="">-- Select a Doctor --</option>
                    {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>
                            Dr. {doctor.name} - {doctor.specialization}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="date">Select Date</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    filterDate={isDateInPast}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="date-picker"
                    disabled={!selectedDoctor || loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="duration">Appointment Duration</label>
                <select
                    id="duration"
                    value={appointmentDuration}
                    onChange={handleDurationChange}
                    disabled={loading}
                >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                </select>
            </div>

            <div className="available-slots-section">
                <h3>Available Time Slots</h3>

                {isCheckingAvailability ? (
                    <div className="loading-message">Checking availability...</div>
                ) : (
                    <div className="slots-container">
                        {availableSlots.length > 0 ? (
                            availableSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    className={`slot-button ${selectedSlot && selectedSlot.start.getTime() === slot.start.getTime() ? 'selected' : ''}`}
                                    onClick={() => handleSlotSelect(slot)}
                                    disabled={loading}
                                >
                                    {slot.display}
                                </button>
                            ))
                        ) : (
                            <p className="no-slots-message">
                                {selectedDoctor ? "No available slots for the selected date." : "Please select a doctor and date."}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="button-container">
                <button
                    className="book-button"
                    onClick={handleBookAppointment}
                    disabled={!selectedDoctor || !selectedSlot || loading}
                >
                    {loading ? "Booking..." : "Book Appointment"}
                </button>
            </div>
        </div>
    );
};

export default ScheduleAppointment;