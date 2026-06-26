import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, Brain, Flame, Sparkles, ArrowRight, Scale, Ruler } from 'lucide-react';

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
 * - Responsive split-screen layout (OpenAI / Vercel / Linear inspired).
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background ambient lighting shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Left side: AI/Fitness hero section */}
      <div className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-between relative border-r border-slate-900/60 bg-slate-950/40 backdrop-blur-3xl">
        {/* Branding */}
        <div className="flex items-center gap-3 z-10 select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">FlexAI</span>
        </div>

        {/* Hero Content */}
        <div className="my-auto space-y-8 max-w-lg z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-semibold uppercase tracking-wider select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Fitness Engine</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              The future of personal fitness is <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">AI-powered</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Track workouts, analyze meals instantly, and get 24/7 coaching tailored to your body's unique metrics using Gemini AI.
            </p>
          </div>

          {/* Three glass cards */}
          <div className="space-y-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-slate-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">AI Health Coach</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Get personalized workout and wellness guidance tailored specifically for your body and goals.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-slate-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">AI Food Analyzer</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Log meals instantly via descriptions or photos to extract calorie counts and macronutrients.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-slate-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">AI Chat Assistant</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Ask any fitness, nutrition, or health questions and receive immediate expert feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Left */}
        <div className="text-xs text-slate-500 z-10 flex items-center gap-2 select-none">
          <span>© 2026 FlexAI Inc. All rights reserved.</span>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-12 min-h-screen relative z-10">
        {/* Mobile Branding */}
        <div className="flex items-center gap-3 lg:hidden z-10 mb-8 self-start select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-350 bg-clip-text text-transparent">FlexAI</span>
        </div>

        {/* Form Container (glowing glass card) */}
        <div className="my-auto w-full max-w-md mx-auto z-10">
          <div className="p-8 md:p-10 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-xl shadow-2xl flex flex-col gap-6 relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
            {/* Background glow of the card */}
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-purple-500/5 blur-[50px] pointer-events-none group-hover:bg-purple-500/10 transition-all duration-300" />
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Get Started</h2>
              <p className="text-xs md:text-sm text-slate-400">Join FlexAI to track and optimize your fitness goals</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center animate-pulse flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-slate-900 hover:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all text-slate-200 disabled:opacity-55"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-slate-900 hover:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all text-slate-200 disabled:opacity-55"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    disabled={isLoading}
                    className="w-full bg-slate-950/80 border border-slate-900 hover:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none rounded-xl pl-11 pr-11 py-3.5 text-sm transition-all text-slate-200 disabled:opacity-55"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Optional Health profiles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="height">
                    Height (cm) - Opt
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <Ruler className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="Height"
                      disabled={isLoading}
                      className="w-full bg-slate-950/80 border border-slate-900 hover:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="weight">
                    Weight (kg) - Opt
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                      <Scale className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Weight"
                      disabled={isLoading}
                      className="w-full bg-slate-950/80 border border-slate-900 hover:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl mt-3 transition-all hover:shadow-lg hover:shadow-purple-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
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
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Redirect toggle link */}
            <p className="text-xs text-center text-slate-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 font-bold hover:text-purple-350 hover:underline cursor-pointer">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Right */}
        <div className="w-full text-center lg:text-right mt-8 z-10 select-none">
          <p className="text-[11px] text-slate-500 flex items-center justify-center lg:justify-end gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Powered by Gemini AI</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
