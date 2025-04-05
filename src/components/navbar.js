import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Make sure this is present

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Smart Health</Link>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </div>

      <div className="navbar-right">
        <Link to="/login" className="login-button">Login</Link>
        {/* <Link to="/register" className="register-button">Register</Link> */}
      </div>
    </nav>
  );
}

export default Navbar;
