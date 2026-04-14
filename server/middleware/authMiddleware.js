// authMiddleware.js — Protect routes with JWT authentication
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: Verify JWT token from the Authorization header
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the header (format: "Bearer <token>")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Continue to the next middleware/route
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Middleware: Check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is admin, continue
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
