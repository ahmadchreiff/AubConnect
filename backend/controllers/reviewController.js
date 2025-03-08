const Review = require("../models/Review");

const postReview = async (req, res) => {
  const { reviewText, username } = req.body;

  try {
    const review = new Review({
      reviewText,
      username,
    });

    await review.save();

    res.status(201).json({ message: "Review posted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to post review.", error: err.message });
  }
};

module.exports = { postReview };