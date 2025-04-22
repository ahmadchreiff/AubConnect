import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "boxicons/css/boxicons.min.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  // Fetch courses and departments from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all courses
        const coursesResponse = await fetch("https://aubconnectbackend-h22c.onrender.com/api/courses");
        
        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses");
        }
        
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
        
        // Fetch all departments
        const departmentsResponse = await fetch("https://aubconnectbackend-h22c.onrender.com/api/departments");
        
        if (!departmentsResponse.ok) {
          throw new Error("Failed to fetch departments");
        }
        
        const departmentsData = await departmentsResponse.json();
        setDepartments(departmentsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on search query and selected filters
  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.trim().toLowerCase();
    
    // 1. First check for exact department+number match (e.g., "ECON 101")
    if (searchLower.includes(' ')) {
      const [deptPart, numberPart] = searchLower.split(' ');
      const matchesExact = 
        course.department.code.toLowerCase() === deptPart && 
        course.courseNumber.toLowerCase() === numberPart;
      if (matchesExact) return true;
    }
  
    // 2. Then check for partial matches in different fields
    const matchesPartial =
      course.name.toLowerCase().includes(searchLower) ||
      course.courseNumber.toLowerCase().includes(searchLower) ||
      course.department.code.toLowerCase().includes(searchLower) ||
      `${course.department.code.toLowerCase()} ${course.courseNumber.toLowerCase()}`.includes(searchLower);
  
    // 3. Apply filters
    const matchesDepartment = selectedDepartment === "" || course.department._id === selectedDepartment;
    const matchesLevel = selectedLevel === "" || course.courseNumber.startsWith(selectedLevel);
  
    return matchesPartial && matchesDepartment && matchesLevel;
  });

  // Get available course levels
  const courseLevels = ["1", "2", "3"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Unified Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#860033] mb-2">All Courses</h1>
            <p className="text-lg text-gray-600">
              Browse all courses at American University of Beirut
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search Box */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bx bx-search text-gray-400 text-xl"></i>
                  </div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search for courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Department Filter */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.code} - {department.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Course Level Filter */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Level
                </label>
                <select
                  id="level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  {courseLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}00 Level
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Courses List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#860033]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : (
            <div>
              {filteredCourses.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-lg text-gray-600">No courses found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCourses.map((course) => (
                        <tr key={course._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-[#860033]">
                            {course.department.code} {course.courseNumber}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{course.name}</div>
                            {course.description && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {course.description.substring(0, 100)}
                                {course.description.length > 100 ? "..." : ""}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link 
                              to={`/departments/${course.department._id}`}
                              className="hover:text-[#860033] hover:underline"
                            >
                              {course.department.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.creditHours}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/courses/${course._id}`}
                              className="text-[#860033] hover:text-[#6a0026]"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
};

export default CoursesPage;