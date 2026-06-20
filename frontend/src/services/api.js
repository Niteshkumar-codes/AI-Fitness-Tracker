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

export default api;
