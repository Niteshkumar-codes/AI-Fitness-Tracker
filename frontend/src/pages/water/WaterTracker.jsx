import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Droplet, Plus, Calendar, Coffee, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * WaterTracker Component
 * Renders the water tracking dashboard inside the protected dashboard area.
 */
const WaterTracker = () => {
  const [currentIntake, setCurrentIntake] = useState(750);
  const goal = 2000;
  
  const [logs, setLogs] = useState([
    { id: 1, amount: 250, time: '08:15 AM', type: 'Glass of Water' },
    { id: 2, amount: 500, time: '11:30 AM', type: 'Sports Bottle' }
  ]);

  const handleAddWater = (amount) => {
    setCurrentIntake((prev) => {
      const next = prev + amount;
      toast.success(`Added ${amount}ml of water!`, {
        icon: '💧',
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
        }
      });
      return next;
    });

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs((prev) => [
      { id: Date.now(), amount, time, type: amount === 250 ? 'Glass of Water' : amount === 500 ? 'Sports Bottle' : 'Custom Drink' },
      ...prev
    ]);
  };

  const progressPercent = Math.min(Math.round((currentIntake / goal) * 100), 100);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Droplet className="w-4.5 h-4.5" />
              <span>Hydration Tracker</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Water Tracker</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Log your water consumption and meet your daily hydration objectives.
            </p>
          </div>
        </div>

        {/* Tracker layout grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col items-center justify-center gap-6 md:col-span-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer circular indicator background */}
              <div className="absolute inset-0 rounded-full border-[10px] border-slate-900"></div>
              {/* Inner details */}
              <div className="flex flex-col items-center text-center z-10">
                <Droplet className="w-8 h-8 text-blue-400 animate-bounce mb-1" />
                <span className="text-3xl font-black text-white">{currentIntake}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">/ {goal} ml</span>
              </div>
              {/* Spinning/pulsing highlight ring */}
              <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-blue-500/20 animate-[spin_40s_linear_infinite]"></div>
            </div>

            <div className="w-full flex flex-col gap-2 max-w-md">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-300">Daily Progress</span>
                <span className="text-blue-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-900 p-0.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Add buttons */}
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => handleAddWater(250)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-extrabold hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-400" />
                <span>+250ml Glass</span>
              </button>
              <button 
                onClick={() => handleAddWater(500)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-extrabold hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-400" />
                <span>+500ml Bottle</span>
              </button>
            </div>
          </div>

          {/* Quick hydration tips / log info */}
          <div className="flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>AI Insight</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drinking water boosts metabolism by up to 30% and keeps your cognitive functions operating at peak efficiency. You are on track to reach your daily goal!
              </p>
            </div>

            {/* Water intake logs */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-slate-100 text-sm tracking-tight border-b border-slate-900 pb-3 flex items-center gap-2">
                <Coffee className="w-4 h-4 text-slate-400" />
                Today's Water Log
              </h3>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[180px] pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">No logs for today. Start drinking!</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-950 border border-slate-900">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-200">{log.type}</span>
                        <span className="text-[10px] text-slate-500">{log.time}</span>
                      </div>
                      <span className="font-extrabold text-blue-400">+{log.amount} ml</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WaterTracker;
