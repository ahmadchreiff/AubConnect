import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import ReviewList from "./pages/ReviewList/ReviewList";
import PastReviewsPage from "./pages/ReviewPage/PastReviewsPage";

// No need to import App.css as we'll be using Tailwind utility classes

const App = () => {
  return (
    <Router>
      <div className="max-w-7xl mx-auto p-8 text-center">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/past-reviews" element={<PastReviewsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;