import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "boxicons/css/boxicons.min.css";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/departments");
        
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        
        const data = await response.json();
        setDepartments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group departments by faculty
  const groupedByFaculty = filteredDepartments.reduce((groups, department) => {
    const faculty = department.faculty;
    if (!groups[faculty]) {
      groups[faculty] = [];
    }
    groups[faculty].push(department);
    return groups;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      {/* Unified Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#860033] mb-2">Departments</h1>
            <p className="text-lg text-gray-600">
              Browse all academic departments at AUB
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-8">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bx bx-search text-gray-400 text-xl"></i>
              </div>
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-transparent"
              />
            </div>
          </div>

          {/* Departments List */}
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
              {Object.keys(groupedByFaculty).length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-lg text-gray-600">No departments found</p>
                </div>
              ) : (
                Object.entries(groupedByFaculty).map(([faculty, depts]) => (
                  <div key={faculty} className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                      {faculty}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {depts.map((department) => (
                        <Link
                          key={department._id}
                          to={`/departments/${department._id}`}
                          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-[#860033]">
                                {department.code}
                              </h3>
                              <p className="text-gray-700">{department.name}</p>
                            </div>
                            <div className="text-[#860033]">
                              <i className="bx bx-chevron-right text-2xl"></i>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
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

export default DepartmentsPage;