import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing/Landing';  // Import Landing component
import Homepage from './pages/Homepage/Homepage';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import AboutUs from './pages/AboutUs/AboutUs';
import ReviewList from './pages/ReviewList/ReviewList';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route (Landing page) */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/reviews" element={<ReviewList />} />
      </Routes>
    </Router>
  );
};

export default App;
