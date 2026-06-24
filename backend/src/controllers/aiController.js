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
// Helper to determine BMI Category
const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

// Local recommendation generation helper
const generateLocalFallbackRecommendations = (user, bmi, caloriesConsumed, caloriesBurned, waterIntakeTotal, activeGoals) => {
  let text = `### Health & Fitness Report (Automated Fallback)

Hello ${user.name || 'User'}, our AI Service is temporarily experiencing high traffic, so we have compiled a personalized report based on your local metrics:

1. **BMI & Physical Metrics**
   - Height: ${user.height ? `${user.height} cm` : 'Not provided'}
   - Weight: ${user.weight ? `${user.weight} kg` : 'Not provided'}
   - Body Mass Index (BMI): ${bmi !== null ? `${bmi} (${getBmiCategory(bmi)})` : 'Not available'}

2. **Nutrition Summary (Today)**
   - Calories Consumed: ${caloriesConsumed} kcal`;
  if (caloriesConsumed > 2500) {
    text += `\n   - *Tip*: Your caloric intake is on the higher side. Make sure it aligns with your active goals.`;
  } else if (caloriesConsumed < 1500 && caloriesConsumed > 0) {
    text += `\n   - *Tip*: Your caloric intake is relatively low. Ensure you are getting enough macro/micronutrients.`;
  } else if (caloriesConsumed === 0) {
    text += `\n   - *Tip*: You haven't logged any meals today. Logging meals regularly helps track nutritional balance.`;
  }

  text += `\n\n3. **Activity Summary (Today)**
   - Calories Burned: ${caloriesBurned} kcal`;
  if (caloriesBurned > 500) {
    text += `\n   - *Tip*: Excellent activity level today! Keep up the great work.`;
  } else if (caloriesBurned === 0) {
    text += `\n   - *Tip*: No workouts logged today. Try to get at least 15-30 minutes of light exercise.`;
  }

  text += `\n\n4. **Hydration Summary (Today)**
   - Water Intake: ${waterIntakeTotal} ml`;
  if (waterIntakeTotal >= 2000) {
    text += `\n   - *Tip*: Great hydration! Keep maintaining this daily intake.`;
  } else {
    text += `\n   - *Tip*: Try to drink more water today. The recommended target is at least 2000 ml.`;
  }

  text += `\n\n5. **Active Goals**
   - Active Goals Count: ${activeGoals.length}`;
  if (activeGoals.length > 0) {
    activeGoals.forEach(g => {
      text += `\n   - *${g.goalType}*: Current weight is ${g.currentWeight} kg, target is ${g.targetWeight} kg. Daily target: ${g.targetCalories || 'N/A'} kcal.`;
    });
  } else {
    text += `\n   - *Tip*: You don't have any active goals set. Setting a goal (e.g. Weight Loss or Muscle Gain) helps tailor recommendations.`;
  }

  return text;
};

// Local workout plan generation helper
const generateLocalFallbackWorkoutPlan = (user, bmi, activeGoals) => {
  let text = `### 7-Day Workout Plan (Automated Fallback)

Hello ${user.name || 'User'}, our AI Service is temporarily experiencing high traffic, so we have compiled a 7-day personalized workout plan based on your metrics:

User Metrics:
- Height: ${user.height ? `${user.height} cm` : 'Not provided'}
- Weight: ${user.weight ? `${user.weight} kg` : 'Not provided'}
- BMI: ${bmi !== null ? `${bmi} (${getBmiCategory(bmi)})` : 'Not available'}

Active Goal: ${activeGoals.length > 0 ? activeGoals[0].goalType : 'General Fitness'}

Weekly Schedule:
- **Day 1: Full Body Strength** (30 mins) - Focus on Squats, Push-ups, and Planks.
- **Day 2: Cardio Endurance** (30 mins) - Brisk walking, cycling, or jogging.
- **Day 3: Core & Upper Body** (30 mins) - Planks, Bird-dog, knee push-ups.
- **Day 4: Rest / Active Recovery** - Gentle stretching or walking.
- **Day 5: Lower Body & Glutes** (30 mins) - Lunges, glute bridges, calf raises.
- **Day 6: Cardiovascular Intervals** (25 mins) - Light running intervals or cycling.
- **Day 7: Rest Day** - Complete rest.

*Beginner-friendly notes*: Keep movements controlled. Stay hydrated. Rest if you feel any sharp pain.`;
  return text;
};

