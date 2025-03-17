// controllers/departmentController.js
const Department = require("../models/Department");
const Course = require("../models/Course");

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    
    res.status(200).json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, faculty } = req.body;
    
    // Check if department already exists
    const existingDepartment = await Department.findOne({ 
      $or: [{ name }, { code }] 
    });
    
    if (existingDepartment) {
      return res.status(400).json({ 
        message: "Department with this name or code already exists" 
      });
    }
    
    // Create new department
    const newDepartment = new Department({
      name,
      code,
      description,
      faculty
    });
    
    await newDepartment.save();
    
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, code, description, faculty } = req.body;
    
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    
    // Check if updating to an existing name or code
    if (name !== department.name || code !== department.code) {
      const existingDepartment = await Department.findOne({
        $or: [
          { name, _id: { $ne: req.params.id } },
          { code, _id: { $ne: req.params.id } }
        ]
      });
      
      if (existingDepartment) {
        return res.status(400).json({ 
          message: "Department with this name or code already exists" 
        });
      }
    }
    
    // Update department
    department.name = name || department.name;
    department.code = code || department.code;
    department.description = description || department.description;
    department.faculty = faculty || department.faculty;
    
    await department.save();
    
    res.status(200).json(department);
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    // Check if courses exist for this department
    const courseCount = await Course.countDocuments({ 
      department: req.params.id 
    });
    
    if (courseCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete department with associated courses. Delete all courses first."
      });
    }
    
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all courses for a specific department
exports.getDepartmentCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      department: req.params.id 
    }).sort({ courseNumber: 1 });
    
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching department courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};