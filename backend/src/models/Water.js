// Import mongoose to create database models and schemas
const mongoose = require('mongoose');

/**
 * Water Schema
 * Defines the structure of a water intake log entry in the MongoDB database
 * Includes the amount in milliliters, date of consumption, user reference, and timestamps
 */
const waterSchema = new mongoose.Schema(
  {
    // Reference to the User who logged this water intake
    // Creates a relationship between Water and User collections
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Amount of water consumed in milliliters (ml)
    amount: {
      type: Number,
      required: [true, 'Water amount (in ml) is required'],
      min: [1, 'Water amount must be at least 1 ml'],
      max: [10000, 'Water amount seems unrealistic, please verify'],
    },

    // Date and time when the water was consumed
    // Defaults to current timestamp if not specified
    intakeDate: {
      type: Date,
      required: [true, 'Intake date is required'],
      default: Date.now,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create an index on user and intakeDate fields for faster querying and sorting
waterSchema.index({ user: 1, intakeDate: -1 });

// Export the Water model for use in controllers and routes
module.exports = mongoose.model('Water', waterSchema);
