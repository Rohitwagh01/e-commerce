// server.js — Main entry point for the backend
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ---- Middleware ----
// Allow requests from the React frontend (CORS)
// Explicitly allow all methods (including DELETE) and the Authorization header
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Parse incoming JSON data
app.use(express.json());

// ---- Routes ----
// User routes (login, register)
app.use("/api/users", require("./routes/userRoutes"));
// Product routes (CRUD operations)
app.use("/api/products", require("./routes/productRoutes"));

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "🛒 eCommerce API is running..." });
});

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
