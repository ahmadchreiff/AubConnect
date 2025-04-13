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

    const searchTerm = query.trim().toUpperCase();
    const results = { departments: [], courses: [], professors: [] };

    // 1. Always search for departments
    results.departments = await Department.find({
      $or: [
        { code: searchTerm },
        { name: new RegExp(searchTerm, 'i') }
      ]
    }).limit(3);

    // 2. Handle course searches
    if (searchTerm.includes(' ')) {
      // Case 1: "DEPT 123" or "DEPT 1" format
      const [deptPart, numberPart] = searchTerm.split(' ');
      
      // Find department by code (case insensitive)
      const dept = await Department.findOne({ 
        code: { $regex: `^${deptPart}$`, $options: 'i' } 
      });
      
      if (dept) {
        // Find courses matching department and number prefix
        results.courses = await Course.find({
          department: dept._id,
          courseNumber: { $regex: `^${numberPart}` }
        })
        .populate('department', 'code')
        .limit(8);
      }
    } else {
      // Case 2: Search by department code only
      const dept = await Department.findOne({ 
        code: { $regex: `^${searchTerm}$`, $options: 'i' } 
      });
      
      if (dept) {
        results.courses = await Course.find({ department: dept._id })
          .populate('department', 'code')
          .limit(8);
      }
      
      // Case 3: General course search (name or number)
      if (results.courses.length === 0) {
        results.courses = await Course.find({
          $or: [
            { name: new RegExp(searchTerm, 'i') },
            { courseNumber: new RegExp(searchTerm, 'i') }
          ]
        })
        .populate('department', 'code')
        .limit(8);
      }
    }

    // 3. Search for professors
    results.professors = await Professor.find({
      $or: [
        { name: new RegExp(searchTerm, 'i') },
        { title: new RegExp(searchTerm, 'i') }
      ]
    })
    .limit(5);

    // 4. Format the suggestions
    const suggestions = [
      ...results.departments.map(d => ({
        id: d._id,
        text: d.code,
        subtext: d.name,
        type: 'department'
      })),
      ...results.courses.map(c => ({
        id: c._id,
        text: `${c.department?.code || 'DEPT'} ${c.courseNumber}`,
        subtext: c.name,
        type: 'course'
      })),
      ...results.professors.map(p => ({
        id: p._id,
        text: p.name,
        subtext: p.title || 'Professor',
        type: 'professor'
      }))
    ];

    // Only return non-empty results
    const filteredSuggestions = suggestions.filter(s => s.text !== 'DEPT');
    
    res.json({ suggestions: filteredSuggestions });
  } catch (err) {
    console.error('Search suggestions error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { searchCourses, getSearchSuggestions };