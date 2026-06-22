import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Dumbbell, Plus, Play, Calendar, Trophy, Clock } from 'lucide-react';

/**
 * Workouts Component
 * Renders the workout logs and tracker inside the protected dashboard area.
 */
const Workouts = () => {
  const mockWorkouts = [
    { id: 1, name: 'Full Body Power Strength', type: 'Strength', duration: '45 mins', calories: '350 kcal', intensity: 'High', date: 'Today, 08:30 AM' },
    { id: 2, name: 'Cardio HIIT Blaster', type: 'Cardio', duration: '30 mins', calories: '400 kcal', intensity: 'Very High', date: 'Yesterday, 06:15 PM' },
    { id: 3, name: 'Yoga Flex & Restore', type: 'Flexibility', duration: '50 mins', calories: '180 kcal', intensity: 'Low', date: '20 Jun, 07:00 AM' }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Dumbbell className="w-4.5 h-4.5" />
              <span>Track & Log</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Workouts</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Log your exercises, trace your calorie burns, and level up your training logs.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all active:scale-98 cursor-pointer self-start sm:self-center">
            <Plus className="w-4 h-4" />
            <span>Log Workout</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Workouts</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">12</span>
              <span className="text-xs text-emerald-400 font-semibold">+2 this week</span>
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">4 Days</span>
              <span className="text-xs text-purple-400 font-semibold">Keep it up!</span>
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Calories</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">3,250</span>
              <span className="text-xs text-slate-400 font-semibold">kcal total</span>
            </div>
          </div>
        </div>

        {/* Workout list */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Sessions</h2>
          <div className="grid grid-cols-1 gap-4">
            {mockWorkouts.map((workout) => (
              <div key={workout.id} className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Play className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">{workout.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{workout.duration}</span>
                      <span>•</span>
                      <span>{workout.type}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        workout.intensity === 'High' || workout.intensity === 'Very High' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>{workout.intensity} Intensity</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-start gap-2 border-t border-slate-900/60 sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-sm font-extrabold text-white">{workout.calories}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{workout.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Workouts;
