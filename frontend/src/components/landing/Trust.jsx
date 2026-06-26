import React from 'react';
import { Star, GraduationCap, Dumbbell, Code, Briefcase } from 'lucide-react';

const Trust = () => {
  const categories = [
    {
      name: 'Students',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />,
      company: 'CampusFit',
      desc: 'Smart meal plans'
    },
    {
      name: 'Fitness Enthusiasts',
      icon: <Dumbbell className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />,
      company: 'PulseAthletics',
      desc: 'Precise workout analytics'
    },
    {
      name: 'Developers',
      icon: <Code className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />,
      company: 'CodeGym',
      desc: 'API health tracking'
    },
    {
      name: 'Job Seekers',
      icon: <Briefcase className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />,
      company: 'RecruitFit',
      desc: 'Optimized schedules'
    }
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-slate-950/60 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Rating Column */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shrink-0">
          <div className="flex -space-x-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
            ))}
          </div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-tight">4.9/5 Rating</div>
            <div className="text-xs text-slate-400 font-semibold">Empowering 15,000+ daily sessions</div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="hidden lg:block w-[1px] h-10 bg-white/10" />

        {/* Categories / Logos */}
        <div className="w-full flex-1 flex flex-wrap items-center justify-center lg:justify-end gap-6 sm:gap-10">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block w-full text-center lg:w-auto lg:text-left mb-2 lg:mb-0">
            Trusted By
          </span>
          
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full lg:w-auto">
            {categories.map((cat, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 shadow-md relative overflow-hidden group hover:border-purple-500/20 hover:bg-white/10 hover:shadow-lg transition-all duration-300 animate-float-medium"
                style={{ animationDelay: `${idx * 0.5}s` }}
              >
                <div className="p-1.5 rounded-lg bg-slate-900/60 border border-white/5 flex items-center justify-center">
                  {cat.icon}
                </div>
                <div className="flex flex-col text-left select-none">
                  <span className="text-xs font-black text-white leading-tight tracking-tight">{cat.company}</span>
                  <span className="text-[9px] font-bold text-slate-400 tracking-tight leading-none">{cat.name}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Trust;
