import React from 'react';
import { Sparkles, Heart, Activity, Apple, MessageSquareCode, Target } from 'lucide-react';

const AIFeatures = () => {
  const benefits = [
    {
      title: 'Personalized Workout Suggestions',
      desc: 'Get custom exercise suggestions matching your weight, height, activity level, and BMI baseline to optimize recovery and progression.',
      icon: <Activity className="w-5.5 h-5.5 text-cyan-400" />
    },
    {
      title: 'Meal Analysis & Calorie Estimation',
      desc: 'Convert text descriptions of dishes or log food photos into accurate estimations of daily calories, protein, carbs, and fats instantly.',
      icon: <Apple className="w-5.5 h-5.5 text-orange-400" />
    },
    {
      title: 'Bespoke Health Insights',
      desc: 'Receive AI-calculated health assessments. Gemini analyzes daily habits to score your consistency and highlight physical strengths.',
      icon: <Heart className="w-5.5 h-5.5 text-pink-400" />
    },
    {
      title: 'Goal Recommendations',
      desc: 'Receive adaptive recommendations for calorie deficits and weight milestones aligned with your daily exercise performance.',
      icon: <Target className="w-5.5 h-5.5 text-emerald-450" />
    },
    {
      title: 'Natural Language Assistant',
      desc: 'Chat 24/7 with a conversational fitness trainer. Query diet plans, exercise form, or healthy habit building in a chat workspace.',
      icon: <MessageSquareCode className="w-5.5 h-5.5 text-purple-400" />
    }
  ];

  return (
    <section id="ai-features" className="py-24 border-t border-white/5 bg-slate-950/20 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[9.5px] font-black uppercase tracking-widest select-none">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Gemini Intelligence
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            AI-Driven Wellness Guidance
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            FitAI integrates with advanced language models to provide custom suggestions. We focus on active wellness metrics to help you transform your lifestyle.
          </p>
        </div>

        {/* Benefits Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((item, idx) => (
            <div 
              key={idx}
              className={`p-[1px] rounded-3xl bg-gradient-to-br from-white/5 to-transparent hover:from-purple-500/35 hover:to-indigo-500/25 transition-all duration-500 group shadow-md ${
                idx === 3 || idx === 4 ? 'lg:col-span-1.5' : ''
              }`}
            >
              {/* Inner card */}
              <div className="p-8 rounded-[23px] bg-slate-950/90 backdrop-blur-2xl flex flex-col gap-6 h-full text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-purple-500/5 blur-[45px] pointer-events-none" />
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:scale-108 transition-all">
                  {item.icon}
                </div>

                {/* Text info */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="font-extrabold text-white text-base tracking-tight group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-450 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {item.desc}
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

export default AIFeatures;
