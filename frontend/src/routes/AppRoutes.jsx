import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';

/**
 * Protective Route wrapper stub
 * Purpose: Ensures only authenticated users can visit the enclosed route.
 * Redirects unauthenticated users to /login.
 */
const PrivateRoute = ({ children }) => {
  // TODO: Check auth state from AuthContext
  const isAuthenticated = true; // Placeholder for testing layout
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Public Route wrapper stub (Guest only)
 * Purpose: Redirects already logged-in users away from Login/Register pages.
 */
const GuestRoute = ({ children }) => {
  const isAuthenticated = false; // Placeholder
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

/**
 * AppRoutes Router Config
 * Defines all navigation paths for the application.
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest only routes (Auth) */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } 
        />

        {/* Protected App Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Redirect Root path to /dashboard or /login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Fallback 404 Route */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 gap-4">
              <h1 className="text-4xl font-black">404</h1>
              <p className="text-slate-400">Page not found</p>
              <a href="/" className="text-purple-400 font-semibold hover:underline">Go Back Home</a>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
