// Load environment variables from .env file into process.env
console.log('📂 Loading environment variables from .env...');
require('dotenv').config();
console.log('✅ Environment variables loaded successfully');

// Import the Express library using CommonJS syntax
const express = require('express');
console.log('📦 Express library imported');

// Import the MongoDB connection function
const connectDB = require('./src/config/db');
console.log('📦 MongoDB connection function imported');

// Import authentication routes for user registration, login, and profile management
const authRoutes = require('./src/routes/authRoutes');
console.log('📦 Authentication routes imported');

// Import workout routes for workout tracking and management
const workoutRoutes = require('./src/routes/workoutRoutes');
console.log('📦 Workout routes imported');

// Import food routes for food intake tracking and management
const foodRoutes = require('./src/routes/foodRoutes');
console.log('📦 Food routes imported');

// Create a new Express application instance
const app = express();
console.log('🚀 Express app instance created');

// ============ MIDDLEWARE CONFIGURATION ============
// Enable express.json() middleware to parse incoming JSON requests
// This allows the server to automatically parse JSON request bodies
app.use(express.json());
console.log('⚙️  JSON middleware enabled');

// ============ ROUTES ============
// Define a GET route for the root path '/' that serves as a health check
// This route returns a JSON response indicating the server is running
app.get('/', (req, res) => {
  res.json({
    message: 'AI Fitness Tracker API Running...',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
});
console.log('📍 Health-check route (GET /) registered');

// ============ AUTHENTICATION ROUTES ============
// Register authentication routes for user management
// Available endpoints:
//   POST /api/auth/register - Register a new user
//   POST /api/auth/login - Login and receive JWT token
//   GET /api/auth/profile - Get authenticated user profile (requires token)
app.use('/api/auth', authRoutes);
console.log('🔐 Authentication routes registered at /api/auth');

// ============ WORKOUT ROUTES ============
// Register workout routes for tracking workouts
// Available endpoints:
//   POST /api/workouts - Add a new workout (requires token)
//   GET /api/workouts - Get all workouts for the authenticated user (requires token)
//   DELETE /api/workouts/:id - Delete a specific workout (requires token)
app.use('/api/workouts', workoutRoutes);
console.log('🏋️‍♂️ Workout routes registered at /api/workouts');

// ============ FOOD ROUTES ============
// Register food routes for tracking nutrition and meals
// Available endpoints:
//   POST /api/foods - Add a new food entry (requires token)
//   GET /api/foods - Get all food entries for the authenticated user (requires token)
//   DELETE /api/foods/:id - Delete a specific food entry (requires token)
app.use('/api/foods', foodRoutes);
console.log('🍎 Food routes registered at /api/foods');

// ============ SERVER STARTUP ============
// Read the port from environment variables with a fallback to port 5000
const PORT = process.env.PORT || 5000;
console.log(`🔧 PORT configuration: ${PORT}`);

// Main async function to start the server and connect to the database
async function startServer() {
  try {
    console.log('\n========== STARTING SERVER ==========');
    console.log('⏳ Attempting to connect to MongoDB...');
    
    // Connect to MongoDB before starting the server
    // This ensures the database is available before accepting requests
    await connectDB();
    
    console.log('✅ MongoDB connection successful!\n');

    // Start the Express server and listen on the specified port
    app.listen(PORT, () => {
      console.log('========== SERVER ONLINE ==========');
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}`);
      console.log(`🗄️  Database: MongoDB Atlas (ai_fitness_tracker)`);
      console.log('====================================\n');
    });
  } catch (error) {
    // Log any errors that occur during startup with full error details
    console.error('\n========== SERVER STARTUP FAILED ==========');
    console.error('❌ Error occurred during startup:');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('=========================================\n');
    // Exit the process with error code 1 to indicate failure
    process.exit(1);
  }
}

// Call the startup function to initialize the server
console.log('🎯 Invoking startServer() function...\n');
startServer();
