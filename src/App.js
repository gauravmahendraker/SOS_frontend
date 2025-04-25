import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import PatientDashboard from "./pages/patientDashboard";
import DoctorDashboard from "./pages/doctorDashboard";
import Home from "./pages/home";
import AuthCallback from "./services/authCallback";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
    document.body.className = prefersDark ? "dark-mode" : "light-mode";
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.className = !darkMode ? "dark-mode" : "light-mode";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    window.location.href = "/"; // redirect to homepage
  };

  return (
    <Router>
      <div className={`App ${darkMode ? "dark-mode" : "light-mode"}`}>
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login darkMode={darkMode} />} />
            <Route path="/auth/callback/:userType" element={<AuthCallback setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/patient-dashboard" element={
              isLoggedIn && localStorage.getItem("userType") === "patient"
                ? <PatientDashboard darkMode={darkMode} />
                : <Navigate to="/login" />
            } />
            <Route path="/doctor-dashboard" element={
              isLoggedIn && localStorage.getItem("userType") === "doctor"
                ? <DoctorDashboard darkMode={darkMode} />
                : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;