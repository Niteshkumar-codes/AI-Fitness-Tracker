import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import BMICard from '../../components/dashboard/BMICard';
import WaterCard from '../../components/dashboard/WaterCard';
import CaloriesCard from '../../components/dashboard/CaloriesCard';
import WorkoutCard from '../../components/dashboard/WorkoutCard';
import GoalsCard from '../../components/dashboard/GoalsCard';
import QuickActions from '../../components/dashboard/QuickActions';
import { Sparkles, Brain, Award } from 'lucide-react';

/**
 * Dashboard Component
 * 
 * Purpose:
 * Renders the main dashboard page using the newly designed metric cards and widgets.
 * Arranges all cards into a responsive grid with Tailwind CSS v4.
 * Uses glassmorphism cards and dark SaaS design tokens.
 */
const Dashboard = () => {
  // Mock data representing database analytics logs
  const mockDashboardData = {
    user: {
      name: 'Alex Rivera',
      height: 175,
      weight: 70,
    },
    bmi: 22.86,
    waterIntake: {
      current: 750,
      goal: 2000
    },
    calories: {
      consumed: 1850,
      burned: 450
    },
    workouts: {
      total: 12,
      weekly: 4,
      streak: [true, false, true, true, false, true, false]
    },
    goals: {
      activeCount: 2,
      list: [
        { id: 1, type: 'Weight Loss', target: '65 kg', current: '70 kg', progress: 70 },
        { id: 2, type: 'Calorie Deficit', target: '1800 kcal', current: '1850 kcal', progress: 90 }
      ]
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
        
        {/* Welcome header with dynamic indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4.5 h-4.5" />
              <span>AI Dashboard Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {mockDashboardData.user.name.split(' ')[0]}
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Here is your fitness and health summary for today. Your progress is looking solid!
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-850 self-start sm:self-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300">Synchronized</span>
          </div>
        </div>

        {/* First Row: Core fitness metric cards (Workouts, Calories, Water, Goals) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkoutCard 
            totalWorkouts={mockDashboardData.workouts.total} 
            weeklyCount={mockDashboardData.workouts.weekly} 
            streakDays={mockDashboardData.workouts.streak}
          />
          <CaloriesCard 
            consumed={mockDashboardData.calories.consumed} 
            burned={mockDashboardData.calories.burned} 
          />
          <WaterCard 
            initialIntakeMl={mockDashboardData.waterIntake.current} 
            goalMl={mockDashboardData.waterIntake.goal} 
          />
          <GoalsCard 
            goalsCount={mockDashboardData.goals.activeCount} 
            goals={mockDashboardData.goals.list} 
          />
        </div>

        {/* Second Row: Detailed analytics, actions, and AI insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Index Card */}
          <BMICard 
            bmi={mockDashboardData.bmi} 
            height={mockDashboardData.user.height} 
            weight={mockDashboardData.user.weight} 
          />

          {/* Quick Actions Panel */}
          <QuickActions />

          {/* AI Insights Card (Mock intelligence feedback) */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-indigo-950/20 via-slate-900/30 to-purple-950/20 backdrop-blur-md relative overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500"></div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">FitAI Insights</h3>
                  <p className="text-[10px] text-slate-400">AI Recommendations</p>
                </div>
              </div>

              {/* Advice blocks */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-2.5">
                  <Award className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-normal">
                    You are <strong className="text-indigo-400">150 kcal</strong> away from reaching your target calorie deficit today. An evening 15-minute walk will seal this goal!
                  </p>
                </div>
                <div className="w-full border-t border-slate-900"></div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  💡 <strong>Tip:</strong> Drinking a glass of water before meals can boost metabolism by up to 24% and aid in healthy weight management.
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 mt-6 border-t border-slate-900 pt-3">
              Analyzed from logs over the past 7 days.
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;
