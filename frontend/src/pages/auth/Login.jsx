import React, { useState } from 'react';

/**
 * Login Component
 * 
 * Purpose:
 * Handles user authentication by taking email and password credentials.
 * 
 * Features:
 * - Local form state management.
 * - Basic client-side email/password validation.
 * - Stylized template using Tailwind CSS v4 grid, forms, and glassmorphism.
 * 
 * Future additions:
 * - Call authService login API.
 * - Save JWT token in AuthContext and LocalStorage.
 * - Redirect authenticated users to /dashboard.
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    console.log('Login form submitted for:', email);
    // TODO: Connect login API from AuthContext/Services
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans">
      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md shadow-xl flex flex-col gap-6">
        {/* Branding header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-white font-black text-xl">AI</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400">Login to access your personalized fitness dashboard</p>
        </div>

        {/* Error message slot */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@domain.com"
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm py-3 px-4 rounded-xl mt-2 transition-all hover:shadow-lg hover:shadow-purple-500/20 active:scale-98 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Navigation link */}
        <p className="text-xs text-center text-slate-500">
          Don't have an account?{' '}
          <span className="text-purple-400 font-bold hover:underline cursor-pointer">
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
