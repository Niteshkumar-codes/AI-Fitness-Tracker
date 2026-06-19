// Import mongoose to create database models and schemas
const mongoose = require('mongoose');

/**
 * Workout Schema
 * Defines the structure of a workout document in the MongoDB database
 * Includes exercise details, user reference, and timestamps for tracking changes
 */
const workoutSchema = new mongoose.Schema(
  {
    // Reference to the User who performed this workout
    // This creates a relationship between Workout and User collections
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Type of workout performed (e.g., Running, Cycling, Yoga, Gym)
    workoutType: {
      type: String,
      required: [true, 'Workout type is required'],
      trim: true,
      enum: {
        values: [
          'Running',
          'Cycling',
          'Swimming',
          'Yoga',
          'Gym',
          'Walking',
          'Hiking',
          'HIIT',
          'Sports',
          'Other',
        ],
        message:
          '{VALUE} is not a supported workout type. Choose from: Running, Cycling, Swimming, Yoga, Gym, Walking, Hiking, HIIT, Sports, Other',
      },
    },

    // Duration of the workout in minutes
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [1440, 'Duration cannot exceed 24 hours (1440 minutes)'],
    },

    // Number of calories burned during the workout
    caloriesBurned: {
      type: Number,
      required: [true, 'Calories burned is required'],
      min: [0, 'Calories burned cannot be negative'],
      max: [10000, 'Calories burned seems unrealistic, please verify'],
    },

    // Additional notes or details about the workout
    // This is optional and can contain information like difficulty level, mood, or personal notes
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },

    // Date when the workout was performed
    // If not provided, defaults to the current date and time
    workoutDate: {
      type: Date,
      required: [true, 'Workout date is required'],
      default: Date.now,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    // createdAt: when the document was created
    // updatedAt: when the document was last modified
    timestamps: true,
  }
);

// Create an index on the user field for faster queries when fetching user-specific workouts
workoutSchema.index({ user: 1, workoutDate: -1 });

// Export the Workout model for use in controllers and routes
// 'Workout' is the model name, 'workoutSchema' is the schema definition
module.exports = mongoose.model('Workout', workoutSchema);
