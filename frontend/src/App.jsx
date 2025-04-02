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
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App flex flex-col min-h-screen">
          {/* <Navbar /> */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Redirect "/homepage" to root path */}
              <Route path="/homepage" element={<Navigate to="/" replace />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/professors" element={<ProfessorsPage />} />
                <Route path="/professors/:id" element={<ProfessorDetail />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/departments/:id" element={<DepartmentDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/my-reviews" element={<MyReviews />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;