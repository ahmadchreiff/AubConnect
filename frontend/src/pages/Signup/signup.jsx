import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
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
  const [passwordVisible, setPasswordVisible] = useState(false);  // Track password visibility
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);  // Track confirm password visibility

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
            className={`bx ${passwordVisible ? 'bx-lock-open' : 'bx-lock'} group-i`} 
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
              setPasswordFormatError(password && !requirements.every(({ regex }) => regex.test(password))
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
                      <i className={`bx ${isValid ? 'bx-check-circle' : 'bx-circle'}`}></i> {text}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {passwordFormateError && <p className="error-message"><i className="bx bx-error-circle"></i> {passwordFormateError}</p>}

        <div className="group">
          <i 
            className={`bx ${passwordConfirmVisible ? 'bx-lock-open' : 'bx-lock'} group-i`} 
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
        {passwordError && <p className="error-message"><i className="bx bx-error-circle"></i> {passwordError}</p>}

        {/* Submit Button */}
        <button type="submit" className="signup-btn">Sign Up</button>

        {/* Login Redirect */}
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
