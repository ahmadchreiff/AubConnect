import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="navbar">
        <div className="logo">AUBConnect</div>
        <div className="spacer"></div>
        <div className="search-bar">
          <input type="text" placeholder="Search by Professor..." />
          <input type="text" placeholder="Search by Course..." />
        </div>
        <nav className="nav-links">
          {/* Update the "Post a Review" Link to point to /reviews */}
          <Link to="/reviews">Post a Review</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/logout">Log Out</Link>
        </nav>
      </header>

      <div className="container">
        <aside className="sidebar">
          <p className="username">User's Name</p>
          <Link to="/saved">Saved</Link>
          <Link to="/settings">Settings</Link>
        </aside>

        <main className="main-content">
          <section className="recent-reviews">
            <h2>Recent Reviews</h2>
            <div className="review-card">
              <h3>Course: CMPS 202</h3>
              <p>Rating: ⭐⭐⭐⭐☆</p>
              <p>"Great course! Highly recommended."</p>
              <Link to="/review-details">Read More →</Link>
              <div className="review-actions">
                <button className="like-btn">
                  <i className="fas fa-thumbs-up"></i> <span>(12)</span>
                </button>
                <button className="comment-btn">
                  <i className="fas fa-comment"></i> <span>(5)</span>
                </button>
              </div>
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