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
      // Clear local storage and redirect if needed
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login';
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

export default api;

