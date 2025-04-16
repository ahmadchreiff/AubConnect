// backend/seeds/admin_seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Get connection string from command line if not in environment
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ahmadshreif:dbakfjoej183920@cluster0.9hrxm.mongodb.net/?retryWrites=true&w=majority&';

console.log('Using connection string:', MONGO_URI);

// Connect directly to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected for admin seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function seedAdminUser() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@aub.edu.lb' });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@mail.aub.edu',
      password: 'admin12300', // This will be hashed by the pre-save hook
      role: 'admin',
      isVerified: true,
      status: 'active'
    });
    
    await adminUser.save();
    console.log('Admin user created successfully.');
  } catch (err) {
    console.error('Error seeding admin user:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

seedAdminUser();