import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

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
 * - user: User profile details (name, email, height, weight, etc.)
 * - isAuthenticated: Boolean flag indicating if token exists and is valid
 * - loading: Loading state spinner trigger (useful for preventing flash on page reload)
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Run on mount to check if token exists and profile can be fetched
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile using authentication endpoint
        const response = await api.get('/auth/profile');
        if (response.data && response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Token is invalid/expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login handler stub
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register handler stub
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data && response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout handler stub
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // context payload containing functions and states
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Block rendering while initial token check completes */}
      {!loading ? children : (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-sm">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-purple-600 animate-spin mb-3"></div>
          <span>Synchronizing security session...</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};
