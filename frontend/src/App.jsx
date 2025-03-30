import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/Home/Home";
import Signup from "./pages/Signup/signup";
import Login from "./pages/Login/login";
import ReviewList from "./pages/Reviews/Reviews";
import DepartmentsPage from "./pages/Departments/DepartmentsPage";
import DepartmentDetail from "./pages/Departments/DepartmentDetail";
import CoursesPage from "./pages/Courses/CoursesPage";
import CourseDetail from "./pages/Courses/CourseDetail";
import ProfessorsPage from "./pages/Professors/ProfessorsPage";
import ProfessorDetail from "./pages/Professors/ProfessorDetail";
import UserProfile from "./pages/Profile/UserProfile";
import MyReviews from "./pages/Reviews/MyReviews";
import SearchResults from './pages/Search/SearchResults';
import LandingPage from './pages/Landing/Landing';
import StatPage from './pages/stats/statistics';
import AboutUs from './pages/AboutUs/AboutUs'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="max-w-7xl mx-auto">
          <Routes>
            {/* Public routes */}
            <Route path="/" element ={<LandingPage/>}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/homepage" element={<Homepage />} />          
              <Route path="/reviews" element={<ReviewList />} />          
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:id" element={<DepartmentDetail />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/professors" element={<ProfessorsPage />} />
              <Route path="/professors/:id" element={<ProfessorDetail />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/my-reviews" element={<MyReviews />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/Statistics" element={<StatPage />} />
              <Route path="/about" element={<AboutUs />} />
              
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;    