// Import mongoose to create database models and schemas
const mongoose = require('mongoose');

/**
 * Food Schema
 * Defines the structure of a food intake document in the MongoDB database
 * Includes nutritional details (calories, protein, carbs, fats), user reference, and timestamps
 */
const foodSchema = new mongoose.Schema(
  {
    // Reference to the User who logged this food entry
    // This creates a relationship between Food and User collections
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Name of the food item (e.g., Oatmeal, Grilled Chicken, Banana)
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: [100, 'Food name cannot exceed 100 characters'],
    },

    // Calories in kcal
    calories: {
      type: Number,
      required: [true, 'Calories is required'],
      min: [0, 'Calories cannot be negative'],
      max: [5000, 'Calories seem unrealistic, please verify'],
    },

    // Protein content in grams
    protein: {
      type: Number,
      required: [true, 'Protein content is required'],
      min: [0, 'Protein cannot be negative'],
      max: [500, 'Protein content seems unrealistic, please verify'],
    },

    // Carbohydrates content in grams
    carbs: {
      type: Number,
      required: [true, 'Carbohydrates content is required'],
      min: [0, 'Carbohydrates cannot be negative'],
      max: [1000, 'Carbohydrates content seems unrealistic, please verify'],
    },

    // Fats content in grams
    fats: {
      type: Number,
      required: [true, 'Fats content is required'],
      min: [0, 'Fats cannot be negative'],
      max: [500, 'Fats content seems unrealistic, please verify'],
    },

    // Type of meal (Breakfast, Lunch, Dinner, Snack)
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      trim: true,
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        message: '{VALUE} is not a supported meal type. Choose from: Breakfast, Lunch, Dinner, Snack',
      },
    },

    // Date when the food was consumed
    // If not provided, defaults to the current date and time
    foodDate: {
      type: Date,
      required: [true, 'Food date is required'],
      default: Date.now,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create an index on the user field for faster queries when fetching user-specific foods
foodSchema.index({ user: 1, foodDate: -1 });

// Export the Food model for use in controllers and routes
module.exports = mongoose.model('Food', foodSchema);
