import React from 'react';
import { Scale, Info } from 'lucide-react';

/**
 * BMICard Component
 * 
 * Purpose:
 * Renders user's Body Mass Index (BMI) statistics, WHO category, and status visualization.
 * Designed with a premium Vercel-style gradient and glassmorphism.
 * 
 * Props:
 * - bmi: Numeric value of BMI.
 * - height: User height in cm.
 * - weight: User weight in kg.
 */
const BMICard = ({ bmi = 22.86, height = 175, weight = 70 }) => {
  // Determine WHO category, color code, and percentage position on the scale
  const getBMICategory = (val) => {
    if (val < 18.5) {
      return { label: 'Underweight', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', position: '15%' };
    }
    if (val < 25) {
      return { label: 'Normal Weight', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', position: '50%' };
    }
    if (val < 30) {
      return { label: 'Overweight', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', position: '78%' };
    }
    return { label: 'Obese', color: 'text-red-400 bg-red-400/10 border-red-400/20', position: '92%' };
  };

  const category = getBMICategory(bmi);

  return (
    <div className="p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-purple-950/20 via-slate-900/30 to-indigo-950/20 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
      {/* Background glow overlay */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-500"></div>

      <div className="flex flex-col gap-5">
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
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${category.color}`}>
            {category.label}
          </span>
        </div>

        {/* BMI Main Value Displays */}
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Computed BMI</span>
            <span className="text-4xl font-extrabold text-white tracking-tight leading-none">{bmi}</span>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="block font-medium">Height: <strong className="text-slate-200">{height} cm</strong></span>
            <span className="block font-medium">Weight: <strong className="text-slate-200">{weight} kg</strong></span>
          </div>
        </div>

        {/* Visual WHO spectrum bar */}
        <div className="space-y-2 mt-2">
          <div className="h-2.5 rounded-full bg-slate-950/80 p-[2px] border border-slate-900/60 relative">
            {/* Color spectrums */}
            <div className="absolute inset-y-[2px] left-[2px] right-[2px] flex rounded-full overflow-hidden opacity-60">
              <div className="w-[20%] bg-amber-500"></div>
              <div className="w-[35%] bg-emerald-500"></div>
              <div className="w-[25%] bg-orange-500"></div>
              <div className="w-[20%] bg-red-500"></div>
            </div>
            
            {/* Slider Indicator */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-3 border-purple-600 shadow-md transition-all duration-500 ease-out z-10"
              style={{ left: category.position }}
            ></div>
          </div>
          <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider px-1">
            <span>Under</span>
            <span>Normal (18.5-25)</span>
            <span>Over</span>
            <span>Obese</span>
          </div>
        </div>

        {/* Bottom context advice info */}
        <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-slate-950/40 p-2.5 border border-slate-900/50 rounded-xl leading-normal mt-1">
          <Info className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
          <span>A healthy BMI range is between 18.5 and 24.9. Maintaining weight controls cardiovascular risks.</span>
        </div>
      </div>
    </div>
  );
};

export default BMICard;
