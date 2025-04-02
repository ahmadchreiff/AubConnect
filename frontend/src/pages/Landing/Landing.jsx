import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Import images and videos from the local folder
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
    <div className="font-[Poppins] max-w-full overflow-hidden">
      {/* Logo Header - Simplified */}
      <div className="w-full bg-white shadow-sm py-6">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold text-[#860033] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            AUBConnect
          </h1>
          <div className="hidden md:flex space-x-4">
            <button className="text-[#860033] hover:text-[#6a0026] font-semibold"
                    onClick={scrollToCTA}>
              Log In
            </button>
            <button className="bg-[#860033] hover:bg-[#6a0026] text-white font-semibold px-4 py-2 rounded-md transition-colors"
                    onClick={scrollToCTA}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section - Marketing Focused */}
      <div className="relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${openingImage})`, opacity: 0.2 }}></div>
        <div className="relative flex flex-col px-8 py-24 bg-white bg-opacity-70">
          <div className="max-w-4xl mx-auto text-center z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-[#860033]">AUBConnect</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold mb-4">Your Ultimate Resource for Course and Professor Reviews at AUB</p>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Explore real student experiences, honest feedback, and helpful insights to choose the right courses and professors for you.
            </p>
            <button 
              className="bg-[#860033] hover:bg-[#6a0026] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg text-lg transform hover:scale-105"
              onClick={scrollToCTA}
            >
              Join Now – It's Free!
            </button>
          </div>
        </div>
      </div>

      {/* Student Review Section */}
      <div className="bg-gradient-to-r from-[#860033] to-[#6a0026] py-20 px-8 relative overflow-hidden">
        <div className="absolute w-40 h-40 rounded-full bg-opacity-10 bg-white top-0 right-0 -mt-20 -mr-20"></div>
        <div className="absolute w-32 h-32 rounded-bl-3xl rounded-tr-3xl bg-opacity-10 bg-white bottom-0 left-0 -mb-16 -ml-16"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOSAwIDIuMjUgMS4wMjUgMi4yNSAyLjI1IDAgMS4yMjktMS4wMjUgMi4yNS0yLjI1IDIuMjUtMS4yMjkgMC0yLjI1LTEuMDI1LTIuMjUtMi4yNSAwLTEuMjI5IDEuMDI1LTIuMjUgMi4yNS0yLjI1em0tMTIgMGMxLjIyOSAwIDIuMjUgMS4wMjUgMi4yNSAyLjI1IDAgMS4yMjktMS4wMjUgMi4yNS0yLjI1IDIuMjUtMS4yMjkgMC0yLjI1LTEuMDI1LTIuMjUtMi4yNSAwLTEuMjI5IDEuMDI1LTIuMjUgMi4yNS0yLjI1eiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 text-white z-10 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-6">Real Insights from AUB Students</h2>
            <p className="text-xl mb-8 leading-relaxed">Make informed decisions about courses and professors. Read authentic student reviews and choose wisely.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-medium text-lg text-white">100+ student reviews available</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-medium text-lg text-white">Anonymous and unbiased feedback</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/5 bg-white p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 z-10">
            <div className="flex mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="relative">
              <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-6 h-12 w-12 text-[#860033]/20" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-xl italic leading-relaxed mb-6 mt-2">"One of the best professors I've had! His lectures are engaging, and the assignments truly help reinforce the material. I would highly recommend this course to all students."</p>
            </div>
            <div className="flex items-center mt-8">
              <div className="w-12 h-12 rounded-full bg-[#860033]/10 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-800">Student from CMPS 201</p>
                <p className="text-sm text-gray-500">April 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Box Feature */}
      <div className="py-20 px-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOSAwIDIuMjUgMS4wMjUgMi4yNSAyLjI1IDAgMS4yMjktMS4wMjUgMi4yNS0yLjI1IDIuMjUtMS4yMjkgMC0yLjI1LTEuMDI1LTIuMjUtMi4yNSAwLTEuMjI5IDEuMDI1LTIuMjUgMi4yNS0yLjI1em0tMTIgMGMxLjIyOSAwIDIuMjUgMS4wMjUgMi4yNSAyLjI1IDAgMS4yMjktMS4wMjUgMi4yNS0yLjI1IDIuMjUtMS4yMjkgMC0yLjI1LTEuMDI1LTIuMjUtMi4yNSAwLTEuMjI5IDEuMDI1LTIuMjUgMi4yNS0yLjI1eiIvPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6">Find Your Perfect Course Match</h2>
            <p className="text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
              Our powerful search helps you find courses and professors that match your learning style and academic goals.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl inline-block w-full max-w-2xl mx-auto border border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for a course or professor"
                className="w-full pl-14 pr-32 py-5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent text-lg"
                disabled
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#860033] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6a0026] transition-all"
                onClick={scrollToCTA}
              >
                Sign Up to Search
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">Create a free account to access all search features</p>
          </div>

          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Popular Trending Courses</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {['CMPS 200', 'ENGL 203', 'PHYS 210', 'MATH 201', 'BUSS 215'].map((course, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 border border-gray-100"
                  onClick={scrollToCTA}
                >
                  <span className="font-medium text-lg text-[#860033]">{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 px-8 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose AUBConnect?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FFEBB7] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#860033] mb-2">Search by Department</h3>
            <p>Find courses within your department, so you don't end up in the wrong class</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#E0C6F5] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#860033] mb-2">Trending Courses</h3>
            <p>See what's popular among students and what courses are in demand</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#A8DAFF] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#860033] mb-2">Star Rating System</h3>
            <p>Courses and professors are rated based on student experiences</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FFEBB7] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#860033] mb-2">Upvote & Downvote Reviews</h3>
            <p>Sort reviews based on their usefulness, so you always get the best insights</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#E0C6F5] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#860033] mb-2">Filter & Search Reviews</h3>
            <p>Find reviews based on rating, most useful, or newest posts</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#A8DAFF] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#860033] mb-2">Check & Edit Your Reviews</h3>
            <p>Keep track of your past reviews and edit them whenever needed</p>
          </div>
        </div>
      </div>

      {/* Services Section with Icons instead of Images */}
      <div className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Benefits for AUB Students</h2>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 w-full md:w-1/3 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#FFEBB7] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Anonymous Reviews</h3>
              <p className="text-gray-600">Share and read reviews anonymously to ensure honest feedback.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 w-full md:w-1/3 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#E0C6F5] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Honest Feedback</h3>
              <p className="text-gray-600">Our platform promotes genuine reviews for a transparent experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 w-full md:w-1/3 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#A8DAFF] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AUB Community</h3>
              <p className="text-gray-600">Join a community of students helping each other make informed decisions.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Demo Section */}
      <div className="py-16 px-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">See It in Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { id: "search-course", title: "Searching by Course", videoSrc: searchByCourse },
            { id: "post-review", title: "Posting a Review", videoSrc: postReview },
            { id: "filter-vote-reviews", title: "Filtering & Voting Reviews", videoSrc: filterVotes },
          ].map(({ id, title, videoSrc }) => (
            <div
              key={id}
              className="bg-gray-50 p-4 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleVideoClick(id)}
            >
              <h3 className="text-lg font-semibold mb-2 hover:scale-105 hover:text-[#860033] transition-all">{title}</h3>
              {expandedVideo !== id && (
                <video src={videoSrc} width="250" className="mx-auto rounded" />
              )}
              {expandedVideo === id && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                  <div className="relative max-w-4xl max-h-[80vh] bg-black p-2 rounded-lg">
                    <video
                      src={videoSrc}
                      className="max-w-full max-h-[80vh] rounded-lg"
                      autoPlay
                      loop
                      muted
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-white border-2 border-[#a0073f] rounded-full w-8 h-8 flex items-center justify-center text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoClick(id);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button 
            className="text-[#860033] font-medium border border-[#860033] rounded-full px-6 py-2 hover:bg-[#860033] hover:text-white transition-colors"
            onClick={scrollToCTA}
          >
            Sign up to see more
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
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
              key={id}
              className={`bg-white p-4 rounded-lg shadow-md cursor-pointer ${expandedFAQ === id ? "bg-gray-100" : ""}`}
              onClick={() => handleFAQClick(id)}
            >
              <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
              {expandedFAQ === id && <p className="mt-2 text-gray-600">{answer}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div ref={ctaRef} className="py-16 px-8 bg-[#860033] text-white text-center">
        {showSignUp ? (
          <>
            <h2 className="text-2xl font-normal mb-6 max-w-3xl mx-auto">
              Start your university journey with confidence. Sign up today and take the first step toward success
            </h2>
            <button
              className="bg-white text-[#860033] hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-lg"
              onClick={handleSignUpClick}
            >
              Sign Up – It's Free!
            </button>
            <p
              className="mt-4 text-white underline cursor-pointer"
              onClick={toggleSection}
            >
              Already have an account?
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-normal mb-6 max-w-3xl mx-auto">
              Welcome back! Your insights and experiences help shape the AUBConnect community
            </h2>
            <button
              className="bg-white text-[#860033] hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-lg"
              onClick={handleSignInClick}
            >
              Sign In
            </button>
            <p
              className="mt-4 text-white underline cursor-pointer"
              onClick={toggleSection}
            >
              Don't have an account yet?
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#860033] text-white py-8 px-8">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">AUBConnect</h3>
          <p className="text-sm mb-4">Your go-to platform for honest course and professor reviews.</p>
          <p className="text-xs">For AUB students only. All reviews are anonymous.</p>
          <p className="text-center text-sm text-gray-300 mt-4">&copy; 2025 AUBConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;