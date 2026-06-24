import React from 'react';
import { Heart, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

/**
 * HealthScoreCard Component
 * 
 * Purpose:
 * Displays user's AI-powered overall Health Score out of 100.
 * Shows current status, key strengths, and areas of improvement.
 * Matches the existing premium glassmorphism dark theme of the dashboard.
 */
const HealthScoreCard = ({ score = 0, status = 'N/A', strengths = [], improvements = [], isLoading = false, error = null }) => {
  // Determine color theme based on score/status
  const getTheme = (statusName) => {
    const normalized = (statusName || 'N/A').toLowerCase();
    if (normalized === 'excellent') {
      return {
        text: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        glow: 'bg-emerald-500/5 group-hover:bg-emerald-500/10',
        stroke: 'stroke-emerald-400',
        border: 'hover:border-emerald-500/30'
      };
    }
    if (normalized === 'good') {
      return {
        text: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        glow: 'bg-blue-500/5 group-hover:bg-blue-500/10',
        stroke: 'stroke-blue-400',
        border: 'hover:border-blue-500/30'
      };
    }
    if (normalized === 'fair') {
      return {
        text: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        glow: 'bg-amber-500/5 group-hover:bg-amber-500/10',
        stroke: 'stroke-amber-400',
        border: 'hover:border-amber-500/30'
      };
    }
    return {
      text: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      glow: 'bg-rose-500/5 group-hover:bg-rose-500/10',
      stroke: 'stroke-rose-400',
      border: 'hover:border-rose-500/30'
    };
  };

  const theme = getTheme(status);

  // SVG parameters for circular progress ring
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between h-full min-h-[220px] animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-800 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-800 rounded"></div>
              <div className="h-3 w-16 bg-slate-800 rounded"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="flex items-center justify-between my-4">
          <div className="h-10 w-12 bg-slate-800 rounded"></div>
          <div className="w-12 h-12 rounded-full bg-slate-800"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-800 rounded"></div>
          <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  // Error fallback state
  if (error) {
    return (
      <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between h-full min-h-[220px] hover:border-slate-800 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-sm">Health Score</h3>
            <p className="text-[10px] text-slate-400">AI Calculations</p>
          </div>
        </div>
        
        <div className="my-4 text-xs text-slate-400 leading-normal">
          ⚠️ <strong>Unable to load Health Score:</strong> {error}
        </div>
        
        <div className="text-[10px] text-slate-500">
          Please check your logs and try again later.
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900/30 via-slate-950/20 to-slate-900/30 backdrop-blur-md relative overflow-hidden group transition-all duration-300 flex flex-col justify-between h-full ${theme.border}`}>
      {/* Background radial glow */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${theme.glow}`}></div>

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Health Score</h3>
              <p className="text-[10px] text-slate-400">Overall Wellness</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${theme.text}`}>
            {status}
          </span>
        </div>

        {/* Value and circular progress */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">FitAI Rating</span>
            <span className="text-4xl font-extrabold text-white tracking-tight leading-none">{score}</span>
            <span className="text-xs text-slate-500 font-bold ml-1">/ 100</span>
          </div>
          
          {/* SVG Circular Progress Meter */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className={`${theme.stroke} transition-all duration-1000 ease-out`}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold text-white">{score}%</span>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements List */}
        <div className="space-y-2.5 mt-2 border-t border-slate-900/60 pt-3">
          {strengths.length > 0 && (
            <div className="space-y-1.5">
              {strengths.map((str, idx) => (
                <div key={`str-${idx}`} className="flex items-start gap-2 text-[11px] text-emerald-400 leading-tight">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          )}

          {improvements.length > 0 && (
            <div className="space-y-1.5">
              {improvements.map((imp, idx) => (
                <div key={`imp-${idx}`} className="flex items-start gap-2 text-[11px] text-slate-300 leading-tight">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          )}

          {strengths.length === 0 && improvements.length === 0 && (
            <p className="text-[10px] text-slate-500 italic">
              Log metrics to begin calculating your wellness details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
