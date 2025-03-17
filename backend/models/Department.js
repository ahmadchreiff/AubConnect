// models/Department.js
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  faculty: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Department", departmentSchema);