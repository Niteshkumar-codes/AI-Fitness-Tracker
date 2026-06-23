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
const { getRecommendations } = require('../controllers/aiController');

// Import authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/ai/recommendations
 * @desc    Fetch personalized health and fitness recommendations from Gemini AI
 * @access  Private
 */
router.get('/recommendations', authMiddleware, getRecommendations);

module.exports = router;
