import React from 'react';
import { Dumbbell, Calendar, ArrowUpRight } from 'lucide-react';

/**
 * WorkoutCard Component
 * 
 * Purpose:
 * Displays aggregate workout metrics, weekly performance highlights,
 * and a premium daily attendance streak tracker.
 */
const WorkoutCard = ({ totalWorkouts = 12, weeklyCount = 4, streakDays = [true, false, true, true, false, true, false] }) => {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-500"></div>

      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Workouts</h3>
              <p className="text-[10px] text-slate-400">Exercise track & frequency</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            +{weeklyCount} this week
          </span>
        </div>

        {/* Total workouts */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-white tracking-tight">{totalWorkouts}</span>
          <span className="text-xs text-slate-500 font-bold">Total Logs</span>
        </div>

        {/* Weekly streak indicator (M T W T F S S) */}
        <div className="space-y-2 mt-2">
          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Weekly Attendance
          </span>
          <div className="flex justify-between items-center gap-2 bg-slate-950/60 border border-slate-900 p-3 rounded-2xl">
            {daysOfWeek.map((day, idx) => {
              const active = streakDays[idx];
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[9px] text-slate-500 font-bold">{day}</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                    active 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                      : 'bg-slate-900 border border-slate-850 text-slate-600'
                  }`}>
                    {active ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkoutCard;
