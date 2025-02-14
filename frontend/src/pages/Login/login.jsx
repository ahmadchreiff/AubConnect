import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./login-style.css";
import "boxicons/css/boxicons.min.css";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-section">
      <h2>Login</h2>
      <form>
        <div className="group">
          <i className="bx bx-envelope group-i"></i>
          <input type="email" placeholder="Email" required />
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
          />
        </div>

        <button type="submit" className="login-btn">Login</button>

        <div className="signup-redirect">
          New user? <Link to="/signup">Sign Up</Link> {/* Link to signup */}
        </div>
      </form>

      {/* Back to Home Button */}
      <div className="back-to-home">
        <Link to="/" className="back-btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default Login;
