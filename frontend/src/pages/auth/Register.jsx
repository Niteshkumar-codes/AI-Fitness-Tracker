import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Register Component
 * 
 * Purpose:
 * Allows new users to create accounts in the fitness tracker.
 * 
 * Features:
 * - Collects user details: Name, Email, Password, Height, and Weight.
 * - Local form state management.
 * - Call authService registration API via AuthContext.
 * - Automatically log user in and save token upon successful registration.
 * - Redirect to /dashboard.
 * - Production-ready Tailwind CSS v4 styling.
 */
const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, height, weight } = formData;
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Creating account...');
    try {
      const userData = {
        name,
        email,
        password,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined
      };

      const result = await register(userData);
      if (result.success) {
        toast.success(result.message || 'Account created successfully!', { id: toastId });
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed.');
        toast.error(result.message || 'Registration failed.', { id: toastId });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
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
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center animate-pulse">
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
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200 disabled:opacity-55"
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
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200 disabled:opacity-55"
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
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200 disabled:opacity-55"
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
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200 disabled:opacity-55"
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
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200 disabled:opacity-55"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm py-3 px-4 rounded-xl mt-2 transition-all hover:shadow-lg hover:shadow-purple-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Redirect toggle link */}
        <p className="text-xs text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 font-bold hover:underline cursor-pointer">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
