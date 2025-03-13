import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "boxicons/css/boxicons.min.css";

const Navbar = () => {
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Set the logged-in username
    const username = getUsernameFromToken();
    if (username) {
      setLoggedInUsername(username);
    }
  }, []);

  // Function to get the username from the JWT token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded.username;
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  };

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUsername("");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 mr-2">
                <svg viewBox="0 0 100 100" className="h-full w-full fill-current text-[#860033]">
                  <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                </svg>
              </div>
              <span className="font-serif text-xl tracking-tight text-[#860033]">AubConnect</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <Link 
              to="/departments" 
              className={`${isActive('/departments') ? 'text-[#860033]' : 'text-gray-700 hover:text-[#860033]'} px-3 py-2 text-sm font-medium`}
            >
              Departments
            </Link>
            <Link 
              to="/courses" 
              className={`${isActive('/courses') ? 'text-[#860033]' : 'text-gray-700 hover:text-[#860033]'} px-3 py-2 text-sm font-medium`}
            >
              Courses
            </Link>
            <Link 
              to="/professors" 
              className={`${isActive('/professors') ? 'text-[#860033]' : 'text-gray-700 hover:text-[#860033]'} px-3 py-2 text-sm font-medium`}
            >
              Professors
            </Link>
            <Link 
              to="/reviews" 
              className={`${isActive('/reviews') ? 'text-[#860033]' : 'text-gray-700 hover:text-[#860033]'} px-3 py-2 text-sm font-medium`}
            >
              Reviews
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about') ? 'text-[#860033]' : 'text-gray-700 hover:text-[#860033]'} px-3 py-2 text-sm font-medium`}
            >
              About
            </Link>
            
            {loggedInUsername ? (
              <div className="flex items-center gap-3 ml-3">
                <span className="text-gray-700 text-sm">
                  Hi, {loggedInUsername}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-[#860033] ml-3 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg">
                  Log In
                </Link>
                <Link to="/signup" className="bg-[#860033] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#6a0026] transition-all duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;