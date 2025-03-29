import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import openingImage from "./images/openingImgae.jpeg";
import searchByCourse from "./images/course.mp4";
import postReview from "./images/posting.mp4";
import filterVotes from "./images/filter.mp4";
import searchByDepartment from "./images/searchByDepartment.mp4";
import trendingCourses from "./images/trend.mp4";
import professors from "./images/professor.mp4";

const LandingPage = () => {
  const navigate = useNavigate();
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [showSignUp, setShowSignUp] = useState(true);
  const ctaRef = useRef(null);

  // Navigation handlers
  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleVideoClick = (videoId) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const handleFAQClick = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const toggleSection = () => {
    setShowSignUp(!showSignUp);
  };

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${openingImage})`,
        }}
      >
        <h1>Take Control of Your University Experience</h1>
        <p>Find honest course & professor reviews, so you never regret your choices again</p>
        <button className="cta-button" onClick={scrollToCTA}>
          Join Now – It's Free!
        </button>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose AUBConnect?</h2>
        <div className="feature-list">
          <div className="feature">
            <h3> Search by Department</h3>
            <p>Find courses within your department, so you don't end up in the wrong class</p>
          </div>
          <div className="feature">
            <h3> Trending Courses</h3>
            <p>See what's popular among students and what courses are in demand</p>
          </div>
          <div className="feature">
            <h3> Star Rating System</h3>
            <p>Courses and professors are rated based on student experiences</p>
          </div>
          <div className="feature">
            <h3> Upvote & Downvote Reviews</h3>
            <p>Sort reviews based on their usefulness, so you always get the best insights</p>
          </div>
          <div className="feature">
            <h3> Filter & Search Reviews</h3>
            <p>Find reviews based on rating, most useful, or newest posts</p>
          </div>
          <div className="feature">
            <h3> Check & Edit Your Reviews</h3>
            <p>Keep track of your past reviews and edit them whenever needed</p>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="demo-videos">
        <h2>See It in Action</h2>
        <div className="video-list">
          {[
            { id: "search-course", title: "Searching by Course", videoSrc: searchByCourse },
            { id: "search-department", title: "Searching by Department", videoSrc: searchByDepartment },
            { id: "trending-courses", title: "Trending Courses", videoSrc: trendingCourses },
            { id: "post-review", title: "Posting a Review", videoSrc: postReview },
            { id: "filter-vote-reviews", title: "Filtering & Voting Reviews", videoSrc: filterVotes },
            { id: "search-professor", title: "Searching by Professor", videoSrc: professors },
          ].map(({ id, title, videoSrc }) => (
            <div
              className={`video-item ${expandedVideo === id ? "expanded" : ""}`}
              key={id}
              onClick={() => handleVideoClick(id)}
            >
              <h3>{title}</h3>
              {expandedVideo === id && (
                <div className="expanded-video-container">
                  {videoSrc.endsWith(".mp4") ? (
                    <video
                      src={videoSrc}
                      className="expanded-video"
                      autoPlay
                      loop
                      muted
                    />
                  ) : (
                    <img src={videoSrc} alt={title} className="expanded-video" />
                  )}
                  <button
                    className="close-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick(id);
                    }}
                  >
                    &times;
                  </button>
                </div>
              )}
              {expandedVideo !== id && (
                <>
                  {videoSrc.endsWith(".mp4") ? (
                    <video src={videoSrc} width="250" />
                  ) : (
                    <img src={videoSrc} alt={title} width="250" />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        {[
          {
            id: "mobile-app",
            question: "Will there be a mobile app?",
            answer: "Currently, it's a web-based platform, but a mobile app is in our future plans!",
          },
          {
            id: "hidden-fees",
            question: "Are there any hidden fees?",
            answer: "No! AUBConnect is 100% free for students",
          },
          {
            id: "who-can-use",
            question: "Who can use this website?",
            answer: "Only AUB students! No professors or outsiders can access AUBConnect",
          },
          {
            id: "problem-solved",
            question: "What problem does this website solve?",
            answer: "It helps students make informed course choices before registration by providing real-life reviews, ensuring a smoother university experience",
          },
          {
            id: "create-account",
            question: "Do I need to create an account?",
            answer: "Yes, you must sign up to write and view reviews",
          },
        ].map(({ id, question, answer }) => (
          <div
            className={`faq-item ${expandedFAQ === id ? "expanded" : ""}`}
            key={id}
            onClick={() => handleFAQClick(id)}
          >
            <h3>{question}</h3>
            {expandedFAQ === id && <p>{answer}</p>}
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="cta" ref={ctaRef}>
        {showSignUp ? (
          <>
            <h2>Start your university journey with confidence. Sign up today and take the first step toward success</h2>
            <button className="cta-button" onClick={handleSignUpClick}>
              Sign Up
            </button>
            <p 
              onClick={toggleSection} 
              style={{ cursor: "pointer", color: "#970339", textDecoration: "underline" }}
            >
              Already have an account?
            </p>
          </>
        ) : (
          <>
            <h2>Welcome back! Your insights and experiences help shape the AUBConnect community</h2>
            <button className="cta-button" onClick={handleSignInClick}>
              Sign In
            </button>
            <p 
              onClick={toggleSection} 
              style={{ cursor: "pointer", color: "#970339", textDecoration: "underline" }}
            >
              Don't have an account yet?
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default LandingPage;