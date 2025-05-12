import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserDropdown from "../../components/UserDropdown";
import "boxicons/css/boxicons.min.css";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/homepage' && (location.pathname === '/homepage' || location.pathname === '/')) {
      return true;
    }
    if (path !== '/homepage' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with adjusted spacing */}
          <div className="flex items-center flex-shrink-0 mr-4 md:mr-0">
            <Link to="/homepage" className="flex items-center">
              <div className="flex flex-col items-start">
                <span className="font-sans text-2xl font-bold tracking-tight text-[#860033]">AUBConnect</span>
                <span className="text-xs tracking-[0.25em] text-black font-normal self-center">reviews</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation with adjusted spacing */}
          <div className="hidden lg:flex items-center justify-end flex-1">
            <nav className="flex items-center space-x-6 mr-8">
              <Link
                to="/homepage"
                className={`${isActive('/homepage') ? 'text-[#860033] font-medium' : 'text-gray-600 hover:text-[#860033]'} text-sm transition-colors`}
              >
                <i className='bx bx-home-alt mr-1'></i> Home
              </Link>
              <Link
                to="/departments"
                className={`${isActive('/departments') ? 'text-[#860033] font-medium' : 'text-gray-600 hover:text-[#860033]'} text-sm transition-colors`}
              >
                Departments
              </Link>
              <Link
                to="/courses"
                className={`${isActive('/courses') ? 'text-[#860033] font-medium' : 'text-gray-600 hover:text-[#860033]'} text-sm transition-colors`}
              >
                Courses
              </Link>
              <Link
                to="/professors"
                className={`${isActive('/professors') ? 'text-[#860033] font-medium' : 'text-gray-600 hover:text-[#860033]'} text-sm transition-colors`}
              >
                Professors
              </Link>
              <Link
                to="/reviews"
                className={`${isActive('/reviews') ? 'text-[#860033] font-medium' : 'text-gray-600 hover:text-[#860033]'} text-sm transition-colors`}
              >
                Reviews
              </Link>
            </nav>
            {isAuthenticated() && <UserDropdown />}
          </div>

          {/* Mobile menu button - visible on iPad and smaller screens */}
          <div className="lg:hidden">
            {isAuthenticated() ? (
              <div className="flex items-center -space-x-1">
                <UserDropdown mobile={true} />
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-[#860033] focus:outline-none"
                >
                  <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl`}></i>
                </button>
              </div>
            ) : (
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-[#860033] focus:outline-none"
              >
                <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl`}></i>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation - visible on iPad and smaller screens */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 pb-4 space-y-2">
            <Link
              to="/homepage"
              onClick={() => setIsMenuOpen(false)}
              className={`${isActive('/homepage') ? 'text-[#860033] bg-gray-50' : 'text-gray-600 hover:text-[#860033]'} block px-4 py-3 rounded transition-colors`}
            >
              <i className='bx bx-home-alt mr-1'></i> Home
            </Link>
            <Link
              to="/departments"
              onClick={() => setIsMenuOpen(false)}
              className={`${isActive('/departments') ? 'text-[#860033] bg-gray-50' : 'text-gray-600 hover:text-[#860033]'} block px-4 py-3 rounded transition-colors`}
            >
              Departments
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMenuOpen(false)}
              className={`${isActive('/courses') ? 'text-[#860033] bg-gray-50' : 'text-gray-600 hover:text-[#860033]'} block px-4 py-3 rounded transition-colors`}
            >
              Courses
            </Link>
            <Link
              to="/professors"
              onClick={() => setIsMenuOpen(false)}
              className={`${isActive('/professors') ? 'text-[#860033] bg-gray-50' : 'text-gray-600 hover:text-[#860033]'} block px-4 py-3 rounded transition-colors`}
            >
              Professors
            </Link>
            <Link
              to="/reviews"
              onClick={() => setIsMenuOpen(false)}
              className={`${isActive('/reviews') ? 'text-[#860033] bg-gray-50' : 'text-gray-600 hover:text-[#860033]'} block px-4 py-3 rounded transition-colors`}
            >
              Reviews
            </Link>
            {!isAuthenticated() && (
              <div className="pt-2 space-y-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-600 hover:text-[#860033] px-4 py-3 border border-gray-200 rounded text-center transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-[#860033] hover:bg-[#6a0026] text-white px-4 py-3 rounded shadow-sm text-center transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;