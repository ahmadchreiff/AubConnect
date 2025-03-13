// In a new file searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchCourses } = require('../controllers/searchController'); // Adjust path as needed

// Search endpoint
router.get('/', searchCourses);


module.exports = router;