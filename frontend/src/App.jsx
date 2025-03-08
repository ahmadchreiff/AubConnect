import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import AboutUs from "./pages/AboutUs/AboutUs";
import ReviewList from "./pages/ReviewList/ReviewList";
import PastReviewsPage from "./pages/ReviewPage/PastReviewsPage"; // Import the PastReviewsPage component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route to Login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/past-reviews" element={<PastReviewsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
