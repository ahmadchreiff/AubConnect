// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Ensure no whitespace and only alphanumeric characters
        return /^[A-Z0-9]+$/.test(v);
      },
      message: 'Course number must contain only letters and numbers with no spaces'
    }
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
// Add pre-save hook to normalize data
courseSchema.pre('save', function(next) {
  // Remove all whitespace and make uppercase
  this.courseNumber = this.courseNumber.replace(/\s+/g, '').toUpperCase();
  next();
});

// Create a compound index to ensure uniqueness of department+courseNumber
courseSchema.index({ department: 1, courseNumber: 1 }, { unique: true });

module.exports = mongoose.model("Course", courseSchema);