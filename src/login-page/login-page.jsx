import React, { useState } from "react";
import "./login-page.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here (e.g., API call)
    console.log("Logged in with:", email, password);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log in</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log in</button>
      </form>
      <div className="login-links">
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="signup-link">
            Create one now.
          </a>
        </p>
        <a href="/forgot-password" className="forgot-password-link">
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default Login;
