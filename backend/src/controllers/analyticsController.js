/**
 * src/controllers/analyticsController.js
 * 
 * Health & Fitness Analytics Controller
 * Handles calculations for BMI and compiles daily & overall dashboard stats.
 * Uses CommonJS module system and Mongoose models.
 */

const User = require('../models/User');
const Workout = require('../models/Workout');
const Food = require('../models/Food');
const Goal = require('../models/Goal');
const mongoose = require('mongoose');

/**
 * Calculate Body Mass Index (BMI) for the authenticated user
 * GET /api/analytics/bmi
 * 
 * Flow:
 * 1. Fetch user by ID from the database using req.userId (set by authMiddleware)
 * 2. Validate if height and weight exist on the user's profile
 * 3. Calculate BMI using the formula: weight (kg) / (height (m) ^ 2)
 * 4. Determine the BMI classification category
 * 5. Return the results in a standard JSON response
 */
const getBMI = async (req, res) => {
  try {
    // Fetch latest user details from database using the authenticated user ID
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }

    // Check if height and weight are filled in the profile
    const { height, weight } = user;
    if (!height || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile by adding height and weight to calculate BMI.'
      });
    }

    // Calculate BMI
    // Formula: Weight (kg) / Height (m)^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBmi = parseFloat(bmi.toFixed(2));

    // Determine category based on standard WHO guidelines
    let category = '';
    if (roundedBmi < 18.5) {
      category = 'Underweight';
    } else if (roundedBmi < 25.0) {
      category = 'Normal';
    } else if (roundedBmi < 30.0) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    return res.status(200).json({
      success: true,
      message: 'BMI calculated successfully',
      data: {
        height,
        weight,
        bmi: roundedBmi,
        category
      }
    });
  } catch (error) {
    console.error('Error in getBMI controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during BMI calculation',
      error: error.message
    });
  }
};

/**
 * Fetch Daily and Lifetime Dashboard Statistics for the authenticated user
 * GET /api/analytics/dashboard
 * 
 * Computes:
 * - Daily stats (workouts count, calories burned, calories consumed today)
 * - All-time stats (workouts count, total calories burned, total calories consumed overall)
 * - Count of active goals
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // --- Time Window Setup for Daily Stats ---
    // Use target date from query parameters if provided (e.g. ?date=2026-06-20), otherwise default to current local date
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    
    // Set bounds to start of day (00:00:00.000) and end of day (23:59:59.999)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // --- 1. Daily Stats Queries ---
    // Retrieve workouts and food logged specifically for the target day
    const workoutsToday = await Workout.find({
      user: userId,
      workoutDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const foodToday = await Food.find({
      user: userId,
      foodDate: { $gte: startOfDay, $lte: endOfDay }
    });

    // Compute today's aggregates
    const dailyWorkoutsCount = workoutsToday.length;
    const dailyCaloriesBurned = workoutsToday.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const dailyCaloriesConsumed = foodToday.reduce((sum, f) => sum + f.calories, 0);

    // --- 2. All-Time Stats Queries ---
    // Count total workouts logged overall
    const totalWorkouts = await Workout.countDocuments({ user: userId });

    // Sum overall calories burned using MongoDB Aggregation framework
    const totalCaloriesBurnedResult = await Workout.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$caloriesBurned' } } }
    ]);
    const totalCaloriesBurned = totalCaloriesBurnedResult[0]?.total || 0;

    // Sum overall calories consumed using MongoDB Aggregation framework
    const totalCaloriesConsumedResult = await Food.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$calories' } } }
    ]);
    const totalCaloriesConsumed = totalCaloriesConsumedResult[0]?.total || 0;

    // --- 3. Active Goals Query ---
    // Count user's goals that are currently active
    const activeGoalsCount = await Goal.countDocuments({
      user: userId,
      status: 'Active'
    });

    // --- Response ---
    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: {
        date: startOfDay.toISOString().split('T')[0],
        today: {
          workoutsCount: dailyWorkoutsCount,
          caloriesBurned: dailyCaloriesBurned,
          caloriesConsumed: dailyCaloriesConsumed
        },
        allTime: {
          workoutsCount: totalWorkouts,
          caloriesBurned: totalCaloriesBurned,
          caloriesConsumed: totalCaloriesConsumed
        },
        activeGoalsCount
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getBMI,
  getDashboardStats
};
