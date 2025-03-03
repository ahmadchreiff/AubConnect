import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import AboutUs from "./pages/AboutUs/AboutUs";
import ReviewPage from "./pages/ReviewPage/ReviewPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/reviews" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;