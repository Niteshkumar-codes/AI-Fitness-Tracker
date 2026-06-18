// Import the User model to interact with the database
const User = require('../models/User');

// Import the token generation utility
const generateToken = require('../utils/generateToken');

/**
 * Register a new user
 * POST /api/auth/register
 *
 * Expected request body:
 * {
 *   name: string,
 *   email: string,
 *   password: string (min 6 chars),
 *   age: number,
 *   gender: string,
 *   height: number,
 *   weight: number
 * }
 */
const registerUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, password, age, gender, height, weight, profileImage } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create a new user document
    const user = new User({
      name,
      email,
      password,
      age: age || null,
      gender: gender || 'prefer not to say',
      height: height || null,
      weight: weight || null,
      profileImage: profileImage || null,
    });

    // Save the user to the database (triggers password hashing middleware)
    await user.save();

    // Generate a JWT token for automatic login after registration
    const token = generateToken(user._id);

    // Return success response with token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error in registerUser:', error.message);

    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message,
    });
  }
};

/**
 * Login an existing user
 * POST /api/auth/login
 *
 * Expected request body:
 * {
 *   email: string,
 *   password: string
 * }
 */
const loginUser = async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email and include password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare the provided password with the hashed password in database
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate a JWT token for the authenticated user
    const token = generateToken(user._id);

    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error in loginUser:', error.message);

    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

/**
 * Get authenticated user's profile
 * GET /api/auth/profile
 * Requires valid JWT token in Authorization header
 */
const getProfile = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    const user = req.user;

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error in getProfile:', error.message);

    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// Export all authentication controller functions
module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
