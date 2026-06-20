import React, { useState } from 'react';

/**
 * Register Component
 * 
 * Purpose:
 * Allows new users to create accounts in the fitness tracker.
 * 
 * Features:
 * - Collects user details: Name, Email, Password, Height, and Weight.
 * - Local form state management.
 * - Production-ready Tailwind CSS v4 styling.
 * 
 * Future additions:
 * - Call authService registration API.
 * - Automatically log user in and save token upon successful registration.
 * - Redirect to /dashboard.
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password } = formData;
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    console.log('Registration form submitted for:', email);
    // TODO: Connect registration API
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans">
      <div className="w-full max-w-lg p-8 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md shadow-xl flex flex-col gap-6">
        {/* Header branding */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-white font-black text-xl">AI</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2">Get Started</h2>
          <p className="text-xs text-slate-400">Join FlexAI to track and optimize your fitness goals</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200"
            />
          </div>

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
              placeholder="e.g. john@domain.com"
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
              placeholder="Min. 6 characters"
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200"
            />
          </div>

          {/* Optional Health profiles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400" htmlFor="height">
                Height (cm) - Optional
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 175"
                className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400" htmlFor="weight">
                Weight (kg) - Optional
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 70"
                className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm py-3 px-4 rounded-xl mt-2 transition-all hover:shadow-lg hover:shadow-purple-500/20 active:scale-98 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Redirect toggle link */}
        <p className="text-xs text-center text-slate-500">
          Already have an account?{' '}
          <span className="text-purple-400 font-bold hover:underline cursor-pointer">
            Sign in instead
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
