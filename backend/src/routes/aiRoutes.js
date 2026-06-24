const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Import controller functions
const { getRecommendations, getWorkoutPlan, analyzeFoodImage } = require('../controllers/aiController');

// Import authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/ai/recommendations
 * @desc    Fetch personalized health and fitness recommendations from Gemini AI
 * @access  Private
 */
router.get('/recommendations', authMiddleware, getRecommendations);

/**
 * @route   GET /api/ai/workout-plan
 * @desc    Fetch personalized 7-day workout plan from Gemini AI
 * @access  Private
 */
router.get('/workout-plan', authMiddleware, getWorkoutPlan);

/**
 * @route   POST /api/ai/analyze-food-image
 * @desc    Analyze a food image and return nutritional values using Gemini Vision
 * @access  Private
 */
router.post('/analyze-food-image', authMiddleware, upload.single('image'), analyzeFoodImage);

module.exports = router;
