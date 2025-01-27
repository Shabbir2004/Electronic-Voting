const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("../config/database");
const User = require("../models/User");
// Import CA routes
const caRoutes = require("../routes/ca");



// Initialize Express app
const app = express();

// Middleware setup
app.use(
  cors({
    origin: "https://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent along with requests
  })
);

app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });

// Candidate Schema and Model
const candidateSchema = new mongoose.Schema({
  name: String,
  photo: String,
  partyName: String,
  logo: String,
  voteCount: {
    type: Number,
    default: 0,
  },
  description: String,
});

const Candidate = mongoose.model("Candidate", candidateSchema);


// API Route for fetching candidates
app.get("/api/candidates", async (req, res, next) => {
  try {
    const candidates = await Candidate.find({}, "-__v"); // Exclude the version field
    res.json(candidates); // Send candidates to the frontend
  } catch (error) {
    next(error);
  }
});
app.get("/api/users/stats", async (req, res, next) => {
  try {
    const totalRegistered = await User.countDocuments();
    const totalVoted = await User.countDocuments({ voted: true });

    res.json({
      totalRegistered,
      totalVoted,
    });
  } catch (error) {
    next(error);
  }
});



app.post("/api/vote", async (req, res, next) => {
  try {
    const { email, candidateId } = req.body;

    if (!email || !candidateId) {
      return res
        .status(400)
        .json({ error: "Email and candidateId are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.voted) {
      return res.status(400).json({ message: "User has already voted" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.voteCount += 1;
    user.voted = true;

    await Promise.all([candidate.save(), user.save()]);
    res.json({ message: "Vote cast successfully" });
  } catch (error) {
    next(error);
  }
});

// Register CA routes
app.use("/ca", caRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { Candidate };
