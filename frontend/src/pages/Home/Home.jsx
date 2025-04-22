import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "boxicons/css/boxicons.min.css";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://aubconnectbackend-h22c.onrender.com/api/search/suggestions?query=${encodeURIComponent(searchQuery)}`
        );
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Use debounce to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'course') {
      navigate(`/courses/${suggestion.id}`);
    } else if (suggestion.type === 'department') {
      navigate(`/departments/${suggestion.id}`);
    } else if (suggestion.type === 'professor') {
      navigate(`/professors/${suggestion.id}`);
    }
    setShowSuggestions(false);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 flex-grow flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/api/placeholder/1600/900')", opacity: "0.1" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col items-center text-center w-full">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#860033] mb-4">
              Welcome Back
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Find courses and professors at <span className="font-bold">American University of Beirut</span>
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-2xl mx-auto relative mb-12">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="bx bx-search text-gray-400 text-xl"></i>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for a course or professor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                className="w-full pl-12 pr-4 py-5 bg-white border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent text-lg"
              />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
              >
                {/* The suggestions content remains the same */}
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">Loading suggestions...</div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((suggestion) => (
                      <li
                        key={`${suggestion.type}-${suggestion.id}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-[#860033]">{suggestion.text}</span>
                        <span className="text-sm text-gray-600">{suggestion.subtext}</span>
                      </li>
                    ))}
                  </ul>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-3 text-center text-gray-500">No matches found</div>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/departments" className="text-[#860033] hover:bg-[#860033]/10 px-5 py-3 rounded-lg transition-colors text-lg font-medium flex items-center">
              <i className="bx bx-building-house mr-2"></i> Browse Departments
            </Link>
            <Link to="/professors" className="text-[#860033] hover:bg-[#860033]/10 px-5 py-3 rounded-lg transition-colors text-lg font-medium flex items-center">
              <i className="bx bx-user mr-2"></i> Browse Professors
            </Link>
            <Link to="/my-reviews" className="text-[#860033] hover:bg-[#860033]/10 px-5 py-3 rounded-lg transition-colors text-lg font-medium flex items-center">
              <i className="bx bx-star mr-2"></i> My Reviews
            </Link>
          </div>
        </div>
      </section>
      {/* Feature Highlights - Simplified */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FFEBB7] rounded-full flex items-center justify-center">
                <i className="bx bx-edit text-3xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Anonymous Feedback</h3>
              <p className="text-gray-600">Share your honest opinions about courses and professors without revealing your identity.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#E0C6F5] rounded-full flex items-center justify-center">
                <i className="bx bx-user-voice text-3xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Find Your Courses</h3>
              <p className="text-gray-600">Easily search and discover the best courses based on fellow students' experiences.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#A8DAFF] rounded-full flex items-center justify-center">
                <i className="bx bx-like text-3xl text-[#860033]"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Community Ratings</h3>
              <p className="text-gray-600">Upvote helpful reviews and see what other AUB students think about courses.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
