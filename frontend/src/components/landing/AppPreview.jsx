import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Apple, 
  Award, 
  Droplet, 
  Target, 
  TrendingUp,
  Sparkles,
  Search,
  Plus,
  Heart,
  ChevronRight
} from 'lucide-react';

const AppPreview = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Main Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, url: 'fitai.com/dashboard' },
    { id: 'workouts', label: 'Workout Tracker', icon: <Dumbbell className="w-4 h-4" />, url: 'fitai.com/workouts' },
    { id: 'food', label: 'Food Tracker', icon: <Apple className="w-4 h-4" />, url: 'fitai.com/food' },
    { id: 'coach', label: 'AI Coach Feedback', icon: <Award className="w-4 h-4" />, url: 'fitai.com/ai-coach' },
    { id: 'water', label: 'Water Tracker', icon: <Droplet className="w-4 h-4" />, url: 'fitai.com/water' },
    { id: 'goals', label: 'Goals Manager', icon: <Target className="w-4 h-4" />, url: 'fitai.com/goals' }
  ];

  // Helper to render browser screens
  const renderBrowserScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-col gap-5 p-6 h-full text-left bg-slate-950/80">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h4 className="text-base font-extrabold text-white">Welcome back, User</h4>
                <p className="text-[10px] text-slate-500">Your health and fitness stats for today</p>
              </div>
              <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/5 px-2.5 py-1 rounded-lg border border-cyan-500/15 uppercase tracking-wider">AI Synced</span>
            </div>
            
            {/* Grid of mini metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block">Energy Balance</span>
                  <span className="text-xl font-extrabold text-white">1,400 <span className="text-[10px] text-slate-500 font-normal">kcal</span></span>
                </div>
                <FlameIcon className="w-8 h-8 text-orange-450 opacity-60" />
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block">BMI Index</span>
                  <span className="text-xl font-extrabold text-white">22.8</span>
                </div>
                <ScaleIcon className="w-8 h-8 text-indigo-400 opacity-60" />
              </div>
            </div>

            {/* AI suggestion popup */}
            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 flex gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-black text-white">AI Coach Insights</h5>
                <p className="text-[10.5px] text-slate-400 leading-normal pt-1">Consistency rating is high. Focus on increasing protein by 15g tomorrow to match your Calorie Deficit goals target.</p>
              </div>
            </div>
          </div>
        );

      case 'workouts':
        return (
          <div className="flex flex-col gap-4 p-6 h-full text-left bg-slate-950/80">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h4 className="text-base font-extrabold text-white">Workout History</h4>
                <p className="text-[10px] text-slate-500">Log new exercises and view records</p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
                <Plus className="w-3.5 h-3.5" /> Log Workout
              </button>
            </div>

            {/* Simulated workout form list */}
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-extrabold text-white">Evening Running Session</h5>
                  <p className="text-[10px] text-slate-500">Logged yesterday • 350 kcal burned</p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg">45 mins</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-extrabold text-white">Gym Weight Training</h5>
                  <p className="text-[10px] text-slate-500">Logged 3 days ago • 280 kcal burned</p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg">60 mins</span>
              </div>
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="flex flex-col gap-4 p-6 h-full text-left bg-slate-950/80">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h4 className="text-base font-extrabold text-white">Daily Food Logger</h4>
                <p className="text-[10px] text-slate-500">Analyze macros and track balances</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AI Scan
              </button>
            </div>

            {/* Macros chart list */}
            <div className="grid grid-cols-4 gap-2.5 text-center bg-slate-900/20 p-3.5 rounded-xl border border-white/5">
              <div>
                <div className="text-xs font-extrabold text-orange-400">1,850 kcal</div>
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Calories</div>
              </div>
              <div>
                <div className="text-xs font-extrabold text-purple-400">120g</div>
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Protein</div>
              </div>
              <div>
                <div className="text-xs font-extrabold text-cyan-400">185g</div>
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Carbs</div>
              </div>
              <div>
                <div className="text-xs font-extrabold text-emerald-450">48g</div>
                <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Fats</div>
              </div>
            </div>

            {/* List */}
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Grilled chicken breast & white rice</span>
              <span className="text-slate-550 font-bold">540 kcal</span>
            </div>
          </div>
        );

      case 'coach':
        return (
          <div className="flex flex-col gap-4 p-6 h-full text-left bg-slate-950/80 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h4 className="text-base font-extrabold text-white">AI Coach Insights</h4>
                <p className="text-[10px] text-slate-500">Personalized feedback from Google Gemini</p>
              </div>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>

            {/* Dialogue block */}
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl border border-white/5 bg-slate-900/20 text-xs leading-relaxed text-slate-300 space-y-2">
                <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Weekly Consistency Report</div>
                <p>"Based on your 5-day active workout logs, your cardiovascular output is highly consistent. However, your food macros indicate a deficit of 20g protein on training days. To support recovery, I recommend incorporating a protein shake (250ml water + whey) immediately post-exercise."</p>
              </div>
              
              <div className="p-3.5 rounded-xl border border-purple-500/10 bg-purple-500/5 text-[10.5px] text-slate-400 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Next review scheduled in 3 days. Keep up the workouts!</span>
              </div>
            </div>
          </div>
        );

      case 'water':
        return (
          <div className="flex flex-col gap-4 p-6 h-full text-left bg-slate-950/80">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h4 className="text-base font-extrabold text-white">Water Tracker</h4>
                <p className="text-[10px] text-slate-500">Hydration session logs</p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">5.0 Glasses</span>
            </div>

            {/* Visual meter */}
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Today\'s Logs</span>
                <div className="text-2xl font-black text-white mt-1">1,250 ml <span className="text-xs text-slate-500">/ 2,500 ml</span></div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Droplet className="w-6 h-6 fill-blue-400/20" />
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-900 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="flex flex-col gap-4 p-6 h-full text-left bg-slate-950/80">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h4 className="text-base font-extrabold text-white">Active Goals</h4>
                <p className="text-[10px] text-slate-500">Track targets and milestones</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                <Plus className="w-3.5 h-3.5" /> New Goal
              </button>
            </div>

            {/* Goal list */}
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/30 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Weight Loss Goal</span>
                  <span className="text-slate-500">70kg &rarr; <strong className="text-white">65kg</strong></span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-900">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/30 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">Calorie Deficit Goal</span>
                  <span className="text-slate-500">1850kcal &rarr; <strong className="text-white">1800kcal</strong></span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-900">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="preview" className="py-24 border-t border-white/5 bg-slate-950/20 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">Explore workspace</span>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            Inside FitAI
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Take a walk through the main modules of the FitAI platform workspace. Simple logs interfaces designed to keep your metrics accurate.
          </p>
        </div>

        {/* Tabbed interface layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Left tabs selector */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 shrink-0 scrollbar-none select-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3.5 px-4.5 py-4.5 rounded-2xl border text-xs font-black uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-purple-600/10 border-purple-500/30 text-white shadow-md' 
                      : 'bg-slate-900/20 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-900 text-slate-500'}`}>
                    {tab.icon}
                  </div>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right browser mockup screen wrapper */}
          <div className="flex-1 p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 relative overflow-hidden shadow-2xl min-h-[360px] flex flex-col justify-stretch">
            
            {/* Simulated Browser Address bar header */}
            <div className="h-12 border-b border-white/5 bg-slate-900/80 backdrop-blur-md flex items-center px-4 justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <div className="w-1/2 max-w-[280px] h-6 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 gap-1.5">
                <Search className="w-3 h-3 text-slate-600" />
                <span>{tabs.find(t => t.id === activeTab)?.url}</span>
              </div>
              <div className="w-8" />
            </div>

            {/* Screen Content */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden">
              {renderBrowserScreen()}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

// Simple Icon Placeholders to avoid dependency load issues
const FlameIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const ScaleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1" />
    <rect x="3" y="5" width="18" height="11" rx="2" />
    <path d="M12 5v11" />
  </svg>
);

export default AppPreview;
