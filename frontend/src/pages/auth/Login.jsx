import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Brain, Flame, Sparkles, ArrowRight, Activity } from 'lucide-react';

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
 * - Premium responsive layout with FitAI branding, animated mesh glows, and floating labels.
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // States for input animations & floating labels
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isEmailActive = emailFocused || formData.email !== '';
  const isPasswordActive = passwordFocused || formData.password !== '';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col lg:flex-row relative overflow-hidden select-none">
      
      {/* Mesh Background Glowing Orbs (Dynamic Floating Animation) */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none animate-drift-glow-1" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-drift-glow-2" />
      <div className="absolute top-[35%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none animate-drift-glow-3" />

      {/* Left side: AI/Fitness hero section */}
      <div className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-between relative border-r border-slate-900/60 bg-slate-950/20 backdrop-blur-xl">
        
        {/* FitAI Premium Logo Badge */}
        <div className="flex items-center gap-3.5 z-10 animate-subtle-float">
          <div className="w-11 h-11 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
            <Activity className="w-5.5 h-5.5 text-purple-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">FitAI</span>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Fitness Intelligence</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="my-auto space-y-10 max-w-lg z-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-[10px] font-bold uppercase tracking-widest select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Fitness Engine</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Unlock your peak potential with <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Fitness Intelligence</span>
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed">
              Track workouts, analyze meals instantly, and get 24/7 coaching tailored to your body's unique metrics using Gemini AI.
            </p>
          </div>

          {/* Three premium feature cards */}
          <div className="space-y-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl border border-slate-900/60 bg-slate-900/10 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-slate-800 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(59,130,246,0.05)] group">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300">
                <Brain className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-200 text-sm tracking-tight">AI Health Coach</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Personalized fitness and lifestyle training plans that evolve with your progress.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl border border-slate-900/60 bg-slate-900/10 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-slate-800 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(59,130,246,0.05)] group">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-200 text-sm tracking-tight">AI Food Analyzer</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Snap photos or describe meals to instantly track macros, calories, and nutrition.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl border border-slate-900/60 bg-slate-900/10 backdrop-blur-md flex gap-4 transition-all duration-300 hover:border-slate-800 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(59,130,246,0.05)] group">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-200 text-sm tracking-tight">AI Chat Assistant</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                  Interactive 24/7 coaching assistant for immediate health, form, and habit guidance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Left */}
        <div className="text-xs text-slate-500 z-10 flex items-center gap-2 select-none">
          <span>© 2026 FitAI Inc. All rights reserved.</span>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-12 min-h-screen relative z-10 bg-slate-950/20">
        
        {/* Mobile FitAI Logo */}
        <div className="flex items-center gap-3.5 lg:hidden z-10 mb-8 self-start select-none">
          <div className="w-9 h-9 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Activity className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white leading-tight">FitAI</span>
            <span className="text-[7.5px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Fitness Intelligence</span>
          </div>
        </div>

        {/* Outer card wrapper (double-layer for premium 1px gradient border + shadows) */}
        <div className="my-auto w-full max-w-md mx-auto z-10 p-[1.2px] rounded-3xl bg-gradient-to-br from-purple-500/25 via-slate-950 to-indigo-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.06)] hover:from-purple-500/35 hover:to-indigo-500/30 transition-all duration-500">
          <div className="p-8 md:p-10 rounded-[23px] bg-slate-950/90 backdrop-blur-2xl flex flex-col gap-6 relative overflow-hidden">
            
            {/* Soft inner glow inside card */}
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-purple-500/5 blur-[45px] pointer-events-none" />
            
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs md:text-sm text-slate-400">Sign in to access your FitAI dashboard</p>
            </div>

            {/* Error message slot */}
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs font-semibold text-center animate-pulse flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Email Input wrapper */}
              <div className="flex flex-col gap-2 relative">
                <div className="relative rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
                  <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors duration-300 ${
                    emailFocused ? 'text-purple-400' : 'text-slate-500'
                  }`}>
                    <Mail className={`w-4.5 h-4.5 transition-all duration-300 ${emailFocused ? 'scale-110' : ''}`} />
                  </span>
                  
                  {/* Floating label */}
                  <label
                    htmlFor="email"
                    className={`absolute left-11 transition-all duration-300 pointer-events-none select-none ${
                      isEmailActive
                        ? 'top-[-8px] left-4.5 text-[9px] px-1.5 bg-slate-950 text-purple-400 font-extrabold uppercase tracking-widest z-10'
                        : 'top-3.5 text-sm text-slate-500'
                    }`}
                  >
                    Email Address
                  </label>
                  
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    disabled={isLoading}
                    className="w-full bg-transparent focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 disabled:opacity-55"
                    required
                  />
                </div>
              </div>

              {/* Password Input wrapper */}
              <div className="flex flex-col gap-2 relative">
                <div className="relative rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
                  <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors duration-300 ${
                    passwordFocused ? 'text-purple-400' : 'text-slate-500'
                  }`}>
                    <Lock className={`w-4.5 h-4.5 transition-all duration-300 ${passwordFocused ? 'scale-110' : ''}`} />
                  </span>
                  
                  {/* Floating label */}
                  <label
                    htmlFor="password"
                    className={`absolute left-11 transition-all duration-300 pointer-events-none select-none ${
                      isPasswordActive
                        ? 'top-[-8px] left-4.5 text-[9px] px-1.5 bg-slate-950 text-purple-400 font-extrabold uppercase tracking-widest z-10'
                        : 'top-3.5 text-sm text-slate-500'
                    }`}
                  >
                    Password
                  </label>
                  
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    disabled={isLoading}
                    className="w-full bg-transparent focus:outline-none rounded-xl pl-11 pr-12 py-3.5 text-sm text-slate-200 disabled:opacity-55"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between text-xs mt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="w-4.5 h-4.5 bg-slate-950 border border-slate-900 text-purple-600 rounded-md focus:ring-purple-500 focus:ring-offset-slate-950 accent-purple-600 cursor-pointer transition-all duration-200"
                  />
                  <span className="hover:text-slate-300 transition-colors">Remember me</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toast('Forgot password feature coming soon!', { icon: '🔑' }); }}
                  className="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-sm py-4 px-4 rounded-xl mt-3 transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 group border border-purple-500/20"
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
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-center text-slate-500 mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 font-bold hover:text-purple-300 hover:underline cursor-pointer transition-colors duration-200">
                Create account
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

export default Login;
