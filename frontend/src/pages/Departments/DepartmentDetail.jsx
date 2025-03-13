import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const DepartmentDetail = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch department and courses
  useEffect(() => {
    const fetchDepartmentAndCourses = async () => {
      try {
        // Fetch department details
        const departmentResponse = await fetch(`http://localhost:5001/api/departments/${id}`);
        
        if (!departmentResponse.ok) {
          throw new Error("Failed to fetch department details");
        }
        
        const departmentData = await departmentResponse.json();
        setDepartment(departmentData);

        // Fetch courses for this department
        const coursesResponse = await fetch(`http://localhost:5001/api/departments/${id}/courses`);
        
        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch department courses");
        }
        
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDepartmentAndCourses();
  }, [id]);
  
  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group courses by level (e.g., 100-level, 200-level)
  const groupedByLevel = filteredCourses.reduce((groups, course) => {
    // Extract the first digit from the course number (e.g., "200" -> "2")
    const match = course.courseNumber.match(/\d+/);
    if (!match) return groups;
    
    const firstDigit = match[0].charAt(0);
    const levelName = `${firstDigit}00-level Courses`;
    
    if (!groups[levelName]) {
      groups[levelName] = [];
    }
    groups[levelName].push(course);
    return groups;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 mr-2">
                  <svg viewBox="0 0 100 100" className="h-full w-full fill-current text-[#860033]">
                    <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                  </svg>
                </div>
                <span className="font-serif text-xl tracking-tight text-[#860033]">AubConnect</span>
              </Link>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Link to="/departments" className="text-[#860033] hover:text-[#6a0026] px-3 py-2 text-sm font-medium">
                Departments
              </Link>
              <Link to="/courses" className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium">
                Courses
              </Link>
              <Link to="/professors" className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium">
                Professors
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-[#860033] ml-3 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg">
                Log In
              </Link>
              <Link to="/signup" className="bg-[#860033] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#6a0026] transition-all duration-200">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex text-sm">
              <li className="flex items-center">
                <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
              </li>
              <li className="flex items-center">
                <Link to="/departments" className="text-gray-500 hover:text-gray-700">Departments</Link>
                <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
              </li>
              <li className="text-gray-900 font-medium">
                {loading ? "Loading..." : department?.code}
              </li>
            </ol>
          </nav>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#860033]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : department ? (
            <>
              {/* Department Header */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-[#860033]">{department.code}</h1>
                    <h2 className="text-xl text-gray-700 mb-2">{department.name}</h2>
                    <p className="text-gray-600">Faculty of {department.faculty}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#860033] bg-opacity-10 text-[#860033]">
                      {courses.length} Courses
                    </span>
                  </div>
                </div>
                {department.description && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-2">About This Department</h3>
                    <p className="text-gray-700">{department.description}</p>
                  </div>
                )}
              </div>

              {/* Search Box */}
              <div className="mb-8">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bx bx-search text-gray-400 text-xl"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Course List */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-lg text-gray-600">No courses found</p>
                </div>
              ) : (
                Object.entries(groupedByLevel)
                  .sort(([a], [b]) => a.localeCompare(b)) // Sort by level name
                  .map(([levelName, levelCourses]) => (
                    <div key={levelName} className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                        {levelName}
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {levelCourses
                          .sort((a, b) => 
                            a.courseNumber.localeCompare(b.courseNumber, undefined, { numeric: true })
                          )
                          .map((course) => (
                            <Link
                              key={course._id}
                              to={`/courses/${course._id}`}
                              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="text-lg font-bold text-[#860033]">
                                      {department.code} {course.courseNumber}
                                    </h3>
                                    <span className="ml-4 text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                      {course.creditHours} {course.creditHours === 1 ? "credit" : "credits"}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 mt-1">{course.name}</p>
                                  {course.description && (
                                    <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                                      {course.description}
                                    </p>
                                  )}
                                </div>
                                <div className="mt-4 md:mt-0 text-[#860033]">
                                  <i className="bx bx-chevron-right text-2xl"></i>
                                </div>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))
              )}
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-lg text-gray-600">Department not found</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-[#860033]">
              <div className="h-8 w-8">
                <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                  <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                </svg>
              </div>
              <span className="font-serif text-lg">AubConnect</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>
            </div>
            
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} American University of Beirut
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DepartmentDetail;