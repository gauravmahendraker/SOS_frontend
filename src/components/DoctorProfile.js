import React, { useState } from "react";
import "./DoctorProfile.css";

const DoctorProfile = ({ profile, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [newSlot, setNewSlot] = useState({ start: "", end: "" });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSlotChange = (e) => {
    setNewSlot(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSlot = () => {
    if (newSlot.start && newSlot.end) {
      setFormData(prev => ({
        ...prev,
        availableSlots: [...prev.availableSlots, newSlot],
      }));
      setNewSlot({ start: "", end: "" });
    }
  };

  const handleRemoveSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setEditMode(false);
  };

  return (
    <div className="doctor-profile-card">
      <h3>👨‍⚕️ Doctor Profile</h3>

      <div className="profile-section">
        <label>Email:</label>
        <input type="text" value={formData.email} disabled />
      </div>

      <div className="profile-section">
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="profile-section">
        <label>Specialization:</label>
        <input
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="profile-section">
        <label>Location:</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="profile-section">
        <label>Time Zone:</label>
        <input
          name="timeZone"
          value={formData.timeZone}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="profile-section">
        <label>Available Slots:</label>
        <ul className="slot-list">
          {formData.availableSlots.map((slot, index) => (
            <li key={index}>
              {new Date(slot.start).toLocaleString()} — {new Date(slot.end).toLocaleString()}
              {editMode && (
                <button className="remove-btn" onClick={() => handleRemoveSlot(index)}>✖</button>
              )}
            </li>
          ))}
        </ul>

        {editMode && (
          <div className="slot-inputs">
            <input type="datetime-local" name="start" value={newSlot.start} onChange={handleSlotChange} />
            <input type="datetime-local" name="end" value={newSlot.end} onChange={handleSlotChange} />
            <button onClick={handleAddSlot}>Add Slot</button>
          </div>
        )}
      </div>

      <div className="button-group">
        {editMode ? (
          <>
            <button onClick={handleSave} className="save-btn">💾 Save</button>
            <button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="edit-btn">✏️ Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;