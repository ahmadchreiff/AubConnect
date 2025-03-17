// searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchCourses, getSearchSuggestions } = require('../controllers/searchController');

// Search endpoint
router.get('/', searchCourses);

// Suggestions endpoint
router.get('/suggestions', getSearchSuggestions);

module.exports = router;