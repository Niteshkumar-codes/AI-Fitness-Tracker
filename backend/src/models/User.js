// Import mongoose to create database models
const mongoose = require('mongoose');

// Import bcryptjs for hashing passwords securely
const bcrypt = require('bcryptjs');

// Define the User schema with all required fields for fitness tracking
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },

    // User's email address (unique to prevent duplicate accounts)
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },

    // User's password (will be hashed before saving)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },

    // User's profile image URL (optional)
    profileImage: {
      type: String,
      default: null,
    },

    // User's age in years
    age: {
      type: Number,
      min: [13, 'You must be at least 13 years old'],
      max: [120, 'Invalid age'],
    },

    // User's gender
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other', 'prefer not to say'],
        message: '{VALUE} is not a supported gender option',
      },
      default: 'prefer not to say',
      set: function (val) {
        if (typeof val !== 'string') return val;
        const normalized = val.trim().toLowerCase();
        if (normalized === 'male') return 'Male';
        if (normalized === 'female') return 'Female';
        if (normalized === 'other') return 'Other';
        return val;
      },
    },

    // User's height in centimeters
    height: {
      type: Number,
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height cannot exceed 250 cm'],
    },

    // User's weight in kilograms
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20 kg'],
      max: [500, 'Weight cannot exceed 500 kg'],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Middleware: Hash password before saving to the database
// This runs automatically when a user is created or password is modified
userSchema.pre('save', async function () {
  // If password is not modified, skip hashing and exit early
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Generate a salt for hashing (higher number = more secure but slower)
    const salt = await bcrypt.genSalt(10);

    // Hash the password using bcrypt
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Throw error so Mongoose aborts save and handles it
    throw error;
  }
});

// Method: Compare a plain text password with the hashed password in the database
// Used during login to verify credentials
userSchema.methods.matchPassword = async function (passwordToCompare) {
  return await bcrypt.compare(passwordToCompare, this.password);
};

// Create and export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
