// src/pages/LandingPage/LandingPage.js
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Landing-Styles.css"; // Import the CSS file

const LandingPage = () => {
    return (
        <div>
            <header className="navBar" aria-label="Main Navigation">
                <div className="nav-container">
                    {/* Logo at the start of the navbar */}
                    <img src="images/logoIcon-fotor-2025031020293.png" alt="AUBConnect Logo" />
                    {/* Navigation Links */}
                    <ul className="nav-links">
                        <li><Link to="/aboutus" aria-label="About Us">About Us</Link></li>
                        <li><a href="mailto:janajafal86@mail.aub.edu" aria-label="Report Error">Report Error</a></li>
                        <li><a href="#" aria-label="Logout">Logout</a></li>
                    </ul>
                </div>
            </header>

            {/* First Part */}
            <div className="first-part">
                <div className="intro">
                    <h1>Welcome to AUBConnect</h1>
                    <p>Explore real student reviews on courses and professors at AUB to make informed academic choices!</p>
                    <button>Get Started</button>
                </div>
            </div>

            {/* Additional Sections */}
            <div className="section">Section 1</div>
            <div className="section">Section 2</div>
            <div className="section">Section 3</div>
        </div>
    );
};

export default LandingPage;
