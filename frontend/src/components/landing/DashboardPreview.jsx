import React, { useState } from 'react';
import { 
  Heart, 
  Scale, 
  Flame, 
  Droplet, 
  Dumbbell, 
  Target, 
  Plus, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Apple,
  Clock,
  ChevronRight
} from 'lucide-react';

const DashboardPreview = () => {
  // Interactive WaterCard state simulation
  const [waterMl, setWaterMl] = useState(750);
  const waterGoal = 2000;
  const progressPercent = Math.min(100, Math.round((waterMl / waterGoal) * 100));
  const glasses = (waterMl / 250).toFixed(1);

  const addWater = () => {
    setWaterMl(prev => Math.min(waterGoal * 2, prev + 250));
  };

  const resetWater = () => {
    setWaterMl(0);
  };

  // Health Score Circular Progress properties
  const score = 78;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <section className="py-24 border-t border-white/5 bg-slate-950/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[9.5px] font-black uppercase tracking-widest select-none">
            <Target className="w-3.5 h-3.5" /> Interactive UI Preview
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            Real Dashboard Interface
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Test the live water logging widget below. This dashboard simulation renders the exact widgets, styles, and configurations of the authenticated FitAI workspace.
          </p>
        </div>

        {/* Dashboard Browser Frame Mockup */}
        <div className="w-full p-[1px] rounded-3xl bg-gradient-to-br from-indigo-500/30 via-slate-950 to-purple-500/25 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden group">
          <div className="p-6 md:p-8 rounded-[23px] bg-slate-950/90 backdrop-blur-3xl flex flex-col gap-6 relative">
            
            {/* Browser top navigation bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-white/5 text-left">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="hidden sm:block w-[1px] h-4 bg-white/10 mx-2" />
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>fitai-user-workspace-v1</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-450 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Actual App UI Mocks</span>
              </div>
            </div>

            {/* Dashboard Content Grid layout mimicking Dashboard.jsx */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. HealthScoreCard (Google Gemini Assessment) */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-blue-950/20 via-slate-900/30 to-indigo-950/20 backdrop-blur-md relative overflow-hidden text-left flex flex-col justify-between h-full min-h-[240px]">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Heart className="w-5 h-5 fill-blue-400/25" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 text-sm">Health Score</h3>
                        <p className="text-[10px] text-slate-400">AI Calculations</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border text-blue-400 bg-blue-500/10 border-blue-500/20">
                      Good Status
                    </span>
                  </div>

                  {/* Circle Score info */}
                  <div className="flex items-center justify-between my-2">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Overall Rating</span>
                      <span className="text-4xl font-black text-white">{score} <tspan className="text-xs text-slate-500">/ 100</tspan></span>
                    </div>
                    
                    {/* SVG Progress Circle */}
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5" fill="none" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          stroke="#60a5fa" 
                          strokeWidth="4.5" 
                          fill="none" 
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 32 32)"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{score}%</span>
                    </div>
                  </div>
                </div>

                {/* Key Strengths summaries */}
                <div className="space-y-1.5 mt-2 border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Consistent hydration targets</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Positive caloric balance</span>
                  </div>
                </div>
              </div>

              {/* 2. BMICard (WHO classification) */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-purple-950/20 via-slate-900/30 to-indigo-950/20 backdrop-blur-md relative overflow-hidden text-left flex flex-col justify-between h-full min-h-[240px]">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 text-sm">Health Index</h3>
                        <p className="text-[10px] text-slate-400">Body Mass Index</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                      Normal Weight
                    </span>
                  </div>

                  {/* Computed BMI values */}
                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Computed BMI</span>
                      <span className="text-4xl font-extrabold text-white tracking-tight leading-none">22.8</span>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <span className="block font-medium">Height: <strong className="text-slate-200">175 cm</strong></span>
                      <span className="block font-medium">Weight: <strong className="text-slate-200">70 kg</strong></span>
                    </div>
                  </div>
                </div>

                {/* WHO Scale Slider */}
                <div className="space-y-2 mt-4 border-t border-white/5 pt-3">
                  <div className="h-2.5 rounded-full bg-slate-950/80 p-[2px] border border-slate-900/60 relative">
                    <div className="absolute inset-y-[2px] left-[2px] right-[2px] flex rounded-full overflow-hidden opacity-60">
                      <div className="w-[20%] bg-amber-500"></div>
                      <div className="w-[35%] bg-emerald-500"></div>
                      <div className="w-[25%] bg-orange-500"></div>
                      <div className="w-[20%] bg-red-500"></div>
                    </div>
                    {/* Marker pin on 50% */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border border-purple-500 shadow-md" style={{ left: '46%' }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                    <span>18.5 Under</span>
                    <span>25.0 Over</span>
                  </div>
                </div>
              </div>

              {/* 3. WaterCard (FULLY INTERACTIVE PREVIEW!) */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden text-left flex flex-col justify-between h-full min-h-[240px]">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Droplet className="w-5 h-5 fill-blue-400/20" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 text-sm">Water Tracker</h3>
                        <p className="text-[10px] text-slate-400">Hydration target</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">
                      {glasses} Glasses
                    </span>
                  </div>

                  {/* Daily ml value logs */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{waterMl}</span>
                    <span className="text-xs text-slate-500 font-bold">/ {waterGoal} ml</span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Daily Target</span>
                      <span className="text-blue-400 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950/80 p-[2px] border border-slate-900">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 ease-out shadow-lg shadow-blue-500/20"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Actions logs triggers */}
                <div className="flex gap-2.5 mt-6 relative z-10">
                  <button
                    onClick={addWater}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 cursor-pointer select-none"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log +250ml
                  </button>
                  <button
                    onClick={resetWater}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label="Reset water log"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4. CaloriesCard (Consumed vs Burned balance) */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden text-left flex flex-col justify-between h-full min-h-[220px]">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <Flame className="w-5 h-5 fill-orange-400/15" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm">Energy Balance</h3>
                      <p className="text-[10px] text-slate-400">Caloric consumption & burn</p>
                    </div>
                  </div>

                  {/* Consumed box */}
                  <div className="bg-slate-950/60 border border-slate-900/85 rounded-2xl p-4 flex items-center justify-between mt-1">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block">Net Calories</span>
                      <span className="text-3xl font-extrabold text-white tracking-tight leading-none">1,400</span>
                      <span className="text-[10px] text-slate-450 ml-1">kcal</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold">
                      Active Deficit
                    </span>
                  </div>

                  {/* breakdown grid */}
                  <div className="grid grid-cols-2 gap-4 mt-1 border-t border-white/5 pt-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <Apple className="w-3.5 h-3.5 text-red-400" /> Consumed
                      </span>
                      <span className="text-base font-bold text-slate-200">1,850 <span className="text-[10px] text-slate-500 font-normal">kcal</span></span>
                    </div>
                    <div className="space-y-1 border-l border-white/5 pl-4">
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" /> Burned
                      </span>
                      <span className="text-base font-bold text-slate-200">450 <span className="text-[10px] text-slate-500 font-normal">kcal</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. WorkoutCard (Daily logs total) */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden text-left flex flex-col justify-between h-full min-h-[220px]">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm">Today's Exercises</h3>
                      <p className="text-[10px] text-slate-400">Logged activities</p>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Total Exercises</span>
                      <span className="text-4xl font-extrabold text-white tracking-tight leading-none">1</span>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <span className="block font-medium">Duration: <strong className="text-slate-200">45 min</strong></span>
                      <span className="block font-medium">Burned: <strong className="text-slate-200">350 kcal</strong></span>
                    </div>
                  </div>
                </div>

                {/* Details on the log */}
                <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex items-center justify-between text-xs mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-slate-350 font-semibold">Evening Cardio Run</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">45 min</span>
                </div>
              </div>

              {/* 6. GoalsCard (Milestone weight targets) */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden text-left flex flex-col justify-between h-full min-h-[220px]">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 text-sm">Active Goals</h3>
                      <p className="text-[10px] text-slate-400">Target milestones</p>
                    </div>
                  </div>

                  {/* Goal bars */}
                  <div className="space-y-3.5 mt-2">
                    {/* Goal 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Weight Loss</span>
                        <span className="text-slate-450">70 &rarr; <strong className="text-white">65 kg</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-950 border border-slate-900">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: '70%' }}></div>
                        </div>
                        <span className="text-[10.5px] font-black text-emerald-400 text-right w-8">70%</span>
                      </div>
                    </div>

                    {/* Goal 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Calorie Deficit</span>
                        <span className="text-slate-450">1850 &rarr; <strong className="text-white">1800 kcal</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-950 border border-slate-900">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-[10.5px] font-black text-emerald-400 text-right w-8">90%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default DashboardPreview;
