import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const Counter = ({ target, suffix = '', duration = 1200 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) {
      setCount(target);
      return;
    }

    const stepTime = Math.max(Math.floor(duration / end), 8);
    const timer = setInterval(() => {
      start += Math.ceil(end / 40); // larger step sizes for fast counters
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return (
    <span ref={elementRef} className="font-sans font-black">
      {count}
      {suffix}
    </span>
  );
};

const Stats = () => {
  const statsData = [
    { target: '50', suffix: 'K+', label: 'Workouts Logged', desc: 'Real-time exercise tracking' },
    { target: '1200', suffix: '+', label: 'Healthy Meals Analysed', desc: 'Gemini visual estimations' },
    { target: '98', suffix: '%', label: 'AI Accuracy', desc: 'Top-tier recommendation alignment' },
    { target: '24', suffix: '/7', label: 'AI Coach', desc: 'Continuous wellness updates' },
    { target: '500', suffix: '+', label: 'Goals Completed', desc: 'Active milestones hit today' }
  ];

  return (
    <section className="py-20 bg-slate-950/20 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Subtle top indicator */}
        <div className="flex justify-center items-center gap-2 mb-12">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-indigo-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" /> FitAI Platform Stats
          </span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-indigo-500" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {statsData.map((stat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl border border-white/5 bg-slate-900/10 backdrop-blur-md flex flex-col gap-2 relative overflow-hidden group hover:border-purple-500/25 hover:bg-slate-900/20 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-full bg-purple-500/5 blur-[25px] pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
              
              <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                <Counter target={stat.target} suffix={stat.suffix} />
              </span>
              
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-100 text-xs md:text-sm">{stat.label}</h4>
                <p className="text-[10px] md:text-xs text-slate-450 leading-snug">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;
