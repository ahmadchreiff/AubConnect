const Review = require("../models/Review");
const Course = require("../models/Course");
const Department = require("../models/Department");

/**
 * Post a new review
 * @route POST /api/reviews
 */
const postReview = async (req, res) => {
  try {
    const { 
      type, 
      title, 
      rating, 
      reviewText, 
      username, 
      department: departmentId, 
      course: courseId 
    } = req.body;

    // Create the review object with common fields
    const reviewData = {
      type,
      title,
      rating,
      reviewText,
      username
    };

    // If it's a course review, validate and add course and department references
    if (type === "course") {
      // Ensure required fields are provided
      if (!departmentId || !courseId) {
        return res.status(400).json({ 
          message: "Department and course are required for course reviews" 
        });
      }

      // Verify that department exists
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Verify that course exists and belongs to the department
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.department.toString() !== departmentId) {
        return res.status(400).json({ 
          message: "Course does not belong to the selected department" 
        });
      }

      // Add course and department to review data
      reviewData.course = courseId;
      reviewData.department = departmentId;
      
      // Set title to course name for consistency
      reviewData.title = `${department.code} ${course.courseNumber}: ${course.name}`;
    }

    // Create and save the review
    const review = new Review(reviewData);
    await review.save();

    res.status(201).json({ 
      message: "Review created successfully!", 
      review 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to create review.", 
      error: err.message 
    });
  }
};

/**
 * Get all reviews
 * @route GET /api/reviews
 */
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('department', 'name code')
      .populate('course', 'name courseNumber');
    
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch reviews.", 
      error: err.message 
    });
  }
};

/**
 * Get reviews by department
 * @route GET /api/reviews/department/:departmentId
 */
const getReviewsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const reviews = await Review.find({ department: departmentId })
      .populate('department', 'name code')
      .populate('course', 'name courseNumber');
    
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch reviews by department.", 
      error: err.message 
    });
  }
};

/**
 * Get reviews by course
 * @route GET /api/reviews/course/:courseId
 */
const getReviewsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const reviews = await Review.find({ course: courseId })
      .populate('department', 'name code')
      .populate('course', 'name courseNumber');
    
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch reviews by course.", 
      error: err.message 
    });
  }
};

/**
 * Update a review
 * @route PUT /api/reviews/:id
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      type, 
      title, 
      rating, 
      reviewText, 
      username,
      department: departmentId, 
      course: courseId 
    } = req.body;

    // Find the review to update
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Verify ownership
    if (review.username !== username) {
      return res.status(403).json({ 
        message: "You are not authorized to edit this review." 
      });
    }

    // Update data object
    const updateData = {
      type,
      rating,
      reviewText
    };

    // Handle course review updates
    if (type === "course") {
      if (!departmentId || !courseId) {
        return res.status(400).json({ 
          message: "Department and course are required for course reviews" 
        });
      }

      // Verify department and course existence
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check course belongs to department
      if (course.department.toString() !== departmentId) {
        return res.status(400).json({ 
          message: "Course does not belong to the selected department" 
        });
      }

      // Update references
      updateData.department = departmentId;
      updateData.course = courseId;
      updateData.title = `${department.code} ${course.courseNumber}: ${course.name}`;
    } else {
      // For professor reviews, just update the title
      updateData.title = title;
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('department', 'name code')
     .populate('course', 'name courseNumber');

    res.status(200).json({ 
      message: "Review updated successfully!", 
      review: updatedReview 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to update review.", 
      error: err.message 
    });
  }
};

/**
 * Get reviews by username
 * @route GET /api/reviews/user
 */
const getReviewsByUser = async (req, res) => {
  try {
    // Get username from authenticated user
    const username = req.user.username;
    
    const reviews = await Review.find({ username })
      .populate('department', 'name code')
      .populate('course', 'name courseNumber');
    
    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch user reviews.", 
      error: err.message 
    });
  }
};

module.exports = { 
  postReview,
  getAllReviews,
  getReviewsByDepartment,
  getReviewsByCourse,
  updateReview,
  getReviewsByUser 
};