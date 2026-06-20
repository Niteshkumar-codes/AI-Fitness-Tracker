// Controllers for Goal resource
// CommonJS style, uses Mongoose models and Express response patterns
const Goal = require('../models/Goal');

// Create a new goal for the authenticated user
exports.createGoal = async (req, res) => {
  try {
    const {
      goalType,
      targetWeight,
      currentWeight,
      targetCalories,
      startDate,
      targetDate,
      status,
    } = req.body;

    // Basic validation
    if (!goalType || targetWeight == null || currentWeight == null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide goalType, targetWeight and currentWeight.',
      });
    }

    const goal = new Goal({
      user: req.userId || (req.user && req.user._id),
      goalType,
      targetWeight,
      currentWeight,
      targetCalories,
      startDate,
      targetDate,
      status,
    });

    await goal.save();

    return res.status(201).json({ success: true, data: goal });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user._id);
    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: goals });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update a goal (only owner can update)
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId || (req.user && req.user._id);

    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Ensure the authenticated user owns the goal
    if (goal.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this goal' });
    }

    // Only allow certain fields to be updated
    const allowed = ['goalType', 'targetWeight', 'currentWeight', 'targetCalories', 'startDate', 'targetDate', 'status'];
    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        goal[field] = req.body[field];
      }
    });

    await goal.save();
    return res.status(200).json({ success: true, data: goal });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a goal (only owner can delete)
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId || (req.user && req.user._id);

    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this goal' });
    }

    // Use document.deleteOne() which is the recommended approach
    // for removing a single document in recent Mongoose versions.
    // This replaces the deprecated `remove()` method.
    await goal.deleteOne();
    return res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
