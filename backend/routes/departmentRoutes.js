// routes/departmentRoutes.js
const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
// Middleware for authentication can be added here if needed

// Get all departments
router.get("/", departmentController.getAllDepartments);

// Get department by ID
router.get("/:id", departmentController.getDepartmentById);

// Get all courses for a department
router.get("/:id/courses", departmentController.getDepartmentCourses);

// Create a new department
router.post("/", departmentController.createDepartment);

// Update a department
router.put("/:id", departmentController.updateDepartment);

// Delete a department
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;