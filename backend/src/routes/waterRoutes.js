/**
 * src/routes/waterRoutes.js
 * 
 * Express routes for Water Intake Tracking module
 * Defines endpoints for logging water, retrieving logs, deleting logs, and stats.
 * Secured using existing authMiddleware.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  addWater,
  getWaterLogs,
  deleteWaterLog,
  getDailyWaterStats,
} = require('../controllers/waterController');

// Import authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST /api/water
 * @desc    Log a new water intake entry
 * @access  Private
 */
router.post('/', authMiddleware, addWater);

/**
 * @route   GET /api/water
 * @desc    Retrieve all water intake logs for the authenticated user
 * @access  Private
 */
router.get('/', authMiddleware, getWaterLogs);

/**
 * @route   GET /api/water/stats
 * @desc    Fetch daily water statistics & goal progress
 * @access  Private
 */
router.get('/stats', authMiddleware, getDailyWaterStats);

/**
 * @route   DELETE /api/water/:id
 * @desc    Delete a specific water log entry by ID
 * @access  Private
 */
router.delete('/:id', authMiddleware, deleteWaterLog);

module.exports = router;
