const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Ensure the port matches the frontend request

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("MongoDB connected successfully");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes")); // Add this line

// Start the application
startServer();