// Import Express framework to create routing handlers
const express = require('express');

// Import the workout controller containing all handler functions
const {
  addWorkout,
  getWorkouts,
  deleteWorkout,
} = require('../controllers/workoutController');

// Import the authentication middleware to protect routes
// This middleware verifies JWT tokens and attaches user info to the request
const authMiddleware = require('../middleware/authMiddleware');

// Create a new router instance for defining workout-related routes
// A router is like a mini-app that handles a specific set of routes
const router = express.Router();

/**
 * POST /api/workouts
 * Route: Add a new workout
 * 
 * Protected: Requires valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 * 
 * Request Body:
 * {
 *   "workoutType": "Running",
 *   "duration": 30,
 *   "caloriesBurned": 350,
 *   "notes": "Morning run in the park",
 *   "workoutDate": "2024-06-18T06:00:00.000Z" // Optional, defaults to current date
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "Workout added successfully",
 *   "data": { workout object with all fields and timestamps }
 * }
 */
router.post('/', authMiddleware, addWorkout);

/**
 * GET /api/workouts
 * Route: Retrieve all workouts for the authenticated user
 * 
 * Protected: Requires valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 * 
 * Query Parameters: None
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Workouts fetched successfully",
 *   "data": [ array of workout objects ],
 *   "total": 5
 * }
 * 
 * Notes:
 * - Returns workouts sorted by date (most recent first)
 * - Only returns workouts belonging to the authenticated user
 * - Returns empty array if user has no workouts
 */
router.get('/', authMiddleware, getWorkouts);

/**
 * DELETE /api/workouts/:id
 * Route: Delete a specific workout by ID
 * 
 * Protected: Requires valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 * 
 * URL Parameters:
 * - id: MongoDB ObjectId of the workout to delete
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Workout deleted successfully"
 * }
 * 
 * Error Responses:
 * - 404: Workout not found
 * - 403: Unauthorized (user trying to delete another user's workout)
 * - 400: Invalid workout ID format
 * 
 * Security:
 * - Users can only delete their own workouts
 * - Verification happens in the controller
 */
router.delete('/:id', authMiddleware, deleteWorkout);

// Export the router for use in the main server file
// The main server will use this with: app.use('/api/workouts', workoutRoutes)
module.exports = router;
