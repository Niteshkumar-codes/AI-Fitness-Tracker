import React from 'react';
import { 
  Award, 
  Dumbbell, 
  Flame, 
  Camera, 
  Droplet, 
  Target, 
  Scale, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

const Features = () => {
  const cards = [
    {
      title: 'AI Fitness Coach',
      desc: 'Get personalizedweekly coaching팁 and activity analytics generated automatically from your fitness history logs.',
      icon: <Award className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Workout Tracker',
      desc: 'Record exercises by duration and calories burned. Maintain structured activity records in your calendar logs.',
      icon: <Dumbbell className="w-6 h-6 text-cyan-400" />
    },
    {
      title: 'Nutrition & Calories',
      desc: 'Track your daily calorie balance, carbohydrate metrics, protein quantities, and total fats eaten.',
      icon: <Flame className="w-6 h-6 text-orange-400" />
    },
    {
      title: 'AI Food Analyzer',
      desc: 'Enter plain food descriptions (e.g. "two boiled eggs") or log food photo uploads to automatically extract macros.',
      icon: <Camera className="w-6 h-6 text-purple-400" />
    },
    {
      title: 'Water Intake Tracking',
      desc: 'Sync daily water intake targets, logging millilitre consumption with quick increments or resets.',
      icon: <Droplet className="w-6 h-6 text-blue-400" />
    },
    {
      title: 'Goal Tracking',
      desc: 'Define and track short-term or long-term Weight Loss and Calorie Deficit targets with interactive visual graphs.',
      icon: <Target className="w-6 h-6 text-emerald-450" />
    },
    {
      title: 'BMI & Health Analytics',
      desc: 'Assess your Body Mass Index classifications dynamically against the WHO scale and review active health reports.',
      icon: <Scale className="w-6 h-6 text-indigo-400" />
    },
    {
      title: 'Progress Dashboard',
      desc: 'View comprehensive daily metrics summaries, activity streaks, and synchronization status panels in one place.',
      icon: <LayoutDashboard className="w-6 h-6 text-pink-400" />
    }
  ];

  return (
    <section id="features" className="py-24 border-t border-white/5 bg-slate-950/40 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[9.5px] font-black uppercase tracking-widest select-none">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Health Optimization
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            Showcase Features
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Every feature you need to monitor daily biometrics, nutrition logs, water targets, and training schedules.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="p-[1.2px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-purple-500/35 hover:to-indigo-500/25 transition-all duration-300 group shadow-md hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(99,102,241,0.15)]"
            >
              {/* Inner box */}
              <div className="p-6 rounded-[23px] bg-slate-950/85 backdrop-blur-2xl flex flex-col gap-5 h-full text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[90px] h-[90px] rounded-full bg-purple-500/5 blur-[35px] pointer-events-none" />
                
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:scale-108 transition-all">
                  {card.icon}
                </div>

                {/* Content */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="font-extrabold text-white text-sm sm:text-base tracking-tight group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-450 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {card.desc}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
