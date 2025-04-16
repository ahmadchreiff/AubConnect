const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Review = require("../models/Review"); // Add this import

// Create a review
router.post("/", reviewController.postReview);

// Get all reviews
router.get("/", reviewController.getAllReviews);

// Get reviews by authenticated user
router.get("/user", auth, reviewController.getReviewsByUser);

// Get reviews by department
router.get("/department/:departmentId", reviewController.getReviewsByDepartment);

// Get reviews by course
router.get("/course/:courseId", reviewController.getReviewsByCourse);

// Get reviews by professor
router.get("/professor/:professorId", reviewController.getReviewsByProfessor);

// Update a review
router.put("/:id", reviewController.updateReview);

// Delete a review
router.delete("/:id", reviewController.deleteReview);



// Upvote a review
router.post("/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the user has already upvoted - toggle logic
    if (review.upvotes.includes(username)) {
      // Remove the upvote if already upvoted (toggle off)
      review.upvotes = review.upvotes.filter((user) => user !== username);
      await review.save();
      
      return res.status(200).json({ 
        message: "Upvote removed successfully!", 
        review 
      });
    }

    // Remove user from downvotes if they previously downvoted
    if (review.downvotes.includes(username)) {
      review.downvotes = review.downvotes.filter((user) => user !== username);
    }

    // Add user to upvotes
    review.upvotes.push(username);
    await review.save();

    res.status(200).json({ 
      message: "Review upvoted successfully!", 
      review 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to upvote review.", 
      error: err.message 
    });
  }
});

// Downvote a review
router.post("/:id/downvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the user has already downvoted - toggle logic
    if (review.downvotes.includes(username)) {
      // Remove the downvote if already downvoted (toggle off)
      review.downvotes = review.downvotes.filter((user) => user !== username);
      await review.save();
      
      return res.status(200).json({ 
        message: "Downvote removed successfully!", 
        review 
      });
    }

    // Remove user from upvotes if they previously upvoted
    if (review.upvotes.includes(username)) {
      review.upvotes = review.upvotes.filter((user) => user !== username);
    }

    // Add user to downvotes
    review.downvotes.push(username);
    await review.save();

    res.status(200).json({ 
      message: "Review downvoted successfully!", 
      review 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to downvote review.", 
      error: err.message 
    });
  }
});

router.post('/:id/report', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, reason, details } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if user already reported this review
    const alreadyReported = review.reports.some(report => report.reporter === username);
    if (alreadyReported) {
      return res.status(400).json({ message: "You have already reported this review." });
    }

    // Add new report
    review.reports.push({
      reporter: username,
      reason,
      details: details || "No additional details"
    });
    review.reportCount = review.reports.length;
    
    await review.save();

    res.status(200).json({ 
      success: true,
      message: "Review reported successfully!", 
      review 
    });
  } catch (err) {
    console.error("Error reporting review:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to report review.", 
      error: err.message 
    });
  }
});

// Get reported reviews (for admin)
router.get('/reported', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reportCount: { $gt: 0 } })
      .sort({ reportCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate('course', 'name courseNumber')
      .populate('professor', 'name title');

    const total = await Review.countDocuments({ reportCount: { $gt: 0 } });

    res.status(200).json({
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch reported reviews.", 
      error: err.message 
    });
  }
});

module.exports = router;