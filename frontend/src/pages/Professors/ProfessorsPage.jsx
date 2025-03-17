import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const ProfessorsPage = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch professors
        const professorsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/professors`);
        setProfessors(professorsRes.data);
        
        // Fetch departments for filter
        const departmentsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/departments`);
        setDepartments(departmentsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load professors. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter professors based on search query and department
  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = searchQuery === '' || 
      professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (professor.title && professor.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = departmentFilter === '' || 
      (professor.departments && professor.departments.some(dept => 
        typeof dept === 'object' ? dept._id === departmentFilter : dept === departmentFilter
      ));
    
    return matchesSearch && matchesDepartment;
  });
  
  // Sort professors alphabetically by name
  const sortedProfessors = [...filteredProfessors].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white py-12 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Professors</h1>
          <p className="mt-2 text-lg opacity-90">
            Browse, rate, and read reviews about professors at AUB
          </p>
        </div>
      </div>
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Professors
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#860033] focus:border-[#860033]"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <select
                id="department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#860033] focus:border-[#860033]"
              >
                <option value="">All Departments</option>
                {departments.map(department => (
                  <option key={department._id} value={department._id}>
                    {department.code} - {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchQuery || departmentFilter) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Found {sortedProfessors.length} professor{sortedProfessors.length !== 1 ? 's' : ''}
              </p>
              
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDepartmentFilter('');
                }}
                className="text-sm text-[#860033] hover:text-[#6a0026] font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Professors List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : sortedProfessors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No professors found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || departmentFilter
                ? "Try adjusting your search or filter criteria."
                : "There are no professors available at this time."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProfessors.map(professor => (
              <Link
                key={professor._id}
                to={`/professors/${professor._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{professor.name}</h2>
                      <p className="text-sm text-gray-600">{professor.title}</p>
                      
                      {professor.departments && professor.departments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {professor.departments.map(dept => (
                            <span 
                              key={typeof dept === 'object' ? dept._id : dept}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                            >
                              {typeof dept === 'object' ? dept.code : dept}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {professor.avgRating > 0 && (
                      <div className={`flex items-center justify-center h-12 w-12 rounded-full ${
                        professor.avgRating >= 4 ? 'bg-green-100 text-green-700' :
                        professor.avgRating >= 3 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        <span className="font-bold text-lg">{professor.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  {professor.bio && (
                    <p className="mt-4 text-gray-600 line-clamp-3">{professor.bio}</p>
                  )}
                  
                  {professor.courses && professor.courses.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Teaches:</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {professor.courses.slice(0, 3).map(course => (
                          <span 
                            key={typeof course === 'object' ? course._id : course}
                            className="inline-block px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full"
                          >
                            {typeof course === 'object' 
                              ? `${course.courseNumber}` 
                              : course}
                          </span>
                        ))}
                        {professor.courses.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            +{professor.courses.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-[#860033]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    View Profile & Reviews
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfessorsPage;