const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log('MongoDB connected'); 
  } catch (err) {
    throw err; // Throw the error to be handled in server.js
  }
};

module.exports = connectDB;