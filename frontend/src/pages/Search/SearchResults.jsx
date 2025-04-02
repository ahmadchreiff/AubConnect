import React, { useState } from 'react';
import axios from 'axios';

const CourseSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState({ courses: [], departments: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
  
    try {
      setLoading(true);
      setError('');
      
      // Normalize the search input
      const normalizedInput = searchInput.trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .toUpperCase();
  
      const response = await axios.get(`/api/search?query=${encodeURIComponent(normalizedInput)}`);
      
      if (response.data.results.courses.length === 0 && 
          response.data.results.departments.length === 0) {
        setError(`No results found for "${searchInput}"`);
      } else {
        setResults(response.data.results);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search courses (e.g. CMPS 211)"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {/* Display results */}
      <div className="results">
        {results.departments.length > 0 && (
          <div>
            <h3>Departments</h3>
            {results.departments.map(dept => (
              <div key={dept._id}>{dept.code} - {dept.name}</div>
            ))}
          </div>
        )}

        {results.courses.length > 0 && (
          <div>
            <h3>Courses</h3>
            {results.courses.map(course => (
              <div key={course._id}>
                {course.department.code} {course.courseNumber} - {course.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSearch;