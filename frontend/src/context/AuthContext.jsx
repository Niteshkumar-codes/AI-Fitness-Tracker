import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create global Authentication Context
export const AuthContext = createContext(null);

/**
 * AuthProvider Provider Component
 * 
 * Purpose:
 * Stores and manages global user authentication state (login, registration, logout, profile loading).
 * Wraps the routing framework to check access privileges.
 * 
 * Managed States:
 * - currentUser: User profile details (id, name, email, height, weight, etc.)
 * - isAuthenticated: Boolean flag indicating if token exists and is valid
 * - loading: Loading state spinner trigger (useful for preventing flash on page reload)
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Run on mount to check if token exists and profile can be fetched
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        return;
      }

      // Populate state with cached user immediately to avoid initial UI flash
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse cached user data:', error);
        }
      }

      try {
        // Fetch fresh user profile using authentication endpoint to verify token
        const data = await authService.getProfile();
        if (data && data.success) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error.message);
        // Only log out if it is an authentication error (e.g. 401), not network error
        if (error.response && error.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login handler connecting to authService login
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data && data.success) {
        const { token, user } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register handler connecting to authService register
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      if (data && data.success) {
        const { token, user } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout handler clearing local storage and state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update current user details reactively
   */
  const updateCurrentUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // context payload containing functions and states
  const contextValue = {
    currentUser,
    user: currentUser, // for backward compatibility/flexibility
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Block rendering while initial token check completes */}
      {!loading ? children : (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-sm font-sans">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-purple-600 animate-spin mb-3"></div>
          <span>Synchronizing security session...</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};
