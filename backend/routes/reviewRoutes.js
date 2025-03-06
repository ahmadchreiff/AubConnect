// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Existing routes
router.post("/", async (req, res) => {
  try {
    const { type, title, rating, reviewText, username } = req.body;
    const review = new Review({ type, title, rating, reviewText, username });
    await review.save();
    res.status(201).json({ message: "Review created successfully!", review });
  } catch (err) {
    res.status(500).json({ message: "Failed to create review.", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.username !== username) {
      return res.status(403).json({ message: "You are not authorized to delete this review." });
    }

    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review.", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, rating, reviewText, username } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.username !== username) {
      return res.status(403).json({ message: "You are not authorized to edit this review." });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { type, title, rating, reviewText },
      { new: true }
    );

    res.status(200).json({ message: "Review updated successfully!", review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: "Failed to update review.", error: err.message });
  }
});

// New routes for upvoting and downvoting
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
      return res.status(400).json({ message: "You have already upvoted this review." });
    }

    // Remove user from downvotes if they previously downvoted
    if (review.downvotes.includes(username)) {
      review.downvotes = review.downvotes.filter((user) => user !== username);
    }

    // Add user to upvotes
    review.upvotes.push(username);
    await review.save();

    res.status(200).json({ message: "Review upvoted successfully!", review });
  } catch (err) {
    res.status(500).json({ message: "Failed to upvote review.", error: err.message });
  }
});

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
      return res.status(400).json({ message: "You have already downvoted this review." });
    }

    // Remove user from upvotes if they previously upvoted
    if (review.upvotes.includes(username)) {
      review.upvotes = review.upvotes.filter((user) => user !== username);
    }

    // Add user to downvotes
    review.downvotes.push(username);
    await review.save();

    res.status(200).json({ message: "Review downvoted successfully!", review });
  } catch (err) {
    res.status(500).json({ message: "Failed to downvote review.", error: err.message });
  }
});

module.exports = router;