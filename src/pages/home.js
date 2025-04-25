import React from "react";
import "./home.css";

const Home = ({ darkMode }) => {
    return (
        <div className={`home-page ${darkMode ? "dark-mode" : "light-mode"}`}>
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>
                            Smart Health <span className="highlight">Portal</span>
                        </h1>
                        <p className="subtitle">
                            Revolutionize your healthcare experience with our AI-powered app,
                            delivering seamless appointments and consultations in seconds.
                        </p>
                        <div className="hero-buttons">
                            <button
                                className="btn primary"
                                onClick={() => {
                                    const token = localStorage.getItem("token");
                                    const userType = localStorage.getItem("userType");
                                    if (token && userType) {
                                        window.location.href = userType === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";
                                    } else {
                                        window.location.href = "/login";
                                    }
                                }}
                            >
                                Get Started <span className="arrow">→</span>
                            </button>

                            <button
                                className="btn secondary"
                                onClick={() => {
                                    const token = localStorage.getItem("token");
                                    const userType = localStorage.getItem("userType");
                                    if (token && userType) {
                                        window.location.href = userType === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";
                                    } else {
                                        window.location.href = "/login";
                                    }
                                }}
                            >
                                Explore Doctors
                            </button>

                        </div>
                    </div>
                    <div className="hero-image">
                        <img
                            src="/api/placeholder/500/400"
                            alt="Healthcare Illustration"
                        />
                    </div>
                </div>

                <div className="features-section">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                <line x1="9" y1="9" x2="9.01" y2="9" />
                                <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                        </div>
                        <h3>Find Verified Doctors</h3>
                        <p>Search for trusted, registered doctors based on specialty and location.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                                <path d="M8 7V3H16V7" />
                                <rect x="3" y="7" width="18" height="14" rx="2" />
                                <path d="M16 3V7" />
                            </svg>
                        </div>
                        <h3>Book Appointments Easily</h3>
                        <p>Seamlessly book consultation slots that suit your schedule and your doctor's availability.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                                <path d="M3 3h18v18H3z" />
                                <path d="M8 6h8M8 12h8M8 18h8" />
                            </svg>
                        </div>
                        <h3>View Prescriptions Anytime</h3>
                        <p>Access your medical prescriptions digitally after every appointment.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4M12 8h.01" />
                            </svg>
                        </div>
                        <h3>Doctor Registration</h3>
                        <p>Doctors can register to accept appointments and manage patient prescriptions online.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;