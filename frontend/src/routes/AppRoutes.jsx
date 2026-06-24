import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Workouts from '../pages/workouts/Workouts';
import FoodTracker from '../pages/food/FoodTracker';
import Goals from '../pages/goals/Goals';
import WaterTracker from '../pages/water/WaterTracker';
import Profile from '../pages/profile/Profile';
import AICoach from '../pages/ai/AICoach';

/**
 * Protective Route wrapper
 * Purpose: Ensures only authenticated users can visit the enclosed route.
 * Redirects unauthenticated users to /login.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-sm font-sans">
        <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-purple-600 animate-spin mb-3"></div>
        <span>Synchronizing security session...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Public Route wrapper (Guest only)
 * Purpose: Redirects already logged-in users away from Login/Register pages.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-sm font-sans">
        <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-purple-600 animate-spin mb-3"></div>
        <span>Synchronizing security session...</span>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

/**
 * AppRoutes Router Config
 * Defines all navigation paths for the application.
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* Premium custom dark themed notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl font-sans',
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
          },
        }}
      />
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
        <Route 
          path="/workouts" 
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/food" 
          element={
            <PrivateRoute>
              <FoodTracker />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/goals" 
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/water" 
          element={
            <PrivateRoute>
              <WaterTracker />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/ai-coach" 
          element={
            <PrivateRoute>
              <AICoach />
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
