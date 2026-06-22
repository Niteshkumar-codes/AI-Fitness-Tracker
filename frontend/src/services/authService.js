import api from './api';

/**
 * Authentication Service
 * Centralizes all authentication HTTP requests to the backend.
 */
const authService = {
  /**
   * Log in user with credentials
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Backend response data containing token and user profile
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - Form fields (name, email, password, height, weight)
   * @returns {Promise<Object>} Backend response data containing token and user profile
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Get authenticated user's current profile details
   * @returns {Promise<Object>} Backend response data containing user profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export default authService;
