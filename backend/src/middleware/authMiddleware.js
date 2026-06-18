// Import jsonwebtoken to verify tokens
const jwt = require('jsonwebtoken');

// Import the User model to fetch user details
const User = require('../models/User');

/**
 * Middleware to protect routes by verifying JWT token
 * Checks if a valid token exists in the Authorization header
 * Attaches authenticated user to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    // Header format: "Bearer <token>"
    let token = req.headers.authorization;

    // Check if Authorization header exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login to access this resource.',
      });
    }

    // Remove "Bearer " prefix from token if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7); // Remove the first 7 characters ("Bearer ")
    }

    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the ID from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.',
      });
    }

    // Attach the user object to the request for use in controllers
    req.user = user;
    req.userId = decoded.id;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error verifying token',
      error: error.message,
    });
  }
};

// Export the middleware for use in route protection
module.exports = authMiddleware;
