// src/pages/Search/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const SearchResults = () => {
  const [results, setResults] = useState({ courses: [], departments: [], professors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get search query from URL parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        if (!query) {
          setResults({ courses: [], departments: [], professors: [] });
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`http://localhost:5001/api/search?query=${encodeURIComponent(query)}`);
        setResults(response.data.results);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div>
            {/* Courses Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Courses ({results.courses.length})</h2>
              
              {results.courses.length === 0 ? (
                <p className="text-gray-500">No courses found matching your search.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.courses.map(course => (
                    <Link 
                      key={course._id} 
                      to={`/courses/${course._id}`}
                      className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="font-bold text-[#6D0B24]">
                        {course.department ? `${course.department.code} ${course.courseNumber}` : course.courseNumber}
                      </div>
                      <div className="text-gray-900">{course.name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Professors Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Professors ({results.professors ? results.professors.length : 0})</h2>
              
              {!results.professors || results.professors.length === 0 ? (
                <p className="text-gray-500">No professors found matching your search.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.professors.map(professor => (
                    <Link 
                      key={professor._id} 
                      to={`/professors/${professor._id}`}
                      className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="font-bold text-[#6D0B24]">{professor.name}</div>
                      <div className="text-gray-900">{professor.title}</div>
                      {professor.departments && professor.departments.length > 0 && (
                        <div className="text-gray-500 text-sm mt-1">
                          {professor.departments.map(dept => dept.code).join(', ')}
                        </div>
                      )}
                      {professor.avgRating > 0 && (
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span>{professor.avgRating.toFixed(1)}</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Departments Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Departments ({results.departments.length})</h2>
              
              {results.departments.length === 0 ? (
                <p className="text-gray-500">No departments found matching your search.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.departments.map(department => (
                    <Link 
                      key={department._id} 
                      to={`/departments/${department._id}`}
                      className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="font-bold text-[#6D0B24]">{department.code}</div>
                      <div className="text-gray-900">{department.name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults;