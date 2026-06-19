// Import the Food model to interact with the food collection
const Food = require('../models/Food');

/**
 * Controller: Add a new food entry
 * HTTP POST Request Handler
 * 
 * Request body should contain:
 * - foodName: Name of the food item (e.g., Oatmeal, Banana)
 * - calories: Calories in kcal
 * - protein: Protein in grams
 * - carbs: Carbohydrates in grams
 * - fats: Fats in grams
 * - mealType: Breakfast, Lunch, Dinner, or Snack
 * - foodDate: Optional date of consumption (defaults to current date)
 * 
 * Returns the newly created food document on success
 * Sends appropriate error messages on validation or database failure
 */
const addFood = async (req, res) => {
  try {
    // Extract food details from the request body
    const { foodName, calories, protein, carbs, fats, mealType, foodDate } = req.body;

    // Validate that all required fields are provided
    if (!foodName || calories === undefined || protein === undefined || carbs === undefined || fats === undefined || !mealType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide foodName, calories, protein, carbs, fats, and mealType',
      });
    }

    // Create a new Food object with user ID from authenticated request
    // req.userId comes from authMiddleware after JWT verification
    const newFood = new Food({
      user: req.userId,
      foodName,
      calories,
      protein,
      carbs,
      fats,
      mealType,
      foodDate: foodDate || new Date(),
    });

    // Save the new food entry to the database
    const savedFood = await newFood.save();

    // Return success response with the created food entry
    return res.status(201).json({
      success: true,
      message: 'Food entry added successfully',
      data: savedFood,
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
      message: 'Error adding food entry',
      error: error.message,
    });
  }
};

/**
 * Controller: Get all food entries for the authenticated user
 * HTTP GET Request Handler
 * 
 * Retrieves all food entries belonging to the authenticated user
 * Results are sorted by foodDate in descending order (newest first)
 * 
 * Returns an array of food documents
 */
const getFoods = async (req, res) => {
  try {
    // Fetch all food entries for the authenticated user from the database
    // Sort by foodDate in descending order (most recent first)
    const foods = await Food.find({ user: req.userId })
      .sort({ foodDate: -1 })
      .exec();

    // Return success response with the fetched food entries
    return res.status(200).json({
      success: true,
      message: 'Food entries fetched successfully',
      data: foods,
      total: foods.length,
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Error fetching food entries',
      error: error.message,
    });
  }
};

/**
 * Controller: Delete a specific food entry
 * HTTP DELETE Request Handler
 * 
 * URL parameter should contain:
 * - id: The MongoDB ObjectId of the food entry to delete
 * 
 * Security: User can only delete their own food entries
 * Verifies that the food entry belongs to the authenticated user before deletion
 */
const deleteFood = async (req, res) => {
  try {
    // Extract the food ID from the URL parameter
    const { id } = req.params;

    // Find the food entry by ID
    const food = await Food.findById(id);

    // Check if the food entry exists in the database
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food entry not found',
      });
    }

    // Security check: Ensure the food entry belongs to the authenticated user
    if (food.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this food entry',
      });
    }

    // Delete the food entry from the database
    await Food.findByIdAndDelete(id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Food entry deleted successfully',
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID format',
      });
    }

    // Handle any other unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Error deleting food entry',
      error: error.message,
    });
  }
};

// Export all controller functions for use in routes
module.exports = {
  addFood,
  getFoods,
  deleteFood,
};
