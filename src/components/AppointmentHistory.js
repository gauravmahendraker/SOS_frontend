import React from "react";

const AppointmentHistory = ({ appointments }) => (
    <div className="appointments">
        <h3>Appointment History</h3>
        {appointments?.length > 0 ? (
            <ul>
                {appointments.map((appointment) => (
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
);

export default AppointmentHistory;
