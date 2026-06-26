import axios from 'axios';

// Get backend API base URL from environment variables or use localhost default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios API client instance
 * Configured with base parameters for global integration.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Intercepts outgoing requests to add authorization headers automatically.
 * Fetches token from LocalStorage before sending any requests to secure routes.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure the standard Authorization format: Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Intercepts incoming responses to handle central error events.
 * E.g., Redirecting to login if token is expired or unauthorized (HTTP 401).
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if error is due to expired or missing token
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Logging out user...');
      // Clear local storage and redirect immediately
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const workoutService = {
  /**
   * Fetch all workouts for the authenticated user
   * @returns {Promise<Object>} Response containing success status, workouts array, and total count
   */
  getWorkouts: async () => {
    const response = await api.get('/workouts');
    return response.data;
  },

  /**
   * Add a new workout log
   * @param {Object} workoutData - Fields: workoutType, duration, caloriesBurned, notes, workoutDate (optional)
   * @returns {Promise<Object>} Response containing success status, message, and created workout object
   */
  addWorkout: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  /**
   * Delete a workout log by ID
   * @param {string} id - Workout document ID to delete
   * @returns {Promise<Object>} Response containing success status and message
   */
  deleteWorkout: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  }
};

export const foodService = {
  /**
   * Fetch all food entries for the authenticated user
   * @returns {Promise<Object>} Response containing success status, food array, and total count
   */
  getFoods: async () => {
    const response = await api.get('/foods');
    return response.data;
  },

  /**
   * Add a new food entry
   * @param {Object} foodData - Fields: foodName, calories, protein, carbs, fats, mealType, foodDate (optional)
   * @returns {Promise<Object>} Response containing success status, message, and created food object
   */
  addFood: async (foodData) => {
    const response = await api.post('/foods', foodData);
    return response.data;
  },

  /**
   * Delete a food entry by ID
   * @param {string} id - Food entry document ID to delete
   * @returns {Promise<Object>} Response containing success status and message
   */
  deleteFood: async (id) => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  }
};

export const goalService = {
  /**
   * Fetch all goals for the authenticated user
   * @returns {Promise<Object>} Response containing success status and goals array
   */
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  /**
   * Add a new goal
   * @param {Object} goalData - Fields: goalType, targetWeight, currentWeight, targetCalories (optional), targetDate (optional)
   * @returns {Promise<Object>} Response containing success status and created goal object
   */
  addGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  /**
   * Update an existing goal (e.g. update current weight or completion status)
   * @param {string} id - Goal document ID to update
   * @param {Object} goalData - Fields to update
   * @returns {Promise<Object>} Response containing success status and updated goal object
   */
  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  /**
   * Delete a goal by ID
   * @param {string} id - Goal document ID to delete
   * @returns {Promise<Object>} Response containing success status and message
   */
  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export const waterService = {
  /**
   * Fetch all water logs for the authenticated user
   * @returns {Promise<Object>} Response containing success status, logs array, and total count
   */
  getWaterLogs: async () => {
    const response = await api.get('/water');
    return response.data;
  },

  /**
   * Fetch daily water stats for the authenticated user
   * @param {string} [date] - Optional date in YYYY-MM-DD format
   * @param {number} [goal] - Optional custom daily goal
   * @returns {Promise<Object>} Response containing success status and statistics data object
   */
  getDailyStats: async (date, goal) => {
    const params = {};
    if (date) params.date = date;
    if (goal) params.goal = goal;
    const response = await api.get('/water/stats', { params });
    return response.data;
  },

  /**
   * Add a new water intake log
   * @param {Object} waterData - Fields: amount (number), intakeDate (string, optional)
   * @returns {Promise<Object>} Response containing success status, message, and created water object
   */
  addWater: async (waterData) => {
    const response = await api.post('/water', waterData);
    return response.data;
  },

  /**
   * Delete a water log entry by ID
   * @param {string} id - Water log document ID to delete
   * @returns {Promise<Object>} Response containing success status and message
   */
  deleteWaterLog: async (id) => {
    const response = await api.delete(`/water/${id}`);
    return response.data;
  }
};

export const aiService = {
  /**
   * Fetch health recommendations from Gemini AI (with fallback support)
   */
  getRecommendations: async () => {
    const response = await api.get('/ai/recommendations');
    return response.data;
  },

  /**
   * Fetch 7-day workout plan from Gemini AI (with fallback support)
   */
  getWorkoutPlan: async () => {
    const response = await api.get('/ai/workout-plan');
    return response.data;
  },

  /**
   * Analyze food image using Gemini Vision
   */
  analyzeFoodImage: async (formData) => {
    const response = await api.post('/ai/analyze-food-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default api;


