import React from 'react';
import { Flame, Apple, Sparkles } from 'lucide-react';

/**
 * CaloriesCard Component
 * 
 * Purpose:
 * Renders daily calorie tracking metrics, representing:
 * - Calories consumed (from food)
 * - Calories burned (from exercises/workouts)
 * - Net balance (Consumed - Burned)
 */
const CaloriesCard = ({ consumed = 1850, burned = 450 }) => {
  const netCalories = consumed - burned;
  const burnRatio = Math.min(100, Math.round((burned / consumed) * 100));

  return (
    <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all duration-500"></div>

      <div className="flex flex-col gap-4">
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

        {/* Net Calorie Display */}
        <div className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-4 flex items-center justify-between mt-1">
          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block">Net Calories</span>
            <span className="text-3xl font-extrabold text-white tracking-tight leading-none">
              {netCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">kcal</span>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              Active Deficit
            </span>
          </div>
        </div>

        {/* Consumed vs Burned breakdown grid */}
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Apple className="w-3.5 h-3.5 text-red-400" />
              Consumed (Food)
            </span>
            <span className="text-lg font-bold text-slate-200">{consumed.toLocaleString()} <span className="text-xs text-slate-500">kcal</span></span>
          </div>
          <div className="space-y-1 border-l border-slate-850 pl-4">
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Burned (Workouts)
            </span>
            <span className="text-lg font-bold text-slate-200">{burned.toLocaleString()} <span className="text-xs text-slate-500">kcal</span></span>
          </div>
        </div>

        {/* Split/Ratio visual slider */}
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
            <span>Burned Ratio</span>
            <span>{burnRatio}% of intake</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-950 p-[1.5px] border border-slate-900">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
              style={{ width: `${burnRatio}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CaloriesCard;
