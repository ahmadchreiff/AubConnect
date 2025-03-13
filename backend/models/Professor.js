// models/Professor.js
const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  departments: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  }],
  title: { 
    type: String, 
    default: "Professor" 
  },
  email: { 
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    unique: true,
    sparse: true  // Allows null values while maintaining uniqueness
  },
  bio: { 
    type: String, 
    default: "" 
  },
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  office: { 
    type: String, 
    default: "" 
  },
  officeHours: { 
    type: String, 
    default: "" 
  },
  profileImage: { 
    type: String, 
    default: "" 
  },
  avgRating: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure professor names are unique within departments
professorSchema.index({ name: 1, departments: 1 }, { unique: true });

module.exports = mongoose.model("Professor", professorSchema);