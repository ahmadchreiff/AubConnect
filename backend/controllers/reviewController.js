const Review = require("../models/Review");
const Course = require("../models/Course");
const Department = require("../models/Department");
const Professor = require("../models/Professor");
const professorController = require("./professorController");

// Add a list of inappropriate words (you can expand this list)
const inappropriateWords = ["die ", "kill ", "fuck ", "shit ", "bitch ", "asshole ", "bastard ", "dumbass ", 
  "jackass ", "motherfucker ", "dick ", "cunt ", "slut ", "whore ", "piss ", "cock ", 
  "faggot ", "retard ", "nigger ", "spic ", "chink ", "kike ", "wop ",
  "gook ", "homo ", "negro ", "rape ", "molest ", "terrorist ", "bomb ", 
  "pedophile ", "crap ", "douche ", "twat ", "scumbag ", "skank ", "prick ", "goddamn ", "suck ", 
  "balls ", "boner ", "buttplug ", "clit ", "cum ", "dildo ", "ejaculate ", "fap ", 
  "felch ", "flamer ", "gag ", "gangbang ", "handjob ", "jerk ", "kinky ", "muff ", 
  "orgasm ", "penis ", "pussy ", "scat ", "semen ", "splooge ", "spunk ", "threesome ", 
  "tit ", "vagina ", "wank ", "wetback ", "kes ", "ayre "
];

// Function to check for inappropriate content
const containsInappropriateContent = (text) => {
  const lowerCaseText = text.toLowerCase();
  return inappropriateWords.some(word => lowerCaseText.includes(word));
};

/**
 * Post a new review
 * @route POST /api/reviews
 */
