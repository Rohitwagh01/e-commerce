// userRoutes.js — Routes for user authentication
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

// POST /api/users/register — Register a new user
router.post("/register", registerUser);

// POST /api/users/login — Login and get token
router.post("/login", loginUser);

module.exports = router;
