// Import Express framework to create routing handlers
const express = require('express');

// Import the food controller containing all handler functions
const {
  addFood,
  getFoods,
  deleteFood,
} = require('../controllers/foodController');

// Import the authentication middleware to protect routes
// This middleware verifies JWT tokens and attaches user info to the request
const authMiddleware = require('../middleware/authMiddleware');

// Create a new router instance for defining food-related routes
const router = express.Router();

/**
 * POST /api/foods
 * Route: Add a new food entry
 * 
 * Protected: Requires valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 * 
 * Request Body:
 * {
 *   "foodName": "Oatmeal",
 *   "calories": 300,
 *   "protein": 10,
 *   "carbs": 54,
 *   "fats": 6,
 *   "mealType": "Breakfast",
 *   "foodDate": "2024-06-18T08:00:00.000Z" // Optional, defaults to current date
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "Food entry added successfully",
 *   "data": { food object with all fields and timestamps }
 * }
 */
router.post('/', authMiddleware, addFood);

/**
 * GET /api/foods
 * Route: Retrieve all food entries for the authenticated user
 * 
 * Protected: Requires valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Food entries fetched successfully",
 *   "data": [ array of food objects ],
 *   "total": 5
 * }
 */
router.get('/', authMiddleware, getFoods);

/**
 * DELETE /api/foods/:id
 * Route: Delete a specific food entry by ID
 * 
 * Protected: Requires valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 * 
 * URL Parameters:
 * - id: MongoDB ObjectId of the food entry to delete
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Food entry deleted successfully"
 * }
 */
router.delete('/:id', authMiddleware, deleteFood);

// Export the router for use in the main server file
// The main server will use this with: app.use('/api/foods', foodRoutes)
module.exports = router;
