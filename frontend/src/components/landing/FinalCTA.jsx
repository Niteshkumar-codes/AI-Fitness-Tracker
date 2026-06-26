import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const FinalCTA = () => {
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
    <section className="py-24 relative z-10 overflow-hidden bg-slate-950">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Card Wrapper with shifting gradient background */}
        <div className="p-10 md:p-16 rounded-[32px] border border-white/10 bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-purple-950/60 backdrop-blur-3xl relative overflow-hidden group hover:border-purple-500/25 transition-all duration-500 text-center flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-gradient-bg">
          
          {/* Inner mesh highlights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-purple-500/15 blur-[65px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[9.5px] font-black uppercase tracking-widest select-none relative z-10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Transform Your Lifestyle
          </div>

          {/* Heading */}
          <div className="space-y-3.5 max-w-2xl relative z-10">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none font-sans">
              Start Your AI Fitness Journey Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
              Take complete control of your workouts, calories, macros, hydration levels, and targets. Receive customized feedback tips from our Gemini AI coach.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-2 relative z-10">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm py-4 px-8 rounded-xl transition-all shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2.5 group border border-purple-500/20"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-900/90 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default FinalCTA;
