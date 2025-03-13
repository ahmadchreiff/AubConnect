// searchController.js
const Course = require('../models/Course');
const Department = require('../models/Department');

/**
 * Search for courses and departments
 * @route GET /api/search
 */
const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const cleanQuery = query.trim();
    
    // Check if the query looks like a course code (e.g., "CMPS 201" or "CMPS201")
    const courseCodeRegex = /^([a-zA-Z]+)\s*(\d+)/;
    const courseCodeMatch = cleanQuery.match(courseCodeRegex);
    
    let results = { courses: [], departments: [] };
    
    if (courseCodeMatch) {
      // If it matches a course code pattern, split into department code and course number
      const deptCode = courseCodeMatch[1].toUpperCase();
      const courseNum = courseCodeMatch[2];
      
      // First find the department
      const department = await Department.findOne({ code: deptCode });
      
      if (department) {
        // Then find courses in that department with matching course number
        const courses = await Course.find({
          department: department._id,
          courseNumber: { $regex: courseNum }
        }).populate('department', 'name code');
        
        results.courses = courses;
        results.departments = [department];
      }
    }
    
    // If no course code match or no results found, perform a general search
    if (results.courses.length === 0 && results.departments.length === 0) {
      const searchRegex = new RegExp(cleanQuery, 'i');
      
      // Search for courses by name, number, or description
      const courses = await Course.find({
        $or: [
          { name: searchRegex },
          { courseNumber: searchRegex },
          { description: searchRegex }
        ]
      }).populate('department', 'name code');
      
      // Search for departments by name or code
      const departments = await Department.find({
        $or: [
          { name: searchRegex },
          { code: searchRegex }
        ]
      });
      
      results.courses = courses;
      results.departments = departments;
    }
    
    res.status(200).json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get search suggestions as user types
 * @route GET /api/search/suggestions
 */
const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.json({ suggestions: [] });
    }

    const cleanQuery = query.trim();
    const searchRegex = new RegExp(cleanQuery, 'i');
    
    // Get department suggestions
    const departments = await Department.find({ 
      $or: [
        { name: searchRegex },
        { code: searchRegex }
      ]
    }).limit(5);
    
    // Get course suggestions
    const courses = await Course.find({
      $or: [
        { name: searchRegex },
        { courseNumber: searchRegex }
      ]
    }).populate('department', 'code').limit(10);
    
    // Format the suggestions
    const suggestions = [
      ...departments.map(dept => ({
        id: dept._id,
        text: dept.code,
        subtext: dept.name,
        type: 'department'
      })),
      ...courses.map(course => ({
        id: course._id,
        text: `${course.department.code} ${course.courseNumber}`,
        subtext: course.name,
        type: 'course'
      }))
    ];
    
    res.json({ suggestions });
  } catch (err) {
    console.error('Search suggestions error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { searchCourses, getSearchSuggestions };