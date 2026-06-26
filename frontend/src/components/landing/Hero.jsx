import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Sparkles, ArrowRight, ArrowUpRight, Activity, Dumbbell, Flame, Heart } from 'lucide-react';

const Hero = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="pt-32 pb-16 md:py-32 xl:pt-40 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 relative min-h-[90vh]">
      {/* Background glow meshes */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-purple-600/5 blur-[130px] pointer-events-none animate-drift-glow-1" />
      <div className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-drift-glow-2" />
      
      {/* Left side: Fitness Headline and Description */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 items-start z-10 text-left animate-fade-in-up">
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase tracking-widest select-none shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Transforming Health with Gemini AI</span>
        </div>
        
        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl xl:text-6.5xl font-black tracking-tight text-white leading-[1.08] font-sans">
            Train Smarter.<br />
            Eat Better.<br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse">Transform Your Fitness</span> with AI.
          </h1>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
          FitAI is an AI-powered fitness platform that helps people become healthier. Track workouts, calories, nutrition, hydration, goals, and receive personalized AI fitness suggestions in one integrated space.
        </p>

        {/* Technical Highlights */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Activity className="w-4 h-4 text-purple-400 shrink-0" />
            <span>AI Health Indexing</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Visual Calorie Parsing</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Dumbbell className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Interactive Workout Logs</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Heart className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Adaptive Suggestions</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
          <button
            onClick={handleCTA}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2.5 group border border-white/10"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}</span>
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-y-[-1px] group-hover:translate-x-[1px] transition-all" />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Premium fitness-themed smartwatch and runner biometric SVG illustration */}
      <div className="w-full lg:w-1/2 flex items-center justify-center z-10 select-none animate-fade-in-up">
        <div className="w-full max-w-[500px] aspect-square relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
          
          {/* Main Fitness Vector SVG */}
          <svg 
            viewBox="0 0 600 600" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            {/* Hologram/Radar background lines */}
            <circle cx="300" cy="300" r="260" stroke="rgba(168, 85, 247, 0.04)" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="300" cy="300" r="200" stroke="rgba(6, 182, 212, 0.06)" strokeWidth="1.5" />
            
            {/* Pulsing EKG path line in the background */}
            <path 
              d="M 50,450 Q 150,420 200,430 T 350,390 T 500,440" 
              stroke="rgba(236, 72, 153, 0.12)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Runner Athlete Outline */}
            <g transform="translate(180, 150)" className="opacity-95">
              {/* Torso */}
              <path 
                d="M 120,40 C 130,30 145,35 150,50 L 160,85 L 130,120 L 105,95 Z" 
                fill="rgba(168, 85, 247, 0.08)" 
                stroke="url(#fitnessRunnerGrad)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#runnerGlow)"
              />
              {/* Head */}
              <circle cx="155" cy="20" r="12" fill="rgba(34, 211, 238, 0.15)" stroke="#22d3ee" strokeWidth="2.5" />
              {/* Arms */}
              <path d="M 130,45 L 90,55 L 70,85" stroke="url(#fitnessRunnerGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 148,50 L 180,60 L 195,95" stroke="url(#fitnessRunnerGrad)" strokeWidth="3.5" strokeLinecap="round" filter="url(#runnerGlow)" />
              {/* Legs */}
              <path d="M 115,105 L 85,145 L 110,195" stroke="url(#fitnessRunnerGrad)" strokeWidth="3" strokeLinecap="round" />
              <path d="M 135,110 L 160,160 L 140,210" stroke="url(#fitnessRunnerGrad)" strokeWidth="3.5" strokeLinecap="round" filter="url(#runnerGlow)" />
              
              {/* Smartwatch Badge Indicator on Wrist */}
              <circle cx="193" cy="90" r="6" fill="#030712" stroke="#22d3ee" strokeWidth="2" />
            </g>

            {/* Floating Fitness Panel 1: Smartwatch HR detail */}
            <g transform="translate(380, 80)" className="animate-float-slow">
              <rect width="100" height="100" rx="22" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
              <path d="M 50,30 C 50,30 46,26 43,28.5 C 41,30.5 42.5,33.5 50,38.5 C 57.5,33.5 59,30.5 57,28.5 C 54,26 50,30 50,30 Z" fill="#ec4899" className="animate-pulse" style={{ transformOrigin: '50px 33px' }} />
              <text x="50" y="58" fill="#ffffff" fontSize="14" fontWeight="950" textAnchor="middle">136 <tspan fontSize="8" fill="#94a3b8" fontWeight="bold">BPM</tspan></text>
              <path d="M 22,72 A 28,28 0 0 1 78,72" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 22,72 A 28,28 0 0 1 65,72" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
              <text x="50" y="84" fill="#22d3ee" fontSize="7.5" fontWeight="black" textAnchor="middle">CARDIO ZONE</text>
            </g>

            {/* Floating Fitness Panel 2: Calories burned */}
            <g transform="translate(420, 210)" className="animate-float-medium">
              <rect width="160" height="85" rx="16" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(249, 115, 22, 0.3)" strokeWidth="1.5" />
              <text x="14" y="24" fill="#94a3b8" fontSize="9" fontWeight="bold" letterSpacing="0.05em">ENERGY BURNED</text>
              <text x="14" y="50" fill="#ffffff" fontSize="20" fontWeight="900">450 <tspan fontSize="11" fill="#f97316" fontWeight="bold">KCAL</tspan></text>
              <line x1="14" y1="64" x2="146" y2="64" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="14" y1="64" x2="110" y2="64" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="134" cy="36" r="12" fill="rgba(249, 115, 22, 0.1)" stroke="rgba(249, 115, 22, 0.2)" />
              <path d="M 134,31 C 134,31 131,34 131,36.5 C 131,39 133,40 134,40 C 135,40 137,39 137,36.5 C 137,34 134,31 134,31 Z" fill="#f97316" />
            </g>

            {/* Floating Fitness Panel 3: Water Intakes */}
            <g transform="translate(40, 400)" className="animate-float-fast">
              <rect width="150" height="85" rx="16" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.5" />
              <text x="14" y="22" fill="#94a3b8" fontSize="9" fontWeight="bold" letterSpacing="0.05em">HYDRATION LOGS</text>
              <text x="14" y="48" fill="#ffffff" fontSize="18" fontWeight="900">1.2 <tspan fontSize="11" fill="#06b6d4" fontWeight="bold">/ 2.5 L</tspan></text>
              <line x1="14" y1="62" x2="136" y2="62" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="4" strokeLinecap="round" />
              <line x1="14" y1="62" x2="76" y2="62" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Floating Fitness Panel 4: BMI status */}
            <g transform="translate(15, 170)" className="animate-float-slow">
              <rect width="160" height="85" rx="16" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
              <text x="14" y="22" fill="#94a3b8" fontSize="9" fontWeight="bold" letterSpacing="0.05em">HEALTH SCALE</text>
              <text x="14" y="46" fill="#ffffff" fontSize="18" fontWeight="900">22.8 <tspan fontSize="9" fill="#10b981" fontWeight="black">BMI NORMAL</tspan></text>
              <line x1="14" y1="62" x2="146" y2="62" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="45" y1="62" x2="105" y2="62" stroke="#10b981" strokeWidth="4.5" />
            </g>

            {/* Definitions */}
            <defs>
              <filter id="runnerGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="fitnessRunnerGrad" x1="120" y1="20" x2="140" y2="210" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
