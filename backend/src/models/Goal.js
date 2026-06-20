// Goal model: stores user fitness goals
// CommonJS + Mongoose schema suitable for MERN projects
const mongoose = require('mongoose');

const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    // Reference to the User who owns this goal
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Type of goal the user has set
    goalType: {
      type: String,
      enum: ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Maintenance'],
      required: true,
    },

    // Weight-related targets (kg or lbs depending on app settings)
    targetWeight: { type: Number, required: true },
    currentWeight: { type: Number, required: true },

    // Daily caloric target to support the goal (optional)
    targetCalories: { type: Number },

    // When the goal starts (defaults to now)
    startDate: { type: Date, default: Date.now },

    // Target date to reach the goal (optional)
    targetDate: { type: Date },

    // Status of the goal
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Goal', goalSchema);
