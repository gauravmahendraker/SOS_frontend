import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { userType } = useParams(); // Get 'doctor' or 'patient' from the URL

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const tempUserType = localStorage.getItem("tempUserType"); // Retrieve user type

    if (code && tempUserType) {
      axios.post(`${process.env.REACT_APP_API_URL}/auth/google/callback/${tempUserType}`, { code })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userType", tempUserType);
          localStorage.removeItem("tempUserType"); // Remove after successful authentication

          // Redirect to the appropriate dashboard
          navigate(tempUserType === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
        })
        .catch((err) => {
          console.error("Authentication failed", err);
        });
    }
  }, []);

  return <div>Logging in...</div>;
};

export default AuthCallback;
