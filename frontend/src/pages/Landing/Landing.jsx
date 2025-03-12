import React from 'react';
import './Landing-Styles.css'; // Import the CSS file
import logo from './images/logoIcon-fotor-2025031020293.png'; // Import the logo image
import openingImage from './images/openingImgae.jpeg'; // Import the background image

const Landing = () => {
  return (
    <div>
      {/* Navbar */}
      <header className="navBar" aria-label="Main Navigation">
        <div className="nav-container">
          <img src={logo} alt="AUBConnect Logo" />
          <ul className="nav-links">
            <li><a href="/about-us" aria-label="About Us">About Us</a></li>
            <li><a href="mailto:janajafal86@mail.aub.edu" aria-label="Report Error">Report Error</a></li>
            <li><a href="/logout" aria-label="Logout">Logout</a></li>
          </ul>
        </div>
      </header>

      {/* First Part */}
      <div className="first-part" style={{ backgroundImage: `url(${openingImage})` }}>
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

export default Landing;