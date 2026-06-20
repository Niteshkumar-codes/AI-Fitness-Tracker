/**
 * src/controllers/waterController.js
 * 
 * Water Intake Controller
 * Handles logging, retrieving, deleting, and compiling statistics for water intake.
 * Uses CommonJS and Mongoose models.
 */

const Water = require('../models/Water');

/**
 * Log a new water intake entry
 * POST /api/water
 */
const addWater = async (req, res) => {
  try {
    const { amount, intakeDate } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the amount of water in ml.',
      });
    }

    // Ensure amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Water amount must be a positive number.',
      });
    }

    // Create new Water log
    const newWaterLog = new Water({
      user: req.userId,
      amount: Number(amount),
      intakeDate: intakeDate || new Date(),
    });

    const savedLog = await newWaterLog.save();

    return res.status(201).json({
      success: true,
      message: 'Water intake logged successfully',
      data: savedLog,
    });
  } catch (error) {
    console.error('Error in addWater controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while logging water intake',
      error: error.message,
    });
  }
};

/**
 * Retrieve all water intake logs for the authenticated user
 * GET /api/water
 */
const getWaterLogs = async (req, res) => {
  try {
    // Fetch logs sorted by intakeDate descending (newest first)
    const logs = await Water.find({ user: req.userId })
      .sort({ intakeDate: -1 })
      .exec();

    return res.status(200).json({
      success: true,
      message: 'Water intake logs fetched successfully',
      data: logs,
      total: logs.length,
    });
  } catch (error) {
    console.error('Error in getWaterLogs controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching water logs',
      error: error.message,
    });
  }
};

/**
 * Delete a specific water intake log entry
 * DELETE /api/water/:id
 */
const deleteWaterLog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the log entry by ID
    const log = await Water.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Water log entry not found',
      });
    }

    // Security check: Ensure the log entry belongs to the authenticated user
    if (log.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this water log entry',
      });
    }

    // Delete the document
    await log.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Water log entry deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteWaterLog controller:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid water log ID format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting water log',
      error: error.message,
    });
  }
};

/**
 * Fetch daily water intake statistics and goal progress
 * GET /api/water/stats
 */
const getDailyWaterStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Use target date from query parameters if provided, otherwise default to current local date
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();

    // Set daily goal (default 2000 ml, customizable via query parameter)
    const dailyGoal = req.query.goal ? Number(req.query.goal) : 2000;

    if (isNaN(dailyGoal) || dailyGoal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Daily goal must be a positive number of milliliters.',
      });
    }

    // Setup start and end of target day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all logs for the target day
    const logsToday = await Water.find({
      user: userId,
      intakeDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // Sum the water intake amounts
    const totalIntake = logsToday.reduce((sum, log) => sum + log.amount, 0);

    // Calculate progress percentage
    const progressPercentage = parseFloat(((totalIntake / dailyGoal) * 100).toFixed(2));

    // Calculate total glasses (250ml per glass)
    const totalGlasses = parseFloat((totalIntake / 250).toFixed(2));

    return res.status(200).json({
      success: true,
      message: 'Daily water intake statistics calculated successfully',
      data: {
        date: startOfDay.toISOString().split('T')[0],
        totalIntakeMl: totalIntake,
        dailyGoalMl: dailyGoal,
        progressPercentage,
        totalGlasses,
        glassSizeMl: 250,
        logsCount: logsToday.length,
      },
    });
  } catch (error) {
    console.error('Error in getDailyWaterStats controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching water statistics',
      error: error.message,
    });
  }
};

module.exports = {
  addWater,
  getWaterLogs,
  deleteWaterLog,
  getDailyWaterStats,
};
