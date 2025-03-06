import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios"; // Import axios
import "./login-style.css";
import "boxicons/css/boxicons.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(""); // For backend errors
  const navigate = useNavigate(); // For redirection after successful login

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      // Send a POST request to the backend
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      // Handle successful login
      console.log("Login successful:", response.data);

      // Save the token to localStorage (if using JWT)
      localStorage.setItem("token", response.data.token);

      // Redirect to the homepage
      navigate(response.data.redirectUrl);
    } catch (err) {
      // Handle errors
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-section">
      <h2>Login</h2>
      {error && <p className="error-message"><i className="bx bx-error-circle"></i> {error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="group">
          <i className="bx bx-envelope group-i"></i>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="group">
          <i
            className={`bx ${passwordVisible ? "bx-hide" : "bx-show"} group-i`}
            onClick={togglePassword}
          ></i>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <div className="signup-redirect">
          New user? <Link to="/signup">Sign Up</Link>
        </div>
      </form>

      {/* Back to Home Button */}
      <div className="back-to-home">
        <Link to="/" className="back-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;