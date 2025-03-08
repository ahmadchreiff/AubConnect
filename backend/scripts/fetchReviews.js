const mongoose = require("mongoose");
const Review = require("../models/Review");

const uri = "mongodb://localhost:27017/your_database_name"; // Replace with your actual database name

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const reviews = await Review.find();
    console.log("Existing Reviews:", reviews);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });
