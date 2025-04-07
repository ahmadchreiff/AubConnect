// controllers/professorController.js
const Professor = require("../models/Professor");
const Department = require("../models/Department");
const Review = require("../models/Review");

/**
 * Create a new professor
 * @route POST /api/professors
 */
const createProfessor = async (req, res) => {
  try {
    const { 
      name, 
      departments, 
      title, 
      email, 
      bio, 
      courses, 
      office, 
      officeHours, 
      profileImage 
    } = req.body;

    // Validate required fields
    if (!name || !departments || !departments.length) {
      return res.status(400).json({ 
        message: "Professor name and at least one department are required" 
      });
    }

    // Verify all departments exist
    for (const deptId of departments) {
      const department = await Department.findById(deptId);
      if (!department) {
        return res.status(404).json({ 
          message: `Department with ID ${deptId} not found` 
        });
      }
    }

    // Create professor
    const professor = new Professor({
      name,
      departments,
      title: title || "Professor",
      email,
      bio,
      courses,
      office,
      officeHours,
      profileImage
    });

    await professor.save();

    res.status(201).json({
      message: "Professor created successfully!",
      professor
    });
  } catch (err) {
    // Check for duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "A professor with this name already exists in the specified department(s)" 
      });
    }

    res.status(500).json({
      message: "Failed to create professor.",
      error: err.message
    });
  }
};

/**
 * Get all professors
 * @route GET /api/professors
 */
const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find()
      .populate('departments', 'name code')
      .populate('courses', 'name courseNumber');
    
    res.status(200).json(professors);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch professors.",
      error: err.message
    });
  }
};

/**
 * Get professor by ID
 * @route GET /api/professors/:id
 */
const getProfessorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const professor = await Professor.findById(id)
      .populate('departments', 'name code')
      .populate('courses', 'name courseNumber');
      
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }
    
    res.status(200).json(professor);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch professor.",
      error: err.message
    });
  }
};

/**
 * Get professors by department
 * @route GET /api/professors/department/:departmentId
 */
const getProfessorsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const professors = await Professor.find({ departments: departmentId })
      .populate('departments', 'name code')
      .populate('courses', 'name courseNumber');
    
    res.status(200).json(professors);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch professors by department.",
      error: err.message
    });
  }
};

/**
 * Update professor
 * @route PUT /api/professors/:id
 */
const updateProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      departments,
      title,
      email,
      bio,
      courses,
      office,
      officeHours,
      profileImage
    } = req.body;

    // Validate required fields
    if (departments && departments.length > 0) {
      // Verify all departments exist
      for (const deptId of departments) {
        const department = await Department.findById(deptId);
        if (!department) {
          return res.status(404).json({
            message: `Department with ID ${deptId} not found`
          });
        }
      }
    }

    const professor = await Professor.findByIdAndUpdate(
      id,
      {
        name,
        departments,
        title,
        email,
        bio,
        courses,
        office,
        officeHours,
        profileImage
      },
      { new: true }
    )
    .populate('departments', 'name code')
    .populate('courses', 'name courseNumber');

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    res.status(200).json({
      message: "Professor updated successfully!",
      professor
    });
  } catch (err) {
    // Check for duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: "A professor with this name already exists in the specified department(s)"
      });
    }

    res.status(500).json({
      message: "Failed to update professor.",
      error: err.message
    });
  }
};

/**
 * Delete professor
 * @route DELETE /api/professors/:id
 */
const deleteProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const professor = await Professor.findByIdAndDelete(id);
    
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }
    
    // Also delete all reviews for this professor
    await Review.deleteMany({ professor: id, type: "professor" });
    
    res.status(200).json({ message: "Professor deleted successfully!" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete professor.",
      error: err.message
    });
  }
};

/**
 * Update professor average rating
 * @param {string} professorId - The ID of the professor
 */
const updateProfessorRating = async (professorId) => {
  try {
    // Only include approved reviews in rating calculation
    const reviews = await Review.find({ 
      professor: professorId, 
      type: "professor",
      status: "approved" // Only consider approved reviews
    });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;
      
      await Professor.findByIdAndUpdate(
        professorId,
        { avgRating: parseFloat(avgRating.toFixed(1)) }
      );
      
      console.log(`Updated professor ${professorId} rating to ${avgRating.toFixed(1)} based on ${reviews.length} reviews`);
    } else {
      // If no approved reviews exist, set rating to 0
      await Professor.findByIdAndUpdate(
        professorId,
        { avgRating: 0 }
      );
      
      console.log(`Reset professor ${professorId} rating to 0 (no approved reviews)`);
    }
  } catch (err) {
    console.error("Failed to update professor rating:", err);
  }
};

module.exports = {
  createProfessor,
  getAllProfessors,
  getProfessorById,
  getProfessorsByDepartment,
  updateProfessor,
  deleteProfessor,
  updateProfessorRating
};