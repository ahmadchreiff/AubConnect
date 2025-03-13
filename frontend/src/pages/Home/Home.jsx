import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "boxicons/css/boxicons.min.css";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample trending courses
  const trendingCourses = [
    { id: 1, name: "CMPS 200" },
    { id: 2, name: "ENGL 203" },
    { id: 3, name: "PHYS 210" },
    { id: 4, name: "MATH 201" },
    { id: 5, name: "BUSS 215" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Unified Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gray-50">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/api/placeholder/1600/900')", opacity: "0.1" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#860033] mb-4">
              RATE MY COURSES
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Find a course at <span className="font-bold">American University of Beirut</span>
            </p>
          </div>
          
          {/* Search Box */}
          <div className="w-full max-w-2xl mx-auto relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="bx bx-search text-gray-400 text-xl"></i>
            </div>
            <input
              type="text"
              placeholder="Search for a course or professor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent text-lg"
            />
            <Link to="/search" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#860033] text-white px-5 py-2 rounded-full font-medium hover:bg-[#6a0026] transition-all">
              Search
            </Link>
          </div>
          
          <p className="text-gray-500 mb-4">or</p>
          
          <Link to="/departments" className="text-[#860033] hover:underline text-lg font-medium">
            I want to find a course in a different department
          </Link>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Join the AubConnect Family</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#FFEBB7] rounded-full flex items-center justify-center">
                <i className="bx bx-edit text-4xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Manage and edit your ratings</h3>
              <p className="text-gray-600">Keep track of your reviews and make changes anytime you want.</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#E0C6F5] rounded-full flex items-center justify-center">
                <i className="bx bx-user-voice text-4xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Your ratings are always anonymous</h3>
              <p className="text-gray-600">Share your honest feedback without revealing your identity.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#A8DAFF] rounded-full flex items-center justify-center">
                <i className="bx bx-like text-4xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Like or dislike ratings</h3>
              <p className="text-gray-600">Interact with other reviews and highlight the most helpful ones.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/signup" className="inline-block bg-[#860033] text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-[#6a0026] transition-all">
              Sign up now!
            </Link>
          </div>
        </div>
      </section>
      
      {/* Trending Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Trending Courses</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trendingCourses.map((course) => (
              <Link 
                key={course.id} 
                to={`/courses/${course.id}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <span className="font-medium text-lg text-[#860033]">{course.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/courses" className="text-[#860033] hover:underline font-medium">
              View all courses <i className="bx bx-right-arrow-alt"></i>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Unified Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;