import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-1 text-[#860033]">
            <div className="h-8 w-8">
              <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
              </svg>
            </div>
            <span className="font-serif text-lg">AubConnect</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} American University of Beirut
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;