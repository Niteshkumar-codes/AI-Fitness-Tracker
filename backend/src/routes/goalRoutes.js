// Express routes for Goal resource
const express = require('express');
const router = express.Router();

const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');

// Protect routes using existing auth middleware
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/goals -> create a new goal
router.post('/', authMiddleware, createGoal);

// GET /api/goals -> get all goals for the authenticated user
router.get('/', authMiddleware, getGoals);

// PUT /api/goals/:id -> update a specific goal
router.put('/:id', authMiddleware, updateGoal);

// DELETE /api/goals/:id -> delete a specific goal
router.delete('/:id', authMiddleware, deleteGoal);

module.exports = router;
