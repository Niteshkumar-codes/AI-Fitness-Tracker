import React, { useState } from 'react';
import { Droplet, Plus, RefreshCw } from 'lucide-react';

/**
 * WaterCard Component
 * 
 * Purpose:
 * Renders daily water intake log.
 * Provides interactive water logging (+250ml) powered by local state.
 * Displays completed percentage and a clean progress indicator.
 */
const WaterCard = ({ initialIntakeMl = 750, goalMl = 2000 }) => {
  const [waterMl, setWaterMl] = useState(initialIntakeMl);

  const progressPercent = Math.min(100, Math.round((waterMl / goalMl) * 100));
  const glasses = (waterMl / 250).toFixed(1);

  const addGlass = () => {
    // Add 250ml up to double the daily goal
    setWaterMl(prev => Math.min(goalMl * 2, prev + 250));
  };

  const resetIntake = () => {
    setWaterMl(0);
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Background glow overlay */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500"></div>

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

        {/* Value metric */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-extrabold text-white tracking-tight">{waterMl}</span>
          <span className="text-xs text-slate-500 font-bold">/ {goalMl} ml</span>
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

      {/* Interactive controls */}
      <div className="flex gap-2.5 mt-6 relative z-10">
        <button
          onClick={addGlass}
          className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Glass (+250ml)
        </button>
        <button
          onClick={resetIntake}
          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Reset water log"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default WaterCard;
