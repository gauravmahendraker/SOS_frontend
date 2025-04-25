import React from "react";
import "./Profile.css";

const Profile = ({ profile }) => (
  <div className="card shadow-sm p-4 bg-light mb-4">
    <h3 className="card-title mb-3">👤 Profile Information</h3>
    <ul className="list-group list-group-flush">
      <li className="list-group-item">
        <strong>Email:</strong> {profile.email}
      </li>
      <li className="list-group-item">
        <strong>Contact:</strong> {profile.phone}
      </li>
    </ul>
  </div>
);

export default Profile;
