import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import Login from './pages/login';
import PatientDashboard from './pages/patientDashboard';
import AuthCallback from "./services/authCallback";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/auth/callback/:userType" element={<AuthCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
