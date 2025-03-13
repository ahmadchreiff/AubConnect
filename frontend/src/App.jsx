import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import ReviewList from "./pages/Reviews/Reviews";
import DepartmentsPage from "./pages/Departments/DepartmentsPage";
import DepartmentDetail from "./pages/Departments/DepartmentDetail";
import CoursesPage from "./pages/Courses/CoursesPage";
import CourseDetail from "./pages/Courses/CourseDetail";

const App = () => {
  return (
    <Router>
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reviews" element={<ReviewList />} />          
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;