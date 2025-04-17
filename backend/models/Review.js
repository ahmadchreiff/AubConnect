// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ["course", "professor"] 
  },
  // Course-specific fields
  course: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: function() { return this.type === "course"; }
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: function() { return this.type === "course"; }
  },
  // Professor-specific fields
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professor",
    required: function() { return this.type === "professor"; }
  },
  title: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  reviewText: { 
    type: String, 
    required: true 
  },
  // Username is the actual user who wrote the review (for ownership)
  username: { 
    type: String, 
    required: true 
  },
  // New field to track if review should be displayed anonymously
  isAnonymous: {
    type: Boolean,
    default: false
  },
  // Display name is either the username or "Anonymous" depending on isAnonymous flag
  displayName: {
    type: String,
    required: true
  },
  upvotes: { 
    type: [String], 
    default: [] 
  },
  downvotes: { 
    type: [String], 
    default: [] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['pending','approved','rejected'],
    default: 'approved'
  },
  reports: [{
    reporter: { type: String, required: true }, // username of who reported
    reason: { type: String, required: true },
    details: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  reportCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Review", reviewSchema);