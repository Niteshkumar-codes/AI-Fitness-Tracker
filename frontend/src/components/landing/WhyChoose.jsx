import React from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  LayoutDashboard, 
  Smartphone, 
  Heart, 
  Eye 
} from 'lucide-react';

const WhyChoose = () => {
  const benefits = [
    {
      title: 'Personalized AI Guidance',
      desc: 'Get coaching suggestions calculated directly from your height, weight, active logs, and heart rate history.',
      icon: <Sparkles className="w-5.5 h-5.5 text-purple-400" />
    },
    {
      title: 'Easy Daily Tracking',
      desc: 'Log physical workouts, macro nutrition values, and daily water consumption in a few simple clicks.',
      icon: <PlusCircle className="w-5.5 h-5.5 text-cyan-400" />
    },
    {
      title: 'Modern Dashboard',
      desc: 'Review all your key fitness telemetry (BMI classifications, caloric balances, streaks) on one page.',
      icon: <LayoutDashboard className="w-5.5 h-5.5 text-pink-400" />
    },
    {
      title: 'Cross Device Experience',
      desc: 'Optimized layout fits desktops, laptops, tablets, and mobile screens seamlessly for tracking on the go.',
      icon: <Smartphone className="w-5.5 h-5.5 text-blue-400" />
    },
    {
      title: 'Healthy Habit Building',
      desc: 'Visual water targets and workout activity streaks encourage consistency and wellness habits.',
      icon: <Heart className="w-5.5 h-5.5 text-emerald-450" />
    },
    {
      title: 'Beautiful User Experience',
      desc: 'A premium interface featuring glassmorphic overlays, vibrant gradients, and fluid transitions.',
      icon: <Eye className="w-5.5 h-5.5 text-indigo-400" />
    }
  ];

  return (
    <section className="py-24 border-t border-white/5 bg-slate-950/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Why FitAI</h2>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            Transforming Healthy Lifestyles
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Our platform focuses on user habits and outcomes, making health monitoring clear and accessible.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx}
              className="p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-purple-500/35 hover:to-indigo-500/25 transition-all duration-300 group shadow-md"
            >
              <div className="p-7 rounded-[23px] bg-slate-950/90 backdrop-blur-2xl flex flex-col gap-4.5 h-full text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full bg-purple-500/5 blur-[35px] pointer-events-none" />
                
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:scale-108 transition-all">
                  {benefit.icon}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-white text-base tracking-tight group-hover:text-purple-300 transition-colors">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-slate-450 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {benefit.desc}
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

export default WhyChoose;
