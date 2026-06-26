import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Activity } from 'lucide-react';

const Footer = () => {
  const showToastPlaceholder = (title, icon) => {
    toast(title, {
      icon: icon,
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        borderRadius: '1rem',
      }
    });
  };

  return (
    <footer id="footer" className="py-16 border-t border-white/5 bg-slate-950/60 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-12 text-left">
        
        {/* Brand Info */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center group-hover:border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
              <Activity className="w-5 h-5 text-purple-400 group-hover:scale-108 transition-transform" />
            </div>
            <span className="text-base font-black tracking-tight text-white leading-none">FitAI</span>
          </Link>
          <p className="text-xs text-slate-455 text-center md:text-left max-w-xs leading-relaxed">
            FitAI delivers personalized fitness suggestions, calorie tracking, and weekly coaching recommendations for healthy living.
          </p>
        </div>

        {/* Links Column Grid */}
        <div className="flex flex-col sm:flex-row gap-16 text-center md:text-left text-xs text-slate-400">
          
          {/* Quick Links */}
          <div className="flex flex-col gap-3.5">
            <span className="font-black text-white uppercase tracking-widest text-[9.5px]">Quick Links</span>
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ai-features" className="hover:text-white transition-colors">AI Coach</a>
            <a href="#preview" className="hover:text-white transition-colors">Dashboard Preview</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); showToastPlaceholder('Contact channels placeholder', '📞'); }} 
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-col gap-3.5">
            <span className="font-black text-white uppercase tracking-widest text-[9.5px]">Legal Links</span>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); showToastPlaceholder('Privacy Policy placeholder', '🛡️'); }} 
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); showToastPlaceholder('Terms of Service placeholder', '📋'); }} 
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>

        </div>

      </div>

      {/* Made with & Copyright info */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-12 pt-8 text-center sm:text-left text-[10.5px] text-slate-500 font-semibold select-none">
        <p>© 2026 FitAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
