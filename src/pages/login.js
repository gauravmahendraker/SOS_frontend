import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login({ darkMode }) {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (type) => {
    try {
      const response = await axios.get(`${API_URL}/login/${type}`);
      const { authUrl } = response.data;

      // Store the user type temporarily
      localStorage.setItem('tempUserType', type);

      // Redirect to the Google OAuth URL
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating login:', error);
    }
  };

  return (
    <div className={`login-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <h2>Login</h2>
      <div className="login-options">
        <button onClick={() => handleLogin('doctor')}>Login as Doctor</button>
        <button onClick={() => handleLogin('patient')}>Login as Patient</button>
      </div>
    </div>
  );
}

export default Login;