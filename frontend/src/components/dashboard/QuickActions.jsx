import React from 'react';
import { Dumbbell, Apple, Droplet, Target, Plus } from 'lucide-react';

/**
 * QuickActions Component
 * 
 * Purpose:
 * Renders a grid of action buttons that let the user log fitness activities.
 * Standard SaaS shortcut panel layout with Lucide icons.
 */
const QuickActions = ({ onActionClick }) => {
  const actions = [
    { name: 'Add Workout', icon: Dumbbell, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/15' },
    { name: 'Add Food Log', icon: Apple, color: 'text-red-400 bg-red-500/10 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/15' },
    { name: 'Log Water', icon: Droplet, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/15' },
    { name: 'Create Goal', icon: Target, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15' }
  ];

  const handleActionClick = (name) => {
    console.log(`Action clicked: ${name}`);
    if (onActionClick) {
      onActionClick(name);
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
      {/* Background glow overlay */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-500/5 rounded-full blur-2xl group-hover:bg-slate-500/10 transition-all duration-500"></div>

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div>
            <h3 className="font-bold text-slate-200 text-sm">Quick Actions</h3>
            <p className="text-[10px] text-slate-400">Log fitness activities instantly</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
        </div>

        {/* Action buttons grid */}
        <div className="grid grid-cols-2 gap-3.5 mt-1">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.name}
                onClick={() => handleActionClick(act.name)}
                className={`p-4 border rounded-2xl cursor-pointer flex flex-col items-center gap-2.5 transition-all duration-200 group/btn relative ${act.color}`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 transition-transform duration-200 group-hover/btn:scale-110" />
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-slate-950 flex items-center justify-center border border-slate-900">
                    <Plus className="w-2 h-2 text-white" />
                  </span>
                </div>
                <span className="text-[11px] font-bold tracking-tight text-slate-200 group-hover/btn:text-white">
                  {act.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
