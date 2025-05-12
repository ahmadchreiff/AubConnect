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
  const [expandedCourse, setExpandedCourse] = useState(null); // Track expanded course for mobile

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

  // Toggle course description expansion on mobile
  const toggleCourseExpansion = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

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
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  {/* Mobile & Tablet Portrait View - Cards */}
                  <div className="lg:hidden space-y-4">
                    {filteredCourses.map((course) => (
                      <div 
                        key={course._id} 
                        className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                      >
                        <div 
                          className="flex justify-between items-start cursor-pointer"
                          onClick={() => toggleCourseExpansion(course._id)}
                        >
                          <div className="flex-1">
                            <div className="flex items-start">
                              <h3 className="font-bold text-[#860033] text-lg mr-2">
                                {course.department.code} {course.courseNumber}
                              </h3>
                              <span className="bg-[#860033]/10 text-[#860033] text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 mt-0.5">
                                {course.creditHours} {course.creditHours === 1 ? 'credit' : 'credits'}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 mt-1">{course.name}</h4>
                          </div>
                          <button className="ml-2 text-gray-500 hover:text-[#860033]">
                            <i className={`bx bx-chevron-${expandedCourse === course._id ? 'up' : 'down'} text-xl`}></i>
                          </button>
                        </div>
                        
                        {/* Expanded content */}
                        {expandedCourse === course._id && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {course.description && (
                              <div className="mb-3">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {course.description}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full">
                                {course.department.code}
                              </span>
                              <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full">
                                {course.courseNumber[0]}00 Level
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <Link 
                                to={`/departments/${course.department._id}`}
                                className="text-sm text-gray-600 hover:text-[#860033] hover:underline flex items-center"
                              >
                                <i className="bx bx-building mr-1"></i> {course.department.name}
                              </Link>
                              <Link
                                to={`/courses/${course._id}`}
                                className="text-sm font-medium text-white bg-[#860033] hover:bg-[#6a0026] px-3 py-1.5 rounded-lg flex items-center transition-colors"
                              >
                                View Details <i className="bx bx-chevron-right ml-1"></i>
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {/* Collapsed footer (visible when not expanded) */}
                        {expandedCourse !== course._id && (
                          <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-100">
                            <Link 
                              to={`/departments/${course.department._id}`}
                              className="text-sm text-gray-600 hover:text-[#860033] hover:underline"
                            >
                              {course.department.name}
                            </Link>
                            <Link
                              to={`/courses/${course._id}`}
                              className="text-sm font-medium text-[#860033] hover:text-[#6a0026] flex items-center"
                            >
                              View <i className="bx bx-chevron-right ml-1"></i>
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tablet Landscape & Desktop View - Table */}
                  <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                              Department
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                              Credits
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
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
                                <div className="text-sm text-gray-900 font-medium">{course.name}</div>
                                {course.description && (
                                  <div className="text-xs text-gray-500 line-clamp-2 max-w-prose">
                                    {course.description}
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                <span className="font-medium">{course.creditHours}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  to={`/courses/${course._id}`}
                                  className="text-[#860033] hover:text-[#6a0026] flex items-center justify-end"
                                >
                                  View <i className="bx bx-chevron-right ml-1"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
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