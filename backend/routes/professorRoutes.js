// routes/professorRoutes.js
const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const auth = require('../middleware/auth');

// Create a professor
router.post("/", auth, professorController.createProfessor);

// Get all professors
router.get("/", professorController.getAllProfessors);

// Get professor by ID
router.get("/:id", professorController.getProfessorById);

// Get professors by department
router.get("/department/:departmentId", professorController.getProfessorsByDepartment);

// Update a professor
router.put("/:id", auth, professorController.updateProfessor);

// Delete a professor
router.delete("/:id", auth, professorController.deleteProfessor);

module.exports = router;