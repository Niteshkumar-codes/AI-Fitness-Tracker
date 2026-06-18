// Import jsonwebtoken to create and verify tokens
const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token (JWT) for a user
 * The token is used to authenticate subsequent requests without passwords
 *
 * @param {string} userId - The user's MongoDB ObjectId
 * @returns {string} - The signed JWT token
 */
function generateToken(userId) {
  // Create a token that expires in 7 days
  const token = jwt.sign(
    { id: userId }, // Payload: data embedded in the token
    process.env.JWT_SECRET, // Secret key from environment variables
    { expiresIn: '7d' } // Token validity period
  );

  return token;
}

// Export the token generation function for use in controllers
module.exports = generateToken;
