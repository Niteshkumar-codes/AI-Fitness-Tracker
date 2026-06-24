/**
 * src/routes/aiRoutes.js
 * 
 * Express routes for Gemini AI Health Coach module
 * Defines endpoints for obtaining AI health and fitness recommendations.
 * Secured using existing authMiddleware.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const { getRecommendations, getWorkoutPlan } = require('../controllers/aiController');

// Import authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/ai/recommendations
 * @desc    Fetch personalized health and fitness recommendations from Gemini AI
 * @access  Private
 */
router.get('/recommendations', authMiddleware, getRecommendations);

/**
 * @route   GET /api/ai/workout-plan
 * @desc    Fetch personalized 7-day workout plan from Gemini AI
 * @access  Private
 */
router.get('/workout-plan', authMiddleware, getWorkoutPlan);

module.exports = router;
