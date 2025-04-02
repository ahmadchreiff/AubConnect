import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './pages/Components/Navbar';
import Footer from './pages/Components/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/login';
import Signup from './pages/Signup/signup';
import ProfessorsPage from './pages/Professors/ProfessorsPage';
import ProfessorDetail from './pages/Professors/ProfessorDetail';
import CoursesPage from './pages/Courses/CoursesPage';
import CourseDetail from './pages/Courses/CourseDetail';
import DepartmentsPage from './pages/Departments/DepartmentsPage';
import DepartmentDetail from './pages/Departments/DepartmentDetail';
import SearchResults from './pages/Search/SearchResults';
import UserProfile from './pages/Profile/UserProfile';
import MyReviews from './pages/Reviews/MyReviews';
import Reviews from './pages/Reviews/Reviews';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute'; // Import the new component
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import ReviewManagement from './pages/Admin/ReviewManagement';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import './App.css';
import LandingPage from './pages/Landing/Landing';
import StatPage from './pages/stats/stat';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App flex flex-col min-h-screen">
          {/* <Navbar /> */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route element={<UserRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/homepage" element={<Home />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/my-reviews" element={<MyReviews />} />
              </Route>

              {/* User Routes - Accessible to non-admin users */}
              <Route element={<UserRoute />}>
                <Route path="/professors" element={<ProfessorsPage />} />
                <Route path="/professors/:id" element={<ProfessorDetail />} />
                <Route path="/professors/:id/stat" element={<StatPage type="professor" />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/courses/:id/stat" element={<StatPage type="course" />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/departments/:id" element={<DepartmentDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/reviews" element={<Reviews />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/reviews" element={<ReviewManagement />} />

              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;