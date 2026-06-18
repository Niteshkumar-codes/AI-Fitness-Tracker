// Import Express Router to create modular routes
const express = require('express');

// Import authentication controller functions
const {
  registerUser,
  loginUser,
  getProfile,
} = require('../controllers/authController');

// Import authentication middleware for protected routes
const authMiddleware = require('../middleware/authMiddleware');

// Create a router instance
const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Public route (no authentication required)
 */
router.post('/register', registerUser);

/**
 * POST /api/auth/login
 * Login with email and password
 * Public route (no authentication required)
 */
router.post('/login', loginUser);

/**
 * GET /api/auth/profile
 * Get authenticated user's profile
 * Protected route (requires valid JWT token)
 */
router.get('/profile', authMiddleware, getProfile);

// Export the router for use in server.js
module.exports = router;
