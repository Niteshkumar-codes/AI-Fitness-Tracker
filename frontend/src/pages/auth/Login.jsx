import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Login Component
 * 
 * Purpose:
 * Handles user authentication by taking email and password credentials.
 * 
 * Features:
 * - Local form state management.
 * - Basic client-side email/password validation.
 * - Call authService login API via AuthContext.
 * - Save JWT token in AuthContext and LocalStorage.
 * - Redirect authenticated users to /dashboard.
 * - Stylized template using Tailwind CSS v4 grid, forms, and glassmorphism.
 */
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Signing in...');
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success(result.message || 'Login successful!', { id: toastId });
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password.');
        toast.error(result.message || 'Invalid email or password.', { id: toastId });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
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
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center animate-pulse">
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
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors text-slate-200 disabled:opacity-55"
            />
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
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Navigation link */}
        <p className="text-xs text-center text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 font-bold hover:underline cursor-pointer">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
