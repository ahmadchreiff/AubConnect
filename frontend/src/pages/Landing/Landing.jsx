import React from 'react';
import './style.css'; // Assuming you move your CSS into App.css
import logo from './images/otherlogo.png';
import anonymous from './images/anonymous2.png';
import pic1 from './images/pic1.jpg';
import reviews from './images/reviews.jpg';
import community from './images/community.jpg';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="top">
      <div className="navbar">
        <div className="icon">
          <img src={logo} alt="AUBConnect Logo" className="logo" />
        </div>
        <div className="menu">
          <ul>
            <li className="navbar__btn">
              <Link to="/signup" className="button">Sign Up</Link>
              <Link to="/login" className="button">Log in</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="main_container">
        <div className="main_content">
          <h1>Welcome to <span className="highlight-name">AUBConnect</span></h1>
          <p className="bigger-message">Your Ultimate Resource for Course and Professor Reviews at AUB</p>
          <p className="smaller-text">Explore real student experiences, honest feedback, and helpful insights to choose the right courses and professors for you.</p>
          <button className="main_button"><Link to="/signup">Get Started</Link></button>
        </div>
        <div className="main_img_container">
          <img src={pic1} alt="pic" id="main_img" />
        </div>
      </div>

      <div className="reviews-section">
        <div className="intro-text">
          <h2>Real Insights from AUB Students</h2>
          <p>Make informed decisions about courses and professors. Read authentic student reviews and choose wisely.</p>
          <p className="highlight">✔ 100+ student reviews available</p>
          <p className="highlight">✔ Anonymous and unbiased feedback</p>
        </div>

        <div className="review-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p className="review-text">"One of the best professors I've had! His lectures are engaging, and the assignments truly help reinforce the material."</p>
          <p className="review-author">— Student from CMPS 201</p>
        </div>
      </div>

      <section className="services">
        <div className="service-card">
          <img src={anonymous} alt="Anonymous Reviews" />
          <h3>Anonymous Reviews</h3>
          <p>Share and read reviews anonymously to ensure honest feedback.</p>
        </div>
        <div className="service-card">
          <img src={reviews} alt="Honest Feedback" />
          <h3>Honest Feedback</h3>
          <p>Our platform promotes genuine reviews for a transparent experience.</p>
        </div>
        <div className="service-card">
          <img src={community} alt="AUB Community" />
          <h3>AUB Community</h3>
          <p>Join a community of students helping each other make informed decisions.</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>AUBConnect</h3>
            <p>Your go-to platform for honest course and professor reviews.</p>
          </div>

          <div className="footer-section">
  
          </div>
        </div>
        <p className="footer-bottom">&copy; 2025 AUBConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
