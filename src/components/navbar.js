import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="logo-icon">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        Smart Health
      </Link>
      <div className="nav-buttons">
        {isLoggedIn ? (
          <button onClick={onLogout} className="btn secondary">Logout</button>
        ) : (
          <Link to="/login" className="btn primary">SignIn <span className="arrow">→</span></Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;