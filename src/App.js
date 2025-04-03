import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import Login from './components/login';
import Register from './components/register';
import PatientDashboard from './components/patientDashboard';
import AuthCallback from "./components/authCallback";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/auth/callback/:userType" element={<AuthCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
