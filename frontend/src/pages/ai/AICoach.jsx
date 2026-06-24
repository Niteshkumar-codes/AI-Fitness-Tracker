import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Sparkles, Brain, Dumbbell, Copy, Check, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AICoach = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [recSource, setRecSource] = useState(null);
  const [workSource, setWorkSource] = useState(null);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [isWorkLoading, setIsWorkLoading] = useState(false);
  const [copiedType, setCopiedType] = useState(null);

  const fetchRecommendations = async () => {
    setIsRecLoading(true);
    setRecommendations(null);
    setRecSource(null);
    try {
      const response = await api.get('/ai/recommendations');
      if (response.data && response.data.success) {
        setRecommendations(response.data.data.recommendations);
        setRecSource(response.data.source || 'gemini');
        toast.success(
          response.data.source === 'fallback'
            ? 'Generated fallback recommendations from local data!'
            : 'Gemini recommendations generated successfully!',
          {
            icon: response.data.source === 'fallback' ? '📋' : '🤖',
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
            },
          }
        );
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error generating recommendations';
      toast.error(errorMsg, {
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
        },
      });
    } finally {
      setIsRecLoading(false);
    }
  };

  const fetchWorkoutPlan = async () => {
    setIsWorkLoading(true);
    setWorkoutPlan(null);
    setWorkSource(null);
    try {
      const response = await api.get('/ai/workout-plan');
      if (response.data && response.data.success) {
        setWorkoutPlan(response.data.data.workoutPlan);
        setWorkSource(response.data.source || 'gemini');
        toast.success(
          response.data.source === 'fallback'
            ? 'Generated fallback workout plan from local data!'
            : 'Gemini workout plan generated successfully!',
          {
            icon: response.data.source === 'fallback' ? '📋' : '🏋️‍♂️',
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
            },
          }
        );
      } else {
        throw new Error('Failed to generate workout plan');
      }
    } catch (error) {
      console.error('Error fetching AI workout plan:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error generating workout plan';
      toast.error(errorMsg, {
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
        },
      });
    } finally {
      setIsWorkLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success('Copied to clipboard!', {
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        borderRadius: '1rem',
      },
    });
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Parsing bold elements and headers in response text to render premium styling
  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      // Check for headers (e.g. ### Header or **Header**)
      if (line.startsWith('###') || line.startsWith('##') || line.startsWith('#')) {
        const cleanText = line.replace(/^[#\s]+/, '');
        return <h4 key={idx} className="text-base font-extrabold text-white mt-4 mb-2 tracking-tight">{cleanText}</h4>;
      }
      
      // Check for bullet points
      if (line.startsWith('*') || line.startsWith('-')) {
        const cleanText = line.substring(1).trim();
        return (
          <div key={idx} className="flex items-start gap-2 text-slate-300 text-xs md:text-sm my-1.5 pl-2 leading-relaxed">
            <span className="text-purple-400 mt-1 text-sm">•</span>
            <span>{parseBoldText(cleanText)}</span>
          </div>
        );
      }
      
      // Normal paragraphs
      if (line.trim() === '') return <div key={idx} className="h-2"></div>;
      
      return <p key={idx} className="text-slate-300 text-xs md:text-sm my-1.5 leading-relaxed">{parseBoldText(line)}</p>;
    });
  };

  const parseBoldText = (text) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      // Every odd index is bold text
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-slate-100">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto pb-12">
        {/* Header section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-4.5 h-4.5" />
            <span>Premium AI Assistant</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            AI Fitness Coach
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Consult our artificial intelligence engine to generate personalized health insights, nutrition tips, and 7-day workout plans tailored to your metrics.
          </p>
        </div>

        {/* Coach Generation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: AI Health Recommendations */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-indigo-950/20 via-slate-900/30 to-purple-950/20 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-base">AI Health Coach</h3>
                  <p className="text-[10px] text-slate-400">Personalized Insights</p>
                </div>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed">
                Analyzes your calories consumed, exercises logged, water intake, BMI, and active goals today to generate actionable nutrition and activity coaching tips.
              </p>
            </div>
            
            <button
              onClick={fetchRecommendations}
              disabled={isRecLoading}
              className="mt-6 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/15"
            >
              {isRecLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Logs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: AI 7-Day Workout Planner */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-purple-950/20 via-slate-900/30 to-indigo-950/20 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-base">AI Workout Planner</h3>
                  <p className="text-[10px] text-slate-400">Custom 7-Day Routine</p>
                </div>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed">
                Formulates a personalized, beginner-friendly 7-day schedule listing daily exercises, targeted durations, intensities, rest days, and safety guidance.
              </p>
            </div>

            <button
              onClick={fetchWorkoutPlan}
              disabled={isWorkLoading}
              className="mt-6 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/15"
            >
              {isWorkLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consulting Trainer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Workout Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display recommendations results */}
        {(isRecLoading || recommendations) && (
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-900/25 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4 gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-slate-200 text-lg">AI Coach Recommendations</h3>
              </div>
              {recSource && (
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    recSource === 'gemini' 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {recSource === 'gemini' ? 'Gemini AI' : 'Fallback AI'}
                  </span>
                  
                  <button 
                    onClick={() => handleCopy(recommendations, 'rec')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                    title="Copy to clipboard"
                  >
                    {copiedType === 'rec' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {isRecLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-sm">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                <span>FitAI Coach is analyzing metrics and composing coaching recommendations...</span>
              </div>
            ) : (
              <div className="space-y-1 font-sans text-slate-300">
                {formatText(recommendations)}
              </div>
            )}
          </div>
        )}

        {/* Display workout plan results */}
        {(isWorkLoading || workoutPlan) && (
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-900/25 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4 gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <Dumbbell className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-slate-200 text-lg">7-Day Workout Routine</h3>
              </div>
              {workSource && (
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    workSource === 'gemini' 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {workSource === 'gemini' ? 'Gemini AI' : 'Fallback AI'}
                  </span>

                  <button 
                    onClick={() => handleCopy(workoutPlan, 'work')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                    title="Copy to clipboard"
                  >
                    {copiedType === 'work' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {isWorkLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-sm">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                <span>FitAI Coach is designing your 7-day personalized workout schedule...</span>
              </div>
            ) : (
              <div className="space-y-1 font-sans text-slate-300">
                {formatText(workoutPlan)}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AICoach;
