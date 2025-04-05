import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import PatientDashboard from "./pages/patientDashboard";
import DoctorDashboard from "./pages/doctorDashboard";
import AuthCallback from "./services/authCallback";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <div className="home-page">
                  <div className="hero-section">
                    <div className="hero-content">
                      <div className="hero-text">
                        <h1>
                          Welcome to{" "}
                          <span className="highlight">Smart Health Portal</span>
                        </h1>
                        <p>
                          Your one-stop solution for booking appointments,
                          consulting doctors, and managing your health records
                          with ease and security.
                        </p>
                        <div className="hero-buttons">
                          <a href="/login" className="btn primary">
                            Login
                          </a>
                          <a href="/search" className="btn secondary">
                            Explore Doctors
                          </a>
                        </div>
                      </div>
                      <div className="hero-image">
                        {/* <img
                          src="images.jpeg"
                          alt="Healthcare"
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/auth/callback/:userType" element={<AuthCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
