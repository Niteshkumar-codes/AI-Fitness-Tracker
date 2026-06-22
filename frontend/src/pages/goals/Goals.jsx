import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Target, Plus, TrendingUp, Trophy, Calendar, CheckCircle2 } from 'lucide-react';

/**
 * Goals Component
 * Renders the goal logs and tracker inside the protected dashboard area.
 */
const Goals = () => {
  const mockGoals = [
    { id: 1, type: 'Weight Loss', target: '65 kg', current: '70 kg', initial: '74 kg', progress: 80, date: 'Target: July 30, 2026' },
    { id: 2, type: 'Calorie Deficit', target: '1,800 kcal', current: '1,850 kcal', initial: '2,200 kcal', progress: 90, date: 'Daily Goal' },
    { id: 3, type: 'Weekly Strength Training', target: '4 Days', current: '3 Days', initial: '0 Days', progress: 75, date: 'Weekly Goal' }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Target className="w-4.5 h-4.5" />
              <span>Target Objectives</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Goals</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Set, update, and manage your health targets and physical goals.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all active:scale-98 cursor-pointer self-start sm:self-center">
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </button>
        </div>

        {/* Goals Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Goals</span>
              <span className="text-3xl font-black text-white">3</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Goals</span>
              <span className="text-3xl font-black text-white">8</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Success Rate</span>
              <span className="text-3xl font-black text-white">72.7%</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Current Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockGoals.map((goal) => (
              <div key={goal.id} className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/20 transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-extrabold text-slate-100 text-lg">{goal.type}</h3>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{goal.date}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20 text-xs font-bold text-purple-400">
                    {goal.progress}%
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-905">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500">Starting</span>
                    <span className="font-semibold text-slate-300">{goal.initial}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase text-slate-500">Current</span>
                    <span className="font-extrabold text-purple-400">{goal.current}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-slate-500">Target</span>
                    <span className="font-semibold text-slate-300">{goal.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Goals;
