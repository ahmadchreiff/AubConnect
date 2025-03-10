import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    // Replace with your actual backend API URL
        const fetchUserName = async () => {
            console.log("Fetching user name..."); // Log fetching action

      try {
        const response = await fetch("/user/username"); // Replace 'username' with the actual username variable
            console.log("Response received:", response); // Log the response


        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
            console.log("User data:", data); // Log the user data

        setUserName(data.name || "Guest"); // Use API name, fallback to "Guest"
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserName("Guest"); // If error, use default
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="homepage">
      <header className="navbar">
        <div className="logo">AUBConnect</div>

        {/* Fixed: Search Bar Now Properly Aligned */}
        <div className="search-bar">
          <input type="text" placeholder="Search by Professor..." />
          <input type="text" placeholder="Search by Course..." />
        </div>

        <nav className="nav-links">
          <Link to="/reviews">Post a Review</Link>
          <Link to="/past-reviews">Past Reviews</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/logout">Log Out</Link>
        </nav>
      </header>

      <div className="container">
        <aside className="sidebar">
          <p className="username">{userName}</p>
          <Link to="/saved">Saved</Link>
          <Link to="/settings">Settings</Link>
        </aside>

        <main className="main-content">
          <section className="recent-reviews">
            <h2>Recent Reviews</h2>
            <div className="review-card">
              <h3>Course: CMPS 202</h3>
              <div className="review-rating">
                <span>Rating:</span>
                <div className="stars">
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>☆</span>
                </div>
              </div>
              <p className="review-text">"Great course! Highly recommended."</p>
              <Link to="/review-details" className="read-more">
                Read More →
              </Link>
            </div>
          </section>
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2025 AUBConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;