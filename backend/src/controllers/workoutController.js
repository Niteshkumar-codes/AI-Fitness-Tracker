// Import the Workout model to interact with the workouts collection
const Workout = require('../models/Workout');

/**
 * Controller: Add a new workout
 * HTTP POST Request Handler
 * 
 * Request body should contain:
 * - workoutType: Type of exercise (Running, Cycling, etc.)
 * - duration: Time spent in minutes
 * - caloriesBurned: Estimated calories burned
 * - notes: Optional workout notes
 * - workoutDate: Optional date of the workout (defaults to current date)
 * 
 * Returns the newly created workout document on success
 * Sends appropriate error messages on validation or database failure
 */
const addWorkout = async (req, res) => {
  try {
    // Extract workout details from the request body
    const { workoutType, duration, caloriesBurned, notes, workoutDate } = req.body;

    // Validate that all required fields are provided
    if (!workoutType || !duration || caloriesBurned === undefined) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide workoutType, duration, and caloriesBurned',
      });
    }

    // Create a new Workout object with user ID from authenticated request
    // req.userId comes from authMiddleware after JWT verification
    const newWorkout = new Workout({
      user: req.userId,
      workoutType,
      duration,
      caloriesBurned,
      notes: notes || '',
      workoutDate: workoutDate || new Date(),
    });

    // Save the new workout to the database
    const savedWorkout = await newWorkout.save();

    // Return success response with the created workout
    return res.status(201).json({
      success: true,
      message: 'Workout added successfully',
      data: savedWorkout,
    });
  } catch (error) {
    // Handle validation errors from mongoose schema
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    // Handle any other unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Error adding workout',
      error: error.message,
    });
  }
};

/**
 * Controller: Get all workouts for the authenticated user
 * HTTP GET Request Handler
 * 
 * Retrieves all workouts belonging to the authenticated user
 * Results are sorted by workoutDate in descending order (newest first)
 * 
 * Returns an array of workout documents
 * Each workout includes all fields and timestamps
 */
const getWorkouts = async (req, res) => {
  try {
    // Fetch all workouts for the authenticated user from the database
    // Sort by workoutDate in descending order (most recent first)
    // -1 means descending order, 1 would mean ascending order
    const workouts = await Workout.find({ user: req.userId })
      .sort({ workoutDate: -1 })
      .exec();

    // Return success response with the fetched workouts
    return res.status(200).json({
      success: true,
      message: 'Workouts fetched successfully',
      data: workouts,
      total: workouts.length,
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Error fetching workouts',
      error: error.message,
    });
  }
};

/**
 * Controller: Delete a specific workout
 * HTTP DELETE Request Handler
 * 
 * URL parameter should contain:
 * - id: The MongoDB ObjectId of the workout to delete
 * 
 * Security: User can only delete their own workouts
 * Verifies that the workout belongs to the authenticated user before deletion
 * 
 * Returns success message on deletion
 * Returns 404 if workout not found
 * Returns 403 if workout doesn't belong to the user
 */
const deleteWorkout = async (req, res) => {
  try {
    // Extract the workout ID from the URL parameter
    const { id } = req.params;

    // Find the workout by ID and verify it belongs to the authenticated user
    const workout = await Workout.findById(id);

    // Check if the workout exists in the database
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found',
      });
    }

    // Security check: Ensure the workout belongs to the authenticated user
    // Convert both to strings for comparison since ObjectId comparison can be tricky
    if (workout.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this workout',
      });
    }

    // Delete the workout from the database
    await Workout.findByIdAndDelete(id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Workout deleted successfully',
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
      });
    }

    // Handle any other unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Error deleting workout',
      error: error.message,
    });
  }
};

// Export all controller functions for use in routes
module.exports = {
  addWorkout,
  getWorkouts,
  deleteWorkout,
};
