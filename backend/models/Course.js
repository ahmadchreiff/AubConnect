// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseNumber: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  creditHours: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  prerequisites: [{ 
    type: String
  }],
  corequisites: [{ 
    type: String 
  }],
  syllabus: { 
    type: String, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create a compound index to ensure uniqueness of department+courseNumber
courseSchema.index({ department: 1, courseNumber: 1 }, { unique: true });

module.exports = mongoose.model("Course", courseSchema);