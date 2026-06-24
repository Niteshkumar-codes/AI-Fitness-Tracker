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
const callGeminiWithRetry = async (model, contents, retries = 3, initialDelay = 1000) => {
  let delay = initialDelay;
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(contents);
      return result.response.text();
    } catch (err) {
      const isQuotaExceeded = err.message && (err.message.includes('429') || err.message.toLowerCase().includes('quota'));
      if (i === retries || isQuotaExceeded) {
        throw err;
      }
      console.warn(`Gemini call failed (attempt ${i + 1}/${retries + 1}), retrying in ${delay}ms... Error: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

// List of Gemini models to try in sequence
const SUPPORTED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
];

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

    // 8. Generate Recommendations using Gemini AI with fallback models
    let recommendationsText = null;
    let selectedModel = null;
    let lastError = null;

    for (const modelName of SUPPORTED_MODELS) {
      selectedModel = modelName;
      try {
        console.log(`[AI Recommendations] Initializing Gemini call.`);
        console.log(`[AI Recommendations] Selected Model: ${selectedModel}`);
        console.log(`[AI Recommendations] Request Payload:\n${prompt}`);

        const model = genAI.getGenerativeModel({ model: selectedModel });
        recommendationsText = await callGeminiWithRetry(model, prompt);

        console.log(`[AI Recommendations] Gemini Response:\n${recommendationsText}`);
        console.log(`[AI Recommendations] Successfully generated content using model: ${selectedModel}`);
        break; // Success! Break out of the loop
      } catch (err) {
        lastError = err;
        console.error(`[AI Recommendations] Model ${selectedModel} failed. Error: ${err.message}`);
      }
    }

    if (!recommendationsText) {
      throw new Error(`All Gemini models failed. Last error: ${lastError ? lastError.message : 'Unknown'}`);
    }

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

    // 7. Generate Workout Plan using Gemini AI with fallback models
    let workoutPlanText = null;
    let selectedModel = null;
    let lastError = null;

    for (const modelName of SUPPORTED_MODELS) {
      selectedModel = modelName;
      try {
        console.log(`[AI Workout Plan] Initializing Gemini call.`);
        console.log(`[AI Workout Plan] Selected Model: ${selectedModel}`);
        console.log(`[AI Workout Plan] Request Payload:\n${prompt}`);

        const model = genAI.getGenerativeModel({ model: selectedModel });
        workoutPlanText = await callGeminiWithRetry(model, prompt);

        console.log(`[AI Workout Plan] Gemini Response:\n${workoutPlanText}`);
        console.log(`[AI Workout Plan] Successfully generated content using model: ${selectedModel}`);
        break; // Success! Break out of the loop
      } catch (err) {
        lastError = err;
        console.error(`[AI Workout Plan] Model ${selectedModel} failed. Error: ${err.message}`);
      }
    }

    if (!workoutPlanText) {
      throw new Error(`All Gemini models failed. Last error: ${lastError ? lastError.message : 'Unknown'}`);
    }


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

/**
 * Analyze a food image using Gemini Vision
 * POST /api/ai/analyze-food-image
 */
const analyzeFoodImage = async (req, res) => {
  const fs = require('fs');
  const path = require('path');

  try {
    console.log('[Food Image Analyzer] Request received.');
    if (!req.file) {
      console.warn('[Food Image Analyzer] No file uploaded.');
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please upload a valid image.',
      });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    console.log(`[Food Image Analyzer] Uploaded file details - Path: ${filePath}, MimeType: ${mimeType}, Size: ${req.file.size} bytes`);

    // Check if API Key is configured in environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Food Image Analyzer] Gemini API key is not configured. Falling back to local/fallback food analysis.');
      // Cleanup the uploaded file
      fs.unlink(filePath, (err) => {
        if (err) console.error('[Food Image Analyzer] Failed to delete temporary file:', err);
      });

      return res.status(200).json({
        success: true,
        data: {
          foodName: 'Healthy Salad (Fallback)',
          estimatedCalories: '320',
          protein: '8g',
          carbs: '22g',
          fat: '12g',
          recommendation: 'AI analysis is offline. This looks like a balanced meal option. Keep eating fresh vegetables and proteins!',
        },
      });
    }

    // Helper to convert file to Google Generative AI part
    const fileToGenerativePart = (filePath, mimeType) => {
      console.log(`[Food Image Analyzer] Converting file to Base64 part: ${filePath}`);
      return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
          mimeType,
        },
      };
    };

    const imagePart = fileToGenerativePart(filePath, mimeType);

    // Initialize Gemini Client
    console.log('[Food Image Analyzer] Initializing Gemini client...');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const prompt = `Analyze this food image and identify the food. Estimate its nutritional values per typical serving.
Return a JSON object containing the following keys:
{
  "foodName": "Name of the food (e.g. Avocado Toast)",
  "estimatedCalories": "estimated total calories (e.g. 350)",
  "protein": "estimated protein in grams (e.g. 10g)",
  "carbs": "estimated carbohydrates in grams (e.g. 30g)",
  "fat": "estimated fats in grams (e.g. 15g)",
  "recommendation": "Brief health coaching recommendation for this meal"
}
Only output valid JSON.`;

    let responseText;
    try {
      console.log('[Food Image Analyzer] Attempting content generation with gemini-2.5-flash...');
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });
      responseText = await callGeminiWithRetry(model, [prompt, imagePart]);
    } catch (primaryErr) {
      console.warn(`[Food Image Analyzer] gemini-2.5-flash failed: ${primaryErr.message}. Trying fallback to gemini-2.5-flash-lite...`);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { responseMimeType: 'application/json' },
      });
      responseText = await callGeminiWithRetry(model, [prompt, imagePart]);
    }

    console.log('[Food Image Analyzer] Raw response received from Gemini.');
    console.log(`[Food Image Analyzer] Response Text: ${responseText}`);

    // Cleanup the uploaded file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error('[Food Image Analyzer] Failed to delete temporary file after processing:', err);
      else console.log('[Food Image Analyzer] Temporary upload file cleaned up successfully.');
    });

    // Parse the response
    console.log('[Food Image Analyzer] Parsing response JSON...');
    let parsedData = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('[Food Image Analyzer] Failed to parse JSON response directly, searching for JSON block:', parseErr.message);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw parseErr;
      }
    }

    console.log('[Food Image Analyzer] Successfully parsed data:', JSON.stringify(parsedData));

    return res.status(200).json({
      success: true,
      data: {
        foodName: parsedData.foodName || 'Unknown Food Item',
        estimatedCalories: parsedData.estimatedCalories || 'N/A',
        protein: parsedData.protein || 'N/A',
        carbs: parsedData.carbs || 'N/A',
        fat: parsedData.fat || 'N/A',
        recommendation: parsedData.recommendation || 'Enjoy your meal!',
      },
    });
  } catch (error) {
    console.error('[Food Image Analyzer] Exception caught during analysis (attempting fallback response):', error);

    // Make sure we clean up the uploaded file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('[Food Image Analyzer] Failed to delete temporary file on error catch:', err);
        else console.log('[Food Image Analyzer] Temporary upload file cleaned up after error.');
      });
    }

    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';
    const errorMessage = error.message || 'Unknown error occurred.';

    // Return friendly fallback JSON structure
    return res.status(200).json({
      success: true,
      data: {
        foodName: isDev ? 'Analysis Error (Fallback)' : 'Fresh Meal (Fallback)',
        estimatedCalories: 'N/A',
        protein: 'N/A',
        carbs: 'N/A',
        fat: 'N/A',
        recommendation: isDev 
          ? `[Dev Mode - Gemini API Error]: ${errorMessage}`
          : 'We are temporarily unable to analyze this image. Please ensure your meal contains clean proteins, complex carbs, and healthy fats.',
      },
      ...(isDev && { devError: errorMessage })
    });
  }
};

/**
 * Calculate user's AI Health Score out of 100 based on five metrics (20 points each):
 * 1. BMI (20 points)
 * 2. Water Intake (20 points)
 * 3. Workout Activity (20 points)
 * 4. Food Tracking Consistency (20 points)
 * 5. Goal Progress (20 points)
 * 
 * GET /api/ai/health-score
 */
const getHealthScore = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Fetch user profile information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please log in again.',
      });
    }

    // Set daily time bounds (local server day)
    const targetDate = new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Set weekly time bounds (last 7 days, including today)
    const startOfSevenDaysAgo = new Date(startOfDay);
    startOfSevenDaysAgo.setDate(startOfSevenDaysAgo.getDate() - 6);

    // Query required data concurrently
    const [workoutsWeek, foodWeek, waterToday, activeGoals] = await Promise.all([
      Workout.find({ user: userId, workoutDate: { $gte: startOfSevenDaysAgo, $lte: endOfDay } }),
      Food.find({ user: userId, foodDate: { $gte: startOfSevenDaysAgo, $lte: endOfDay } }),
      Water.find({ user: userId, intakeDate: { $gte: startOfDay, $lte: endOfDay } }),
      Goal.find({ user: userId, status: 'Active' }),
    ]);

    const strengths = [];
    const improvements = [];

    // ==========================================
    // 1. BMI calculation (20 points max)
    // ==========================================
    let bmiScore = 0;
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);
      const roundedBmi = parseFloat(bmi.toFixed(1));

      if (roundedBmi >= 18.5 && roundedBmi < 25.0) {
        bmiScore = 20;
        strengths.push('Healthy BMI');
      } else if ((roundedBmi >= 17.5 && roundedBmi < 18.5) || (roundedBmi >= 25.0 && roundedBmi < 30.0)) {
        bmiScore = 15;
        improvements.push(`BMI is slightly outside the healthy range (${roundedBmi}). Aim for a balanced weight.`);
      } else {
        bmiScore = 10;
        improvements.push(`BMI indicates underweight or obesity range (${roundedBmi}). Seek professional guidance.`);
      }
    } else {
      bmiScore = 0;
      improvements.push('Complete height and weight in your profile to calculate BMI.');
    }

    // ==========================================
    // 2. Water Intake calculation (20 points max)
    // ==========================================
    const waterIntakeTotal = waterToday.reduce((sum, w) => sum + w.amount, 0);
    let waterScore = 0;
    if (waterIntakeTotal >= 2000) {
      waterScore = 20;
      strengths.push('Consistent hydration');
    } else if (waterIntakeTotal >= 1000) {
      waterScore = 12;
      improvements.push(`Increase water intake; you logged ${waterIntakeTotal} ml today (target: 2000 ml).`);
    } else if (waterIntakeTotal > 0) {
      waterScore = 6;
      improvements.push(`Drink more water; logged only ${waterIntakeTotal} ml today (target: 2000 ml).`);
    } else {
      waterScore = 0;
      improvements.push('No water logged today. Try to drink at least 2000 ml daily.');
    }

    // ==========================================
    // 3. Workout Activity calculation (20 points max)
    // ==========================================
    const workoutCount = workoutsWeek.length;
    let workoutScore = 0;
    if (workoutCount >= 3) {
      workoutScore = 20;
      strengths.push(`Active workout routine (${workoutCount} workouts this week)`);
    } else if (workoutCount === 2) {
      workoutScore = 15;
      improvements.push('Complete 1 more workout this week');
    } else if (workoutCount === 1) {
      workoutScore = 10;
      improvements.push('Complete 2 more workouts this week');
    } else {
      workoutScore = 0;
      improvements.push('No workouts logged in the last 7 days. Aim for at least 3 workouts weekly.');
    }

    // ==========================================
    // 4. Food Tracking Consistency (20 points max)
    // ==========================================
    const uniqueFoodDays = new Set(
      foodWeek.map(f => {
        const d = new Date(f.foodDate);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    );
    const foodDaysCount = uniqueFoodDays.size;
    let foodScore = 0;
    if (foodDaysCount >= 5) {
      foodScore = 20;
      strengths.push('Consistent food tracking');
    } else if (foodDaysCount >= 3) {
      foodScore = 15;
      improvements.push(`Log your meals more consistently (logged ${foodDaysCount} days this week).`);
    } else if (foodDaysCount >= 1) {
      foodScore = 10;
      improvements.push(`Try to log your meals daily (logged ${foodDaysCount} days this week).`);
    } else {
      foodScore = 0;
      improvements.push('Start logging your daily meals to track your nutrition.');
    }

    // Protein intake check for today (if they logged food today)
    const foodToday = foodWeek.filter(f => {
      const d = new Date(f.foodDate);
      return d >= startOfDay && d <= endOfDay;
    });
    if (foodToday.length > 0) {
      const proteinToday = foodToday.reduce((sum, f) => sum + (f.protein || 0), 0);
      if (proteinToday < 50) {
        improvements.push('Increase protein intake');
      }
    }

    // ==========================================
    // 5. Goal Progress calculation (20 points max)
    // ==========================================
    let goalScore = 0;
    if (activeGoals.length > 0) {
      const activeGoal = activeGoals[0];
      const targetWeight = activeGoal.targetWeight;
      const currentWeight = user.weight || activeGoal.currentWeight;
      const weightDiff = Math.abs(currentWeight - targetWeight);

      if (weightDiff <= 1) {
        goalScore = 20;
        strengths.push('On track with weight goal');
      } else if (weightDiff <= 3) {
        goalScore = 15;
        improvements.push('Within 3 kg of target weight; continue with your consistency.');
      } else if (weightDiff <= 5) {
        goalScore = 10;
        improvements.push('Within 5 kg of target weight; stay focused on your target.');
      } else {
        goalScore = 5;
        improvements.push(`Keep working towards your target weight of ${targetWeight} kg (currently ${weightDiff.toFixed(1)} kg away).`);
      }
    } else {
      goalScore = 0;
      improvements.push('Set an active fitness goal to track progress.');
    }

    // Calculate overall health score
    const healthScore = bmiScore + waterScore + workoutScore + foodScore + goalScore;

    // Determine health score status category
    let status = 'Needs Improvement';
    if (healthScore >= 85) {
      status = 'Excellent';
    } else if (healthScore >= 70) {
      status = 'Good';
    } else if (healthScore >= 50) {
      status = 'Fair';
    }

    return res.status(200).json({
      success: true,
      data: {
        healthScore,
        status,
        strengths,
        improvements,
      },
    });
  } catch (error) {
    console.error('Error in getHealthScore:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while calculating health score.',
      error: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
  getWorkoutPlan,
  analyzeFoodImage,
  getHealthScore,
};