// Helper for calling Gemini with retry and exponential backoff
const callGeminiWithRetry = async (model, prompt, retries = 3, initialDelay = 1000) => {
  let delay = initialDelay;
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if (i === retries) {
        throw err;
      }
      console.warn(`Gemini call failed (attempt ${i + 1}/${retries + 1}), retrying in ${delay}ms... Error: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

/**
 * Fetch tailored health and fitness recommendations from Gemini AI
 * GET /api/ai/recommendations
 */
const getRecommendations = async (req, res) => {
  let user, roundedBmi, caloriesConsumed, caloriesBurned, waterIntakeTotal, activeGoals;
  try {
    const userId = req.userId;

    // 1. Fetch user profile
    user = await User.findById(userId);
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
    let workoutsToday, foodToday, waterToday;
    [workoutsToday, foodToday, waterToday, activeGoals] = await Promise.all([
      Workout.find({ user: userId, workoutDate: { $gte: startOfDay, $lte: endOfDay } }),
      Food.find({ user: userId, foodDate: { $gte: startOfDay, $lte: endOfDay } }),
      Water.find({ user: userId, intakeDate: { $gte: startOfDay, $lte: endOfDay } }),
      Goal.find({ user: userId, status: 'Active' }),
    ]);

    // 4. Calculate health statistics
    // Body Mass Index (BMI): weight (kg) / (height (m) ^ 2)
    roundedBmi = null;
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      roundedBmi = parseFloat(bmi.toFixed(2));
    }

    // Today's total nutritional and logging aggregates
    caloriesConsumed = foodToday.reduce((sum, f) => sum + f.calories, 0);
    caloriesBurned = workoutsToday.reduce((sum, w) => sum + w.caloriesBurned, 0);
    waterIntakeTotal = waterToday.reduce((sum, w) => sum + w.amount, 0);
    const activeGoalsCount = activeGoals.length;

    // 5. Check if API Key is configured in environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key is not configured. Falling back to local recommendations.');
      const fallbackText = generateLocalFallbackRecommendations(user, roundedBmi, caloriesConsumed, caloriesBurned, waterIntakeTotal, activeGoals);
      return res.status(200).json({
        success: true,
        source: 'fallback',
        data: {
          recommendations: fallbackText,
        },
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

    // 8. Generate Recommendations using Gemini AI with retry and exponential backoff
    const recommendationsText = await callGeminiWithRetry(model, prompt);

    // 9. Send API Response
    return res.status(200).json({
      success: true,
      source: 'gemini',
      data: {
        bmi: roundedBmi,
        recommendations: recommendationsText,
      },
    });
  } catch (error) {
    console.error('Error in Gemini AI Coach controller (attempting fallback):', error);
    
    // Check if we have gathered enough user/logs data to return fallback recommendations
    if (user) {
      const fallbackText = generateLocalFallbackRecommendations(user, roundedBmi, caloriesConsumed, caloriesBurned, waterIntakeTotal, activeGoals || []);
      return res.status(200).json({
        success: true,
        source: 'fallback',
        data: {
          recommendations: fallbackText,
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while generating recommendations.',
      error: error.message,
    });
  }
};

/**
 * Generate a personalized 7-day workout plan using Gemini AI
 * GET /api/ai/workout-plan
 */
const getWorkoutPlan = async (req, res) => {
  let user, roundedBmi, activeGoals;
  try {
    const userId = req.userId;

    // 1. Fetch user profile
    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please log in again.',
      });
    }

    // 2. Fetch user's active goals
    activeGoals = await Goal.find({ user: userId, status: 'Active' });

    // 3. Calculate BMI (Body Mass Index): weight (kg) / (height (m) ^ 2)
    roundedBmi = null;
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      roundedBmi = parseFloat(bmi.toFixed(2));
    }

    // 4. Check if API Key is configured in environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key is not configured. Falling back to local workout plan.');
      const fallbackWorkoutPlanText = generateLocalFallbackWorkoutPlan(user, roundedBmi, activeGoals);
      return res.status(200).json({
        success: true,
        source: 'fallback',
        data: {
          workoutPlan: fallbackWorkoutPlanText,
        },
      });
    }

    // 5. Initialize Gemini Client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 6. Construct Prompt with user metrics
    const activeGoalsCount = activeGoals.length;
    const prompt = `You are a certified fitness trainer.

Generate a personalized 7-day workout plan.

Include:
- Daily workout
- Duration
- Intensity
- Rest days
- Beginner-friendly notes

Return structured plain text.

User's Fitness Data:
- Height: ${user.height ? `${user.height} cm` : 'Not provided'}
- Weight: ${user.weight ? `${user.weight} kg` : 'Not provided'}
- Calculated BMI: ${roundedBmi !== null ? roundedBmi : 'Not available (profile height/weight incomplete)'}

Active Goals:
- Active Goals Count: ${activeGoalsCount}
${activeGoals.length > 0 ? activeGoals.map(g => `- ${g.goalType}: Target Weight ${g.targetWeight} kg, Current Weight ${g.currentWeight} kg, Target Calories ${g.targetCalories || 'N/A'} kcal`).join('\n') : '- No active goals logged'}`;

    // 7. Generate Workout Plan using Gemini AI with retry and exponential backoff
    const workoutPlanText = await callGeminiWithRetry(model, prompt);

    // 8. Send API Response
    return res.status(200).json({
      success: true,
      source: 'gemini',
      data: {
        workoutPlan: workoutPlanText,
      },
    });
  } catch (error) {
    console.error('Error in Gemini AI Workout Plan controller (attempting fallback):', error);

    if (user) {
      const fallbackWorkoutPlanText = generateLocalFallbackWorkoutPlan(user, roundedBmi, activeGoals || []);
      return res.status(200).json({
        success: true,
        source: 'fallback',
        data: {
          workoutPlan: fallbackWorkoutPlanText,
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while generating workout plan.',
      error: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
  getWorkoutPlan,
};
