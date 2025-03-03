const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// POST /api/reviews - Create a new review
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

// GET /api/reviews - Fetch all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find(); // Fetch reviews from the database
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: err.message });
  }
});

module.exports = router;

module.exports = router;