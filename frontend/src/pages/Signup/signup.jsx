import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup-style.css";
import "boxicons/css/boxicons.min.css";

const Signup = () => {
  const [password, setPassword] = useState("");
  const [passwordFormateError, setPasswordFormatError] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [requirementsVisible, setRequirementsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // State for verification code
  const [showVerificationPopup, setShowVerificationPopup] = useState(false); // State to control popup visibility
  const navigate = useNavigate();

  const requirements = [
    { regex: /.{8,}/, id: "lengthReq", text: "At least 8 characters" },
    { regex: /[a-z]/, id: "lowercaseReq", text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, id: "uppercaseReq", text: "At least 1 uppercase letter" },
    { regex: /[^A-Za-z0-9]/, id: "symbolReq", text: "At least 1 special symbol" },
    { regex: /\d/, id: "numberReq", text: "At least 1 number" },
  ];

  const checkPassword = (value) => {
    setPassword(value);
    let allValid = true;

    requirements.forEach(({ regex, id }) => {
      const element = document.getElementById(id);
      if (element) {
        const isValid = regex.test(value);
        element.classList.toggle("valid", isValid);
        allValid = allValid && isValid;
      }
    });

    setRequirementsVisible(!allValid);
  };

  const validatePasswordMatch = () => {
    if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  const validateEmailFormat = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@mail\.aub\.edu$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please use an AUB email");
    } else {
      setEmailError("");
    }
  };

  const togglePassword = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "passwordConfirm") {
      setPasswordConfirmVisible(!passwordConfirmVisible);
    }
  };

  // Function to send verification code
  const sendVerificationCode = async () => {
    try {
      await axios.post("http://localhost:5001/api/auth/send-verification-code", { email });
      setShowVerificationPopup(true); // Show the verification popup
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification code");
    }
  };

  const verifyCode = async () => {
    try {
      // Verify the code
      const verifyResponse = await axios.post("http://localhost:5001/api/auth/verify-code", { email, verificationCode });
  
      // If verification is successful, proceed with signup
      if (verifyResponse.data.token) {
        // Save the token (e.g., in localStorage or context)
        localStorage.setItem('token', verifyResponse.data.token);
  
        // Redirect to the login page or dashboard
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired verification code");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate email and password
    validateEmailFormat();
    validatePasswordMatch();
  
    if (emailError || passwordError || passwordFormateError) {
      return; // Stop if there are validation errors
    }
  
    try {
      // Send user data to the backend and request a verification code
      await axios.post("http://localhost:5001/api/auth/send-verification-code", {
        name: username,
        username,
        email,
        password,
      });
  
      // Show the verification popup
      setShowVerificationPopup(true);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification code");
    }
  };

  return (
    <div className="signup-section">
      <h2>Sign Up</h2>
      {error && <p className="error-message"><i className="bx bx-error-circle"></i> {error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="group">
          <i className="bx bx-user group-i"></i>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="group">
          <i className="bx bx-envelope group-i"></i>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmailFormat}
          />
        </div>
        {emailError && <p className="error-message"><i className="bx bx-error-circle"></i> {emailError}</p>}

        <div className="group">
          <i
            className={`bx ${passwordVisible ? "bx-lock-open" : "bx-lock"} group-i`}
            onClick={() => togglePassword("password")}
          ></i>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => checkPassword(e.target.value)}
            onFocus={() => setRequirementsVisible(true)}
            onBlur={() => {
              setRequirementsVisible(false);
              setPasswordFormatError(
                password && !requirements.every(({ regex }) => regex.test(password))
                  ? "Password doesn't meet the requirements"
                  : ""
              );
            }}
            required
          />
          {requirementsVisible && (
            <div className="requirments-wrapper">
              <ul className="requirment-list">
                {requirements.map(({ id, text, regex }) => {
                  const isValid = regex.test(password);
                  return (
                    <li key={id} id={id}>
                      <i className={`bx ${isValid ? "bx-check-circle" : "bx-circle"}`}></i> {text}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {passwordFormateError && (
          <p className="error-message">
            <i className="bx bx-error-circle"></i> {passwordFormateError}
          </p>
        )}

        <div className="group">
          <i
            className={`bx ${passwordConfirmVisible ? "bx-lock-open" : "bx-lock"} group-i`}
            onClick={() => togglePassword("passwordConfirm")}
          ></i>
          <input
            type={passwordConfirmVisible ? "text" : "password"}
            id="passwordConfirm"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={validatePasswordMatch}
            required
          />
        </div>
        {passwordError && (
          <p className="error-message">
            <i className="bx bx-error-circle"></i> {passwordError}
          </p>
        )}

        {/* Submit Button */}
        <button type="submit" className="signup-btn">
          Sign Up
        </button>

        {/* Login Redirect */}
        <div className="login-redirect">
          Already a registered user? <Link to="/login">Login</Link>
        </div>
      </form>

      {/* Back to Home Button */}
      <div className="back-to-home">
        <Link to="/" className="back-btn">
          Back to Home
        </Link>
      </div>

      {/* Verification Popup */}
      {showVerificationPopup && (
        <div className="verification-popup">
          <div className="popup-content">
            <h3>Verify Your Email</h3>
            <p>We've sent a verification code to your email (check junk). Please enter it below: </p>
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={verifyCode}>Verify</button>
            <button onClick={() => setShowVerificationPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;