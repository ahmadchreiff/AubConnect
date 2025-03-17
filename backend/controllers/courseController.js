// controllers/courseController.js
const Course = require("../models/Course");
const Department = require("../models/Department");
const Review = require("../models/Review");

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('department', 'name code')
      .sort({ courseNumber: 1 });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('department', 'name code faculty');

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const {
      courseNumber,
      name,
      department,
      creditHours,
      description,
      prerequisites,
      corequisites,
      syllabus
    } = req.body;

    // Check if department exists
    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if course already exists in this department
    const existingCourse = await Course.findOne({
      department,
      courseNumber
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course with this number already exists in this department"
      });
    }

    // Create new course
    const newCourse = new Course({
      courseNumber,
      name,
      department,
      creditHours,
      description,
      prerequisites,
      corequisites,
      syllabus
    });

    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const {
      courseNumber,
      name,
      department,
      creditHours,
      description,
      prerequisites,
      corequisites,
      syllabus
    } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if department exists if updating department
    if (department && department !== course.department.toString()) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Check if course already exists in new department
      if (courseNumber) {
        const existingCourse = await Course.findOne({
          department,
          courseNumber,
          _id: { $ne: req.params.id }
        });

        if (existingCourse) {
          return res.status(400).json({
            message: "Course with this number already exists in this department"
          });
        }
      }
    }

    // Update course fields
    course.courseNumber = courseNumber || course.courseNumber;
    course.name = name || course.name;
    course.department = department || course.department;
    course.creditHours = creditHours || course.creditHours;
    course.description = description !== undefined ? description : course.description;

    // Handle arrays (optional)
    if (prerequisites) course.prerequisites = prerequisites;
    if (corequisites) course.corequisites = corequisites;

    course.syllabus = syllabus !== undefined ? syllabus : course.syllabus;

    await course.save();

    res.status(200).json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    // Check if reviews exist for this course
    const reviewCount = await Review.countDocuments({
      type: "course",
      title: req.params.id // Assuming title stores the course ID for course reviews
    });

    if (reviewCount > 0) {
      return res.status(400).json({
        message: "Cannot delete course with associated reviews. Delete all reviews first."
      });
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get course reviews
exports.getCourseReviews = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const reviews = await Review.find({
      type: "course",
      course: courseId  // Changed from title: courseId to course: courseId
    }).sort({ createdAt: -1 });


    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};