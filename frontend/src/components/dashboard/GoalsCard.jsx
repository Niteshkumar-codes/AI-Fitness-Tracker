import React from 'react';
import { Target, CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * GoalsCard Component
 * 
 * Purpose:
 * Renders active user fitness goals and visual progress indicators.
 * Configured for MERN scaling.
 */
const GoalsCard = ({ goalsCount = 2, goals = [
  { id: 1, type: 'Weight Loss', target: '65 kg', current: '70 kg', progress: 70 },
  { id: 2, type: 'Calorie deficit', target: '1800 kcal', current: '1850 kcal', progress: 90 }
]}) => {
  return (
    <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Active Goals</h3>
              <p className="text-[10px] text-slate-400">Target metrics</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            {goalsCount} Active
          </span>
        </div>

        {/* Goals list with progress bars */}
        <div className="flex flex-col gap-3.5 mt-2">
          {goals.map((g) => (
            <div key={g.id} className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200">{g.type}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {g.current} → <strong className="text-slate-200">{g.target}</strong>
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Current Status</span>
                  <span>{g.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 p-[1px] border border-slate-850">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500 shadow-md shadow-emerald-500/10"
                    style={{ width: `${g.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal achievement summary footer */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-4 border-t border-slate-900 pt-3">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>1 target achieved this month</span>
      </div>
    </div>
  );
};

export default GoalsCard;
