/**
 * src/controllers/aiController.js
 * 
 * Gemini AI Health Coach Controller
 * Collects user metrics, calculates health values, and invokes the Gemini model
 * to obtain beginner-friendly recommendations.
 */

const User = require('../models/User');
const Workout = require('../models/Workout');
const Food = require('../models/Food');
const Goal = require('../models/Goal');
const Water = require('../models/Water');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Fetch tailored health and fitness recommendations from Gemini AI
 * GET /api/ai/recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Fetch user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please log in again.',
      });
    }

    // 2. Setup today's start and end times in local server time
    const targetDate = new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 3. Query all user logs concurrently
    const [workoutsToday, foodToday, waterToday, activeGoals] = await Promise.all([
      Workout.find({ user: userId, workoutDate: { $gte: startOfDay, $lte: endOfDay } }),
      Food.find({ user: userId, foodDate: { $gte: startOfDay, $lte: endOfDay } }),
      Water.find({ user: userId, intakeDate: { $gte: startOfDay, $lte: endOfDay } }),
      Goal.find({ user: userId, status: 'Active' }),
    ]);

    // 4. Calculate health statistics
    // Body Mass Index (BMI): weight (kg) / (height (m) ^ 2)
    let roundedBmi = null;
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      roundedBmi = parseFloat(bmi.toFixed(2));
    }

    // Today's total nutritional and logging aggregates
    const caloriesConsumed = foodToday.reduce((sum, f) => sum + f.calories, 0);
    const caloriesBurned = workoutsToday.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const waterIntakeTotal = waterToday.reduce((sum, w) => sum + w.amount, 0);
    const activeGoalsCount = activeGoals.length;

    // 5. Check if API Key is configured in environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI recommendations are currently unavailable. Gemini API key is not configured.',
      });
    }

    // 6. Initialize Gemini Client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 7. Construct Prompt with rich data
    const prompt = `You are an expert fitness coach.

Analyze the user's fitness data and provide:

1. Health Summary
2. BMI Analysis
3. Diet Recommendations
4. Workout Recommendations
5. Hydration Recommendations
6. Goal Improvement Suggestions

Keep response practical and beginner-friendly.
Return plain text recommendations.

User's Fitness Data:
- Name: ${user.name}
- Age: ${user.age || 'Not provided'}
- Gender: ${user.gender || 'Not provided'}
- Height: ${user.height ? `${user.height} cm` : 'Not provided'}
- Weight: ${user.weight ? `${user.weight} kg` : 'Not provided'}
- Calculated BMI: ${roundedBmi !== null ? roundedBmi : 'Not available (profile height/weight incomplete)'}

Active Goals:
- Active Goals Count: ${activeGoalsCount}
${activeGoals.length > 0 ? activeGoals.map(g => `- ${g.goalType}: Target Weight ${g.targetWeight} kg, Current Weight ${g.currentWeight} kg, Target Calories ${g.targetCalories || 'N/A'} kcal`).join('\n') : '- No active goals logged'}

Today's Food Intake:
- Total Calories Consumed: ${caloriesConsumed} kcal
${foodToday.length > 0 ? foodToday.map(f => `- ${f.foodName} (${f.mealType}): ${f.calories} kcal, Protein: ${f.protein}g, Carbs: ${f.carbs}g, Fats: ${f.fats}g`).join('\n') : '- No food items logged today'}

Today's Workout Logs:
- Total Calories Burned: ${caloriesBurned} kcal
${workoutsToday.length > 0 ? workoutsToday.map(w => `- ${w.workoutType}: Duration ${w.duration} mins, Burned ${w.caloriesBurned} kcal. Notes: ${w.notes || 'None'}`).join('\n') : '- No workouts logged today'}

Today's Water Intake:
- Total Water Intake: ${waterIntakeTotal} ml`;

    // 8. Generate Recommendations using Gemini AI
    const result = await model.generateContent(prompt);
    const recommendationsText = result.response.text();

    // 9. Send API Response
    return res.status(200).json({
      success: true,
      data: {
        bmi: roundedBmi,
        recommendations: recommendationsText,
      },
    });
  } catch (error) {
    console.error('Error in Gemini AI Coach controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while generating recommendations.',
      error: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
};
