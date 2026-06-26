import React from 'react';
import { UserPlus, PlusCircle, Sparkles, LayoutDashboard } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Sign up in seconds and complete your physical profile—specify your age, height, weight, gender, and daily active target.',
      icon: <UserPlus className="w-5 h-5 text-purple-400" />
    },
    {
      num: '02',
      title: 'Track Workouts & Meals',
      desc: 'Maintain daily logs of exercises, macro nutrition quantities (protein, carbs, fats), and millilitre water intake sessions.',
      icon: <PlusCircle className="w-5 h-5 text-indigo-400" />
    },
    {
      num: '03',
      title: 'Receive AI Recommendations',
      desc: 'Our Gemini integration processes your metrics to deliver custom weekly suggestions, calorie target reviews, and dietary tips.',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />
    },
    {
      num: '04',
      title: 'Monitor Progress & Reach Goals',
      desc: 'Check your overall Health Score, track BMI indices, follow active deficit percentages, and complete milestones.',
      icon: <LayoutDashboard className="w-5 h-5 text-emerald-450" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 border-t border-white/5 bg-slate-950/40 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20 animate-fade-in-up">
          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">Seamless flow</span>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            How FitAI Works
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Four easy steps to configure your biometrics, track logs, receive guidance, and reach goals.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative max-w-6xl mx-auto">
          
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-white/5 pointer-events-none overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line 
                x1="0" 
                y1="1" 
                x2="100%" 
                y2="1" 
                stroke="url(#worksTrailGrad)" 
                strokeWidth="2" 
                className="animate-timeline-trail" 
              />
            </svg>
          </div>

          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center lg:items-start text-center lg:text-left gap-5 relative z-10 group"
            >
              {/* Badge Circle */}
              <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center relative shadow-lg group-hover:border-purple-500/35 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 rounded-3xl opacity-60 group-hover:scale-105 transition-transform" />
                <div className="absolute top-[-4px] left-[-4px] w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-[10px] font-black text-purple-400">
                  {step.num}
                </div>
                <div className="p-3 bg-slate-950/60 border border-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>

              {/* Description Info */}
              <div className="space-y-2 max-w-[260px] lg:max-w-none">
                <h4 className="font-extrabold text-white text-base tracking-tight group-hover:text-purple-300 transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed group-hover:text-slate-350 transition-colors">
                  {step.desc}
                </p>
              </div>

              {/* Mobile Arrows */}
              {idx < steps.length - 1 && (
                <div className="lg:hidden text-slate-700 text-lg font-black my-2 animate-bounce">
                  ↓
                </div>
              )}
            </div>
          ))}

        </div>

      </div>

      {/* SVG grads */}
      <svg className="hidden">
        <defs>
          <linearGradient id="worksTrailGrad" x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};

export default HowItWorks;