const postReview = async (req, res) => {
  try {
    const { 
      type, 
      rating, 
      reviewText, 
      username, 
      anonymous, // Changed to accept the anonymous flag instead of anonymous username
      department: departmentId, 
      course: courseId,
      professor: professorId
    } = req.body;

    // Check for inappropriate content
    if (containsInappropriateContent(reviewText)) {
      return res.status(400).json({ 
        message: "Review contains inappropriate content, unable to post", 
        error: "INAPPROPRIATE_CONTENT" 
      });
    }

    // Create the review object with common fields
    const reviewData = {
      type,
      rating,
      reviewText,
      username,
      isAnonymous: anonymous || false,
      displayName: anonymous ? "Anonymous" : username // Set display name based on anonymity flag
    };

    // Handle course reviews
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
    // Handle professor reviews
    else if (type === "professor") {
      // Ensure professor ID is provided
      if (!professorId) {
        return res.status(400).json({ 
          message: "Professor is required for professor reviews" 
        });
      }

      // Verify that professor exists
      const professor = await Professor.findById(professorId);
      if (!professor) {
        return res.status(404).json({ message: "Professor not found" });
      }

      // Add professor to review data
      reviewData.professor = professorId;
      
      // Set title to professor name for consistency
      reviewData.title = `${professor.title} ${professor.name}`;
    }

    // Create and save the review
    const review = new Review(reviewData);
    await review.save();

    // Update professor rating if it's a professor review
    if (type === "professor") {
      await professorController.updateProfessorRating(professorId);
    }

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
    // Modified to only return approved reviews
    const reviews = await Review.find({ status: { $ne: 'rejected' } })
      .populate('department', 'name code')
      .populate('course', 'name courseNumber')
      .populate('professor', 'name title');
    
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
    
    // Modified to only return approved reviews
    const reviews = await Review.find({ 
      department: departmentId,
      status: { $ne: 'rejected' }
    })
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
    
    // Modified to only return approved reviews
    const reviews = await Review.find({ 
      course: courseId, 
      type: "course",
      status: { $ne: 'rejected' }
    })
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
 * Get reviews by professor
 * @route GET /api/reviews/professor/:professorId
 */
const getReviewsByProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;
    
    // Modified to only return approved reviews
    const reviews = await Review.find({ 
      professor: professorId, 
      type: "professor",
      status: { $ne: 'rejected' }
    })
      .populate('professor', 'name title');
    
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch reviews by professor.", 
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
      rating, 
      reviewText, 
      username,
      anonymous, // Changed to accept the anonymous flag instead of anonymous username
      department: departmentId, 
      course: courseId,
      professor: professorId
    } = req.body;

    // Find the review to update
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Verify ownership using actual username, not display name
    if (review.username !== username) {
      return res.status(403).json({ 
        message: "You are not authorized to edit this review." 
      });
    }

    // NEW CODE: Check if the review has received any feedback (upvotes or downvotes)
    if ((review.upvotes && review.upvotes.length > 0) || (review.downvotes && review.downvotes.length > 0)) {
      return res.status(403).json({ 
        message: "Reviews that have received feedback cannot be edited." 
      });
    }
    
    // Update data object
    const updateData = {
      type,
      rating,
      reviewText,
      isAnonymous: anonymous || false,
      displayName: anonymous ? "Anonymous" : username // Update display name based on anonymity flag
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
      
      // Remove professor reference if changing from professor to course
      if (review.type === "professor") {
        updateData.professor = null;
      }
    } 
    // Handle professor review updates
    else if (type === "professor") {
      if (!professorId) {
        return res.status(400).json({ 
          message: "Professor is required for professor reviews" 
        });
      }

      // Verify professor existence
      const professor = await Professor.findById(professorId);
      if (!professor) {
        return res.status(404).json({ message: "Professor not found" });
      }

      // Update references
      updateData.professor = professorId;
      updateData.title = `${professor.title} ${professor.name}`;
      
      // Remove course and department references if changing from course to professor
      if (review.type === "course") {
        updateData.course = null;
        updateData.department = null;
      }
    }

    // Store the old professor ID if it's a professor review
    const oldProfessorId = review.professor;

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('department', 'name code')
     .populate('course', 'name courseNumber')
     .populate('professor', 'name title');

    // Update professor ratings if necessary
    if (type === "professor" || review.type === "professor") {
      // Update rating for the new professor
      if (professorId) {
        await professorController.updateProfessorRating(professorId);
      }
      
      // Update rating for the old professor if different
      if (oldProfessorId && oldProfessorId.toString() !== professorId) {
        await professorController.updateProfessorRating(oldProfessorId);
      }
    }

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
    
    // Now search by actual username field, not by displayed name
    const reviews = await Review.find({ username })
      .populate('department', 'name code')
      .populate('course', 'name courseNumber')
      .populate('professor', 'name title');
    
    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch user reviews.", 
      error: err.message 
    });
  }
};

/**
 * Delete a review
 * @route DELETE /api/reviews/:id
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body; // Get username from request body

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Verify using actual username field, not displayed name
    if (review.username !== username) {
      return res.status(403).json({ 
        message: "You are not authorized to delete this review." 
      });
    }

    // Store professor ID if it's a professor review - ensure it's a string
    let professorId = null;
    if (review.type === "professor" && review.professor) {
      professorId = review.professor.toString();
    }

    // Delete the review
    await Review.findByIdAndDelete(id);

    // Update professor rating if it was a professor review
    if (professorId) {
      // Make sure to await the rating update before sending response
      try {
        await professorController.updateProfessorRating(professorId);
        console.log(`Professor rating updated after review deletion: ${professorId}`);
      } catch (updateErr) {
        console.error("Error updating professor rating after review deletion:", updateErr);
        // Still continue with the response even if rating update fails
      }
    }

    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ 
      message: "Failed to delete review.", 
      error: err.message 
    });
  }
};
module.exports = { 
  postReview,
  getAllReviews,
  getReviewsByDepartment,
  getReviewsByCourse,
  getReviewsByProfessor,
  updateReview,
  getReviewsByUser,
  deleteReview
};
