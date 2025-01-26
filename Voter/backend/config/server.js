const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("../config/database");

// Import CA routes
const caRoutes = require("../routes/ca");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Register routes
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
