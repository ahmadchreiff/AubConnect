// update-professor-ratings.js
// Run this script to update all professor ratings based on existing reviews
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Professor = require('../models/Professor');
const Review = require('../models/Review');

// Get MongoDB URI from environment variables - same as your application uses
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('MONGO_URI environment variable is not defined');
  process.exit(1);
}

// Connect to the database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const updateAllProfessorRatings = async () => {
  try {
    console.log('Starting professor ratings update...');
    
    // Get all professors
    const professors = await Professor.find();
    console.log(`Found ${professors.length} professors to process`);
    
    let updatedCount = 0;
    let zeroRatingCount = 0;
    
    // Update each professor's rating
    for (const professor of professors) {
      // Get all approved reviews for this professor
      const reviews = await Review.find({ 
        professor: professor._id,
        type: "professor",
        status: "approved"
      });
      
      if (reviews.length > 0) {
        // Calculate new average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        const formattedRating = parseFloat(avgRating.toFixed(1));
        
        // Update professor rating
        await Professor.findByIdAndUpdate(
          professor._id,
          { avgRating: formattedRating }
        );
        
        console.log(`Updated Professor: ${professor.name} - New rating: ${formattedRating} (from ${reviews.length} reviews)`);
        updatedCount++;
      } else {
        // Reset rating to 0 if no approved reviews
        await Professor.findByIdAndUpdate(
          professor._id,
          { avgRating: 0 }
        );
        
        console.log(`Reset Professor: ${professor.name} - No approved reviews found`);
        zeroRatingCount++;
      }
    }
    
    console.log('\nRating update complete!');
    console.log(`Updated ${updatedCount} professors with reviews`);
    console.log(`Reset ${zeroRatingCount} professors with no approved reviews`);
    
  } catch (error) {
    console.error('Error updating professor ratings:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the update function
updateAllProfessorRatings();