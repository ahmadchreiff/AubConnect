// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require('../middleware/auth');
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

    // Check if the user has already upvoted
    if (review.upvotes.includes(username)) {
      return res.status(400).json({ 
        message: "You have already upvoted this review." 
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

    // Check if the user has already downvoted
    if (review.downvotes.includes(username)) {
      return res.status(400).json({ 
        message: "You have already downvoted this review." 
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

module.exports = router;