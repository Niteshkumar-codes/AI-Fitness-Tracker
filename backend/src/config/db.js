// Import mongoose using CommonJS syntax
const mongoose = require('mongoose');

// Async function to connect to MongoDB using Mongoose
async function connectDB() {
  try {
    // Read the MongoDB connection URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    console.log('  📋 Reading MONGODB_URI from environment...');

    if (!mongoURI) {
      // If the connection string is missing, throw an error so the app does not start incorrectly
      console.error('  ❌ MONGODB_URI is undefined');
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    console.log('  ✅ MONGODB_URI found');
    console.log('  🔐 Connecting with credentials: emsadmin@cluster0...');

    // Connect to MongoDB using latest Mongoose syntax (v6.0+)
    // Deprecated options (useNewUrlParser, useUnifiedTopology) are removed
    // Mongoose 6.0+ handles these automatically
    await mongoose.connect(mongoURI);

    // Log success once the database connection is established
    console.log('  ✅ MongoDB connection established successfully');
    console.log('  🗄️  Database: ai_fitness_tracker');
    
    return true;
  } catch (error) {
    // Log the error with full details to help diagnose connection issues
    console.error('\n  ❌ MongoDB Connection Failed:');
    console.error('  Error Message:', error.message);
    console.error('  Error Code:', error.code);
    console.error('  Error Name:', error.name);
    if (error.reason) {
      console.error('  Reason:', error.reason);
    }
    console.error('\n  📝 Troubleshooting tips:');
    console.error('     1. Check if MongoDB Atlas cluster is running');
    console.error('     2. Verify network access is allowed for your IP');
    console.error('     3. Verify username and password are correct');
    console.error('     4. Check cluster URL is correct\n');
    
    // Exit the process to avoid running the server without a database connection
    process.exit(1);
  }
}

// Export the connection function so it can be used in server.js or other startup files
module.exports = connectDB;
