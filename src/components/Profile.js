import React from "react";

const Profile = ({ profile }) => (
    <div className="profile">
        <h3>Profile Information</h3>
        <p>Email: {profile.email}</p>
        <p>Contact: {profile.phone}</p>
    </div>
);

export default Profile;
