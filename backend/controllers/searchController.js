// searchController.js
const Course = require('../models/Course');
const Department = require('../models/Department');
const Professor = require('../models/Professor');

/**
 * Search for courses, departments, and professors
 * @route GET /api/search
 */
const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query?.trim()) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const searchTerm = query.trim().toUpperCase();
    const results = { courses: [], departments: [] };

    // 1. Handle department search
    results.departments = await Department.find({
      $or: [
        { code: searchTerm },
        { name: new RegExp(searchTerm, 'i') }
      ]
    });

    // 2. Handle course search
    if (searchTerm.includes(' ')) {
      // Handle "DEPT NUMBER" format (e.g., "ECON 101")
      const [deptPart, numberPart] = searchTerm.split(' ');
      
      const courses = await Course.aggregate([
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'dept'
          }
        },
        {
          $unwind: '$dept'
        },
        {
          $match: {
            $and: [
              { 'dept.code': deptPart },
              { courseNumber: numberPart }
            ]
          }
        }
      ]);
      
      results.courses = courses;
    } else {
      // Handle single term searches (department code or course number)
      const courses = await Course.aggregate([
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'dept'
          }
        },
        {
          $unwind: '$dept'
        },
        {
          $match: {
            $or: [
              { 'dept.code': searchTerm },
              { courseNumber: searchTerm },
              { name: new RegExp(searchTerm, 'i') }
            ]
          }
        }
      ]);
      
      results.courses = courses;
    }

    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed', error: err.message });
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

    const cleanQuery = query.trim().toUpperCase();
    const searchRegex = new RegExp(cleanQuery.replace(/\s+/g, '\\s*'), 'i');
    
    // Get department suggestions
    const departments = await Department.find({ 
      $or: [
        { name: searchRegex },
        { code: searchRegex }
      ]
    }).limit(5);
    
    // Get course suggestions - UPDATED TO HANDLE DEPARTMENT+NUMBER FORMAT
    let courses = [];
    
    if (cleanQuery.includes(' ')) {
      // Handle "DEPT NUMBER" format (e.g., "ECON 101")
      const [deptPart, numberPart] = cleanQuery.split(' ');
      
      courses = await Course.aggregate([
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'dept'
          }
        },
        {
          $unwind: '$dept'
        },
        {
          $match: {
            $and: [
              { 'dept.code': new RegExp(deptPart, 'i') },
              { courseNumber: new RegExp(numberPart, 'i') }
            ]
          }
        },
        { $limit: 8 }
      ]);
    } else {
      // Handle single term searches
      courses = await Course.find({
        $or: [
          { name: searchRegex },
          { courseNumber: searchRegex }
        ]
      }).populate('department', 'code').limit(8);
    }
    
    // Get professor suggestions
    const professors = await Professor.find({
      $or: [
        { name: searchRegex },
        { title: searchRegex }
      ]
    }).populate('departments', 'code').limit(8);
    
    // Format the suggestions - UPDATED TO HANDLE AGGREGATION RESULTS
    const suggestions = [
      ...departments.map(dept => ({
        id: dept._id,
        text: dept.code,
        subtext: dept.name,
        type: 'department'
      })),
      ...courses.map(course => ({
        id: course._id || course.id, // Handle both aggregate and regular query results
        text: `${course.dept?.code || course.department?.code} ${course.courseNumber}`,
        subtext: course.name,
        type: 'course'
      })),
      ...professors.map(professor => {
        const deptAffiliations = professor.departments.map(dept => dept.code).join(', ');
        return {
          id: professor._id,
          text: professor.name,
          subtext: `${professor.title}${deptAffiliations ? ` (${deptAffiliations})` : ''}`,
          type: 'professor'
        };
      })
    ];
    
    res.json({ suggestions });
  } catch (err) {
    console.error('Search suggestions error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { searchCourses, getSearchSuggestions };