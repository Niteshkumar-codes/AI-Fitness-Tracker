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
    // Log detailed error information for debugging
    console.error('Error in registerUser:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Complete Error Object:', error);
    console.error('Stack Trace:', error.stack);

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

/**
 * Update authenticated user's profile
 * PUT /api/auth/profile
 * Requires valid JWT token in Authorization header
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, age, gender, height, weight } = req.body;

    // Validate name
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters.',
        });
      }
    }

    // Validate age
    if (age !== undefined && age !== null && age !== '') {
      const numAge = Number(age);
      if (isNaN(numAge) || numAge < 13 || numAge > 120) {
        return res.status(400).json({
          success: false,
          message: 'Age must be between 13 and 120.',
        });
      }
    }

    // Validate height
    if (height !== undefined && height !== null && height !== '') {
      const numHeight = Number(height);
      if (isNaN(numHeight) || numHeight < 100 || numHeight > 250) {
        return res.status(400).json({
          success: false,
          message: 'Height must be between 100 cm and 250 cm.',
        });
      }
    }

    // Validate weight
    if (weight !== undefined && weight !== null && weight !== '') {
      const numWeight = Number(weight);
      if (isNaN(numWeight) || numWeight < 20 || numWeight > 500) {
        return res.status(400).json({
          success: false,
          message: 'Weight must be between 20 kg and 500 kg.',
        });
      }
    }

    // Validate gender
    if (gender !== undefined && gender !== null) {
      const normalizedGender = String(gender).trim().toLowerCase();
      const validGenders = ['male', 'female', 'other', 'prefer not to say'];
      if (!validGenders.includes(normalizedGender)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid gender value. Supported: Male, Female, Other, Prefer Not To Say',
        });
      }
    }

    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Update fields
    if (name !== undefined) user.name = name.trim();
    if (age !== undefined) {
      user.age = (age === null || age === '') ? null : Number(age);
    }
    if (gender !== undefined) {
      user.gender = gender;
    }
    if (height !== undefined) {
      user.height = (height === null || height === '') ? null : Number(height);
    }
    if (weight !== undefined) {
      user.weight = (weight === null || weight === '') ? null : Number(weight);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
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
    console.error('Error in updateProfile:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// Export all authentication controller functions
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
