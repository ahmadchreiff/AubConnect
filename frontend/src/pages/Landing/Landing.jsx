import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

// Correct the import paths based on your folder structure
import openingImage from "./images/openingImgae.jpeg";
import searchByCourse from "./images/course.mp4";
import postReview from "./images/posting.mp4";
import filterVotes from "./images/filter.mp4";
import professor from "./images/professor.mp4";
import searchByDepartment from "./images/searchByDepartment.mp4";
import trend from "./images/trend.mp4";

const LandingPage = () => {
  const navigate = useNavigate();
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  
  // Handle navigation
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-[Poppins]">
      {/* Fixed Floating Auth Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          className="bg-[#860033] hover:bg-[#6a0026] text-white p-4 rounded-full shadow-lg transition-all"
          onClick={handleSignInClick}
        >
          <i className="bx bx-log-in text-xl"></i>
        </button>
      </div>

      {/* Navigation Header */}
      <nav className="w-full bg-white shadow-md py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#860033] flex items-center cursor-pointer" onClick={scrollToTop}>
            <i className="bx bx-book-open text-3xl mr-2"></i>
            AUBConnect
          </h1>
          <div className="hidden md:flex space-x-3">
            <button 
              className="px-5 py-2 border-2 border-[#860033] text-[#860033] hover:bg-[#860033] hover:text-white rounded-lg transition-colors font-medium"
              onClick={handleSignInClick}
            >
              <i className="bx bx-log-in mr-1"></i> Log In
            </button>
            <button 
              className="bg-[#860033] hover:bg-[#6a0026] text-white px-5 py-2 rounded-lg transition-colors font-medium" 
              onClick={handleSignUpClick}
            >
              <i className="bx bx-user-plus mr-1"></i> Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 flex-grow">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${openingImage})`, opacity: "0.1" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col items-center text-center w-full">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#860033] mb-4">
              Welcome to AUBConnect
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Your ultimate resource for course and professor reviews at <span className="font-bold">American University of Beirut</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button 
              className="bg-[#860033] hover:bg-[#6a0026] text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md flex items-center justify-center"
              onClick={handleSignUpClick}
            >
              <i className="bx bx-user-plus mr-2 text-xl"></i>
              Create Free Account
            </button>
            <button 
              className="bg-white hover:bg-gray-100 text-[#860033] border border-[#860033] px-6 py-3 rounded-lg transition-colors font-medium shadow-md flex items-center justify-center" 
              onClick={handleSignInClick}
            >
              <i className="bx bx-log-in mr-2 text-xl"></i>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose AUBConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FFEBB7] rounded-full flex items-center justify-center">
                <i className="bx bx-search text-3xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Find Courses Easily</h3>
              <p className="text-gray-600">Search by department, professor, or course code to find the perfect match for your academic needs.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#E0C6F5] rounded-full flex items-center justify-center">
                <i className="bx bx-star text-3xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Real Student Reviews</h3>
              <p className="text-gray-600">Read and contribute honest, anonymous reviews from actual AUB students.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#A8DAFF] rounded-full flex items-center justify-center">
                <i className="bx bx-like text-3xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Make Better Choices</h3>
              <p className="text-gray-600">Use our platform to make informed decisions about your academic journey at AUB.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Video Demo Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">See It in Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "search-course", title: "Search Courses", desc: "Find the right courses for your needs", videoSrc: searchByCourse, icon: "bx-search" },
              { id: "post-review", title: "Post Reviews", desc: "Share your experiences with other students", videoSrc: postReview, icon: "bx-edit" },
              { id: "filter-vote-reviews", title: "Filter Results", desc: "Find the most helpful reviews", videoSrc: filterVotes, icon: "bx-filter" },
            ].map(({ id, title, desc, videoSrc, icon }) => (
              <div key={id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => handleVideoClick(id)}>
                <div className="flex items-center mb-3">
                  <i className={`bx ${icon} text-2xl text-[#860033] mr-2`}></i>
                  <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{desc}</p>
                <div className="rounded-lg overflow-hidden">
                  <video src={videoSrc} width="100%" className="rounded" controls={false}/>
                </div>
                {expandedVideo === id && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-[80vh] bg-black rounded-lg">
                      <video src={videoSrc} className="max-w-full max-h-[80vh] rounded-lg" autoPlay loop muted controls />
                      <button 
                        className="absolute -top-3 -right-3 bg-white text-[#860033] rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                        onClick={(e) => { e.stopPropagation(); handleVideoClick(id); }}
                      >
                        <i className="bx bx-x text-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                id: "mobile-app",
                question: "Will there be a mobile app?",
                answer: "Currently, it's a web-based platform, but a mobile app is in our future plans!"
              },
              {
                id: "hidden-fees",
                question: "Are there any hidden fees?",
                answer: "No! AUBConnect is 100% free for students."
              },
              {
                id: "who-can-use",
                question: "Who can use this website?",
                answer: "Only AUB students! No professors or outsiders can access AUBConnect."
              },
              {
                id: "problem-solved",
                question: "What problem does this website solve?",
                answer: "It helps students make informed course choices before registration by providing real-life reviews, ensuring a smoother university experience."
              },
              {
                id: "create-account",
                question: "Do I need to create an account?",
                answer: "Yes, you must sign up to write and view reviews."
              }
            ].map(({ id, question, answer }) => (
              <div
                key={id}
                className={`bg-gray-50 rounded-xl overflow-hidden transition-all duration-200 ${expandedFAQ === id ? "shadow-md" : "shadow-sm"}`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => handleFAQClick(id)}
                >
                  <span className="font-semibold text-gray-800 flex items-center">
                    <i className="bx bx-question-mark text-[#860033] mr-2"></i>
                    {question}
                  </span>
                  <i className={`bx ${expandedFAQ === id ? "bx-chevron-up" : "bx-chevron-down"} text-xl text-gray-500`}></i>
                </button>
                <div 
                  className={`px-6 pb-4 ${expandedFAQ === id ? "block" : "hidden"}`}
                >
                  <p className="text-gray-600">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start">
                <i className="bx bx-book-open text-2xl mr-2"></i>
                AUBConnect
              </h3>
              <p className="text-sm text-gray-300">For AUB students, by AUB students</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-white text-[#860033] hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors" onClick={handleSignInClick}>
                <i className="bx bx-log-in mr-1"></i> Log In
              </button>
              <button className="px-4 py-2 bg-[#860033] hover:bg-[#6a0026] text-white rounded-lg font-medium text-sm transition-colors" onClick={handleSignUpClick}>
                <i className="bx bx-user-plus mr-1"></i> Sign Up
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center">
            <p className="text-sm text-gray-400">&copy; 2025 AUBConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;