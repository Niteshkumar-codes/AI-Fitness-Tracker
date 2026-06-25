// Load environment variables from .env file into process.env
console.log('📂 Loading environment variables from .env...');
require('dotenv').config();
console.log('✅ Environment variables loaded successfully');

// Import the Express library using CommonJS syntax
const express = require('express');
console.log('📦 Express library imported');

// Import CORS library to allow cross-origin requests from the React frontend
const cors = require('cors');
console.log('📦 CORS library imported');

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

// Import goal routes for goal tracking and management
const goalRoutes = require('./src/routes/goalRoutes');
console.log('📦 Goal routes imported');

// Import analytics routes for health stats and dashboard analytics
const analyticsRoutes = require('./src/routes/analyticsRoutes');
console.log('📦 Analytics routes imported');

// Import water intake routes for logging water consumption
const waterRoutes = require('./src/routes/waterRoutes');
console.log('📦 Water routes imported');

// Import Gemini AI health coach routes
const aiRoutes = require('./src/routes/aiRoutes');
console.log('📦 AI routes imported');


// Create a new Express application instance
const app = express();
console.log('🚀 Express app instance created');

// ============ MIDDLEWARE CONFIGURATION ============
// Enable CORS for allowed origins: http://localhost:5173 and the deployed Vercel app
const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-fitness-tracker-henna.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, or Thunder Client)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  })
);
console.log('⚙️  CORS middleware enabled for allowed origins');

// Enable express.json() middleware to parse incoming JSON requests
// This allows the server to automatically parse JSON request bodies
app.use(express.json());
console.log('⚙️  JSON middleware enabled');

// Register static serving for uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('⚙️  Static uploads serving middleware enabled');

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

// ============ GOAL ROUTES ============
// Register goal routes for tracking user fitness goals
// Available endpoints:
//   POST /api/goals - Create a new goal (requires token)
//   GET  /api/goals - Get all goals for the authenticated user (requires token)
//   PUT  /api/goals/:id - Update a specific goal (requires token)
//   DELETE /api/goals/:id - Delete a specific goal (requires token)
app.use('/api/goals', goalRoutes);
console.log('🎯 Goal routes registered at /api/goals');

// ============ ANALYTICS ROUTES ============
// Register health analytics routes (BMI calculator, daily/lifetime dashboard statistics)
// Available endpoints:
//   GET /api/analytics/bmi - Calculate BMI (requires token)
//   GET /api/analytics/dashboard - Retrieve dashboard stats (requires token)
app.use('/api/analytics', analyticsRoutes);
console.log('📊 Analytics routes registered at /api/analytics');

// ============ WATER INTAKE ROUTES ============
// Register water intake routes for logging water and tracking daily stats
// Available endpoints:
//   POST   /api/water - Add water intake log (requires token)
//   GET    /api/water - Retrieve user's water logs (requires token)
//   GET    /api/water/stats - Retrieve user's daily water stats & goals (requires token)
//   DELETE /api/water/:id - Delete a specific water log (requires token)
app.use('/api/water', waterRoutes);
console.log('💧 Water routes registered at /api/water');

// ============ GEMINI AI HEALTH COACH ROUTES ============
// Register AI health coach routes
// Available endpoints:
//   GET /api/ai/recommendations - Retrieve fitness recommendations (requires token)
app.use('/api/ai', aiRoutes);
console.log('🤖 AI Health Coach routes registered at /api/ai');


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
