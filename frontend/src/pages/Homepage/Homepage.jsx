import React from "react";
import { Link } from "react-router-dom";
import "./Homepage-style.css";

const Homepage = () => {
  return (
    <div className="homepage-section">
      <h2>Welcome to AubConnect</h2>
      <p className="welcome-text">Your one-stop platform for professor reviews and more!</p>

      <div className="link-section">
        <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>
      </div>

      <div className="footer">
        <p>© 2025 AubConnect | <Link to="/about">About Us</Link></p>
      </div>
    </div>
  );
};

export default Homepage;
