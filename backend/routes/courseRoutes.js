// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
// Middleware for authentication can be added here if needed

// Get all courses
router.get("/", courseController.getAllCourses);

// Get course by ID
router.get("/:id", courseController.getCourseById);

// Get course reviews
router.get("/:id/reviews", courseController.getCourseReviews);

// Create a new course
router.post("/", courseController.createCourse);

// Update a course
router.put("/:id", courseController.updateCourse);

// Delete a course
router.delete("/:id", courseController.deleteCourse);

module.exports = router;