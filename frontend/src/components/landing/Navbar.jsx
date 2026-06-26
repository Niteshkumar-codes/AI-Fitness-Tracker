import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Activity, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full backdrop-blur-xl bg-slate-950/75 border-b border-white/5 z-50 transition-all select-none">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-350 group-hover:border-purple-500/35 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 opacity-60 group-hover:scale-110 transition-transform" />
            <Activity className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white leading-tight group-hover:text-purple-300 transition-colors">FitAI</span>
            <span className="text-[7.5px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Fitness Intelligence</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all hover:after:w-full">Home</a>
          <a href="#features" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all hover:after:w-full">Features</a>
          <a href="#ai-features" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all hover:after:w-full">AI Coaching</a>
          <a href="#how-it-works" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all hover:after:w-full">How It Works</a>
          <a href="#preview" className="hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all hover:after:w-full">Preview</a>
        </div>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link 
              to="/dashboard"
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] hover:scale-[1.03] active:scale-98 relative overflow-hidden group border border-white/10"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-550" />
            </Link>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-slate-300 hover:text-white font-bold text-xs transition-colors px-4 py-2 hover:bg-white/5 rounded-lg"
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(168,85,247,0.15)] hover:scale-[1.03] active:scale-98 border border-purple-500/20"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-900/60 backdrop-blur-2xl p-6 flex flex-col gap-5 text-sm font-semibold select-none animate-fade-in-up">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-1">Home</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-1">Features</a>
          <a href="#ai-features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-1">AI Coaching</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-1">How It Works</a>
          <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-1">Preview</a>
          
          <hr className="border-slate-900" />
          
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <Link 
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-slate-300 hover:text-white font-semibold py-3 hover:bg-white/5 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
