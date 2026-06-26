import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Scale, Ruler, Activity, Calendar } from 'lucide-react';

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
 * - Centered premium glass card auth flow (OpenAI / Vercel inspired).
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
    gender: 'Prefer Not To Say',
    age: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // States for input animations & floating labels
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [heightFocused, setHeightFocused] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);
  const [ageFocused, setAgeFocused] = useState(false);
  const [genderFocused, setGenderFocused] = useState(false);

  const isNameActive = nameFocused || formData.name !== '';
  const isEmailActive = emailFocused || formData.email !== '';
  const isPasswordActive = passwordFocused || formData.password !== '';
  const isHeightActive = heightFocused || formData.height !== '';
  const isWeightActive = weightFocused || formData.weight !== '';
  const isAgeActive = ageFocused || formData.age !== '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, height, weight, gender, age } = formData;
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (age !== '') {
      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        setError('Age must be between 13 and 120.');
        return;
      }
    }

    setIsLoading(true);
    const toastId = toast.loading('Creating account...');
    try {
      const userData = {
        name,
        email,
        password,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        gender: gender,
        age: age ? parseInt(age, 10) : undefined
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
    <div className="min-h-screen bg-slate-955 text-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Mesh Background Glowing Orbs (Dynamic Floating Animation) */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none animate-drift-glow-1" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-drift-glow-2" />
      <div className="absolute top-[25%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/8 blur-[110px] pointer-events-none animate-drift-glow-3" />
      <div className="absolute bottom-[10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none animate-drift-glow-1" />

      {/* Floating Background Particles */}
      <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 rounded-full bg-purple-400/30 blur-[1px] animate-particle-1 pointer-events-none" />
      <div className="absolute top-[45%] left-[45%] w-2 h-2 rounded-full bg-cyan-400/25 blur-[1px] animate-particle-2 pointer-events-none" />
      <div className="absolute bottom-[25%] left-[15%] w-1 h-1 rounded-full bg-indigo-400/20 blur-[0.5px] animate-particle-3 pointer-events-none" />
      <div className="absolute top-[25%] right-[20%] w-2 h-2 rounded-full bg-purple-400/25 blur-[1px] animate-particle-2 pointer-events-none" />
      <div className="absolute bottom-[15%] right-[35%] w-1.5 h-1.5 rounded-full bg-cyan-400/30 blur-[1px] animate-particle-1 pointer-events-none" />

      {/* Inner Centered Column */}
      <div className="w-full max-w-[480px] z-10 flex flex-col gap-6 items-center">
        
        {/* FitAI Premium Logo Badge */}
        <Link to="/" className="flex items-center gap-3.5 select-none animate-fade-in-up mb-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 opacity-60" />
            <Activity className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-tight text-white leading-tight">FitAI</span>
            <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Fitness Intelligence</span>
          </div>
        </Link>

        {/* Outer card wrapper (double-layer for premium 1px gradient border + shadows) */}
        <div className="w-full p-[1.2px] rounded-3xl bg-gradient-to-br from-purple-500/35 via-slate-950 to-indigo-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.75)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.08)] hover:from-purple-500/45 hover:to-indigo-500/40 transition-all duration-500 animate-fade-in-up">
          <div className="p-8 md:p-10 rounded-[23px] bg-slate-950/80 backdrop-blur-3xl flex flex-col gap-6 relative overflow-hidden">
            
            {/* Soft inner glow inside card */}
            <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-purple-500/5 blur-[55px] pointer-events-none" />
            
            <div className="flex flex-col gap-1.5 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Get Started</h2>
              <p className="text-xs md:text-sm text-slate-400">Join FitAI to track and optimize your fitness goals</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs font-semibold text-center animate-pulse flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Full Name Input wrapper */}
              <div className="flex flex-col gap-2 relative">
                <div className="relative rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800/80 focus-within:border-purple-500/80 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
                  <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors duration-300 ${
                    nameFocused ? 'text-purple-400' : 'text-slate-500'
                  }`}>
                    <User className={`w-4.5 h-4.5 transition-all duration-300 ${nameFocused ? 'scale-110' : ''}`} />
                  </span>
                  
                  {/* Floating label */}
                  <label
                    htmlFor="name"
                    className={`absolute left-11 transition-all duration-300 pointer-events-none select-none ${
                      isNameActive
                        ? 'top-[-8px] left-4.5 text-[9px] px-1.5 bg-slate-950 text-purple-400 font-extrabold uppercase tracking-widest z-10'
                        : 'top-3.5 text-sm text-slate-500'
                    }`}
                  >
                    Full Name
                  </label>
                  
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    disabled={isLoading}
                    className="w-full bg-transparent focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 disabled:opacity-55"
                    required
                  />
                </div>
              </div>

              {/* Email Input wrapper */}
              <div className="flex flex-col gap-2 relative">
                <div className="relative rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800/80 focus-within:border-purple-500/80 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
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
                <div className="relative rounded-xl border border-slate-900 bg-slate-955 hover:border-slate-800/80 focus-within:border-purple-500/80 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
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
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer transition-colors duration-250"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Optional Health profiles */}
              <div className="grid grid-cols-2 gap-4">
                {/* Height wrapper */}
                <div className="flex flex-col gap-2 relative">
                  <div className="relative rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800/80 focus-within:border-purple-500/80 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
                    <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors duration-300 ${
                      heightFocused ? 'text-purple-400' : 'text-slate-500'
                    }`}>
                      <Ruler className={`w-4.5 h-4.5 transition-all duration-300 ${heightFocused ? 'scale-110' : ''}`} />
                    </span>
                    
                    {/* Floating label */}
                    <label
                      htmlFor="height"
                      className={`absolute left-11 transition-all duration-300 pointer-events-none select-none ${
                        isHeightActive
                          ? 'top-[-8px] left-4.5 text-[9px] px-1.5 bg-slate-950 text-purple-400 font-extrabold uppercase tracking-widest z-10'
                          : 'top-3.5 text-sm text-slate-500'
                      }`}
                    >
                      Height (cm)
                    </label>
                    
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      onFocus={() => setHeightFocused(true)}
                      onBlur={() => setHeightFocused(false)}
                      disabled={isLoading}
                      className="w-full bg-transparent focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>

                {/* Weight wrapper */}
                <div className="flex flex-col gap-2 relative">
                  <div className="relative rounded-xl border border-slate-900 bg-slate-955 hover:border-slate-800/80 focus-within:border-purple-500/80 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
                    <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors duration-300 ${
                      weightFocused ? 'text-purple-400' : 'text-slate-500'
                    }`}>
                      <Scale className={`w-4.5 h-4.5 transition-all duration-300 ${weightFocused ? 'scale-110' : ''}`} />
                    </span>
                    
                    {/* Floating label */}
                    <label
                      htmlFor="weight"
                      className={`absolute left-11 transition-all duration-300 pointer-events-none select-none ${
                        isWeightActive
                          ? 'top-[-8px] left-4.5 text-[9px] px-1.5 bg-slate-950 text-purple-400 font-extrabold uppercase tracking-widest z-10'
                          : 'top-3.5 text-sm text-slate-500'
                      }`}
                    >
                      Weight (kg)
                    </label>
                    
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      onFocus={() => setWeightFocused(true)}
                      onBlur={() => setWeightFocused(false)}
                      disabled={isLoading}
                      className="w-full bg-transparent focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>
              </div>

              {/* Age and Gender parameters */}
              <div className="grid grid-cols-2 gap-4">
                {/* Age wrapper */}
                <div className="flex flex-col gap-2 relative">
                  <div className="relative rounded-xl border border-slate-900 bg-slate-955 hover:border-slate-800/80 focus-within:border-purple-500/80 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
                    <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors duration-300 ${
                      ageFocused ? 'text-purple-400' : 'text-slate-500'
                    }`}>
                      <Calendar className={`w-4.5 h-4.5 transition-all duration-300 ${ageFocused ? 'scale-110' : ''}`} />
                    </span>
                    
                    {/* Floating label */}
                    <label
                      htmlFor="age"
                      className={`absolute left-11 transition-all duration-300 pointer-events-none select-none ${
                        isAgeActive
                          ? 'top-[-8px] left-4.5 text-[9px] px-1.5 bg-slate-950 text-purple-400 font-extrabold uppercase tracking-widest z-10'
                          : 'top-3.5 text-sm text-slate-500'
                      }`}
                    >
                      Age
                    </label>
                    
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      onFocus={() => setAgeFocused(true)}
                      onBlur={() => setAgeFocused(false)}
                      disabled={isLoading}
                      className="w-full bg-transparent focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>

                {/* Gender wrapper */}
                <div className="flex flex-col gap-2 relative">
                  <div className="relative rounded-xl border border-slate-900 bg-slate-955 hover:border-slate-800/80 focus-within:border-purple-500/80 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300">
                    <span className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-colors duration-300 ${
                      genderFocused ? 'text-purple-400' : 'text-slate-500'
                    }`}>
                      <User className={`w-4.5 h-4.5 transition-all duration-300 ${genderFocused ? 'scale-110' : ''}`} />
                    </span>
                    
                    {/* Label is always active for select to prevent overlapping values */}
                    <label
                      htmlFor="gender"
                      className="absolute left-4.5 text-[9px] px-1.5 bg-slate-950 text-purple-400 font-extrabold uppercase tracking-widest z-10 top-[-8px]"
                    >
                      Gender
                    </label>
                    
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onFocus={() => setGenderFocused(true)}
                      onBlur={() => setGenderFocused(false)}
                      disabled={isLoading}
                      className="w-full bg-transparent focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-200 disabled:opacity-55 cursor-pointer appearance-none"
                    >
                      <option value="Male" className="bg-slate-950 text-slate-200">Male</option>
                      <option value="Female" className="bg-slate-950 text-slate-200">Female</option>
                      <option value="Other" className="bg-slate-950 text-slate-200">Other</option>
                      <option value="Prefer Not To Say" className="bg-slate-950 text-slate-200">Prefer Not To Say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Premium Explicit Gradient Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#2563eb] via-[#06b6d4] to-[#1e40af] hover:from-[#3b82f6] hover:via-[#22d3ee] hover:to-[#2563eb] text-white font-bold text-sm py-4 px-4 rounded-xl mt-3 transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.65)] hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2 group border border-purple-500/20"
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
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Redirect toggle link */}
            <p className="text-xs text-center text-slate-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 hover:underline cursor-pointer transition-colors duration-200">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 select-none animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Powered by Gemini AI</span>
        </p>

      </div>
    </div>
  );
};

export default Register;
