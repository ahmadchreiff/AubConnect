import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./signup-style.css";
import "boxicons/css/boxicons.min.css";

const Signup = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [requirementsVisible, setRequirementsVisible] = useState(false);

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

  const togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
  };

  return (
    <div className="signup-section">
      <h2>Sign Up</h2>
      <form>
        <div className="group">
          <i className="bx bx-user group-i"></i>
          <input type="text" placeholder="Username" required />
        </div>

        <div className="group">
          <i className="bx bx-envelope group-i"></i>
          <input type="email" placeholder="Email" required />
        </div>

        <div className="group">
          <i className="bx bx-lock group-i" onClick={() => togglePassword("password")}></i>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => checkPassword(e.target.value)}
            onFocus={() => setRequirementsVisible(true)}
            onBlur={() => setRequirementsVisible(false)}
            required
          />
          {requirementsVisible && (
            <div className="requirments-wrapper">
              <ul className="requirment-list">
                {requirements.map(({ id, text }) => (
                  <li key={id} id={id}>
                    <i className="bx bx-circle"></i> {text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="group">
          <i className="bx bx-lock group-i" onClick={() => togglePassword("passwordConfirm")}></i>
          <input
            type="password"
            id="passwordConfirm"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={validatePasswordMatch}
            required
          />
        </div>
        {passwordError && <p className="error-message"><i className="bx bx-error-circle"></i> {passwordError}</p>}

        <button type="submit" className="signup-btn">Sign Up</button>

        <div className="login-redirect">
          Already a registered user? <Link to="/login">Login</Link> {/* Link to login */}
        </div>
      </form>

      {/* Back to Home Button */}
      <div className="back-to-home">
        <Link to="/" className="back-btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default Signup;
