const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "course" or "professor"
  title: { type: String, required: true }, // Course or professor name
  rating: { type: Number, required: true }, // Rating (1-5)
  reviewText: { type: String, required: true }, // Review content
  username: { type: String, required: true }, // Username of the reviewer
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Review", reviewSchema);