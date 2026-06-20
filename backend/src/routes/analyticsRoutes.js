/**
 * src/routes/analyticsRoutes.js
 * 
 * Express routes for the Health Analytics module
 * Defines endpoints for BMI calculation and dashboard metrics retrieval.
 * Protected by authMiddleware.
 */

const express = require('express');
const router = express.Router();

// Import the analytics controller functions
const { getBMI, getDashboardStats } = require('../controllers/analyticsController');

// Import the authentication middleware to secure the analytics endpoints
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/analytics/bmi
 * @desc    Calculate user's BMI using their profile height & weight
 * @access  Private (Requires valid JWT token)
 */
router.get('/bmi', authMiddleware, getBMI);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Retrieve daily and all-time user dashboard statistics (workouts, food, active goals)
 * @access  Private (Requires valid JWT token)
 */
router.get('/dashboard', authMiddleware, getDashboardStats);

module.exports = router;
