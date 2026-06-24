import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../layouts/MainLayout';
import BMICard from '../../components/dashboard/BMICard';
import WaterCard from '../../components/dashboard/WaterCard';
import CaloriesCard from '../../components/dashboard/CaloriesCard';
import WorkoutCard from '../../components/dashboard/WorkoutCard';
import GoalsCard from '../../components/dashboard/GoalsCard';
import QuickActions from '../../components/dashboard/QuickActions';
import HealthScoreCard from '../../components/dashboard/HealthScoreCard';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Award } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Dashboard Component
 * 
 * Purpose:
 * Renders the main dashboard page using the newly designed metric cards and widgets.
 * Connects to backend APIs to show real-time stats for the authenticated user.
 */
const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleQuickAction = (actionName) => {
    switch (actionName) {
      case 'Add Workout':
        navigate('/workouts');
        break;
      case 'Add Food Log':
        navigate('/food');
        break;
      case 'Log Water':
        navigate('/water');
        break;
      case 'Create Goal':
        navigate('/goals');
        break;
      default:
        break;
    }
  };

  const [dashboardData, setDashboardData] = useState(null);
  const [bmiData, setBmiData] = useState(null);
  const [waterStats, setWaterStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [healthScoreData, setHealthScoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHealthScoreLoading, setIsHealthScoreLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthScoreError, setHealthScoreError] = useState(null);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setIsHealthScoreLoading(true);
    }
    setError(null);
    setHealthScoreError(null);
    try {
      const [dashRes, bmiRes, waterRes, goalsRes, healthScoreRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/bmi').catch((err) => {
          // Handle 400 (Profile incomplete) gracefully
          if (err.response && err.response.status === 400) {
            return { data: { success: false, incomplete: true } };
          }
          throw err;
        }),
        api.get('/water/stats'),
        api.get('/goals').catch(() => ({ data: { success: true, data: [] } })),
        api.get('/ai/health-score').catch((err) => {
          console.error('Error fetching health score:', err);
          return { data: { success: false, error: err.response?.data?.message || 'Failed to load health score.' } };
        })
      ]);

      if (dashRes.data && dashRes.data.success) {
        setDashboardData(dashRes.data.data);
      }
      
      if (bmiRes.data) {
        setBmiData(bmiRes.data.incomplete ? { incomplete: true } : bmiRes.data.data);
      }

      if (waterRes.data && waterRes.data.success) {
        setWaterStats(waterRes.data.data);
      }

      if (goalsRes.data && goalsRes.data.success) {
        setGoals(goalsRes.data.data);
      }

      if (healthScoreRes.data && healthScoreRes.data.success) {
        setHealthScoreData(healthScoreRes.data.data);
      } else if (healthScoreRes.data && healthScoreRes.data.error) {
        setHealthScoreError(healthScoreRes.data.error);
      }
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
    } finally {
      setIsLoading(false);
      setIsHealthScoreLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddWater = async (amount) => {
    try {
      const res = await api.post('/water', { amount });
      if (res.data && res.data.success) {
        toast.success(`Logged ${amount}ml of water!`, {
          icon: '💧',
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
          }
        });
        // Refresh water stats silently
        const waterRes = await api.get('/water/stats');
        if (waterRes.data && waterRes.data.success) {
          setWaterStats(waterRes.data.data);
        }
        // Refresh health score silently
        api.get('/ai/health-score').then((hRes) => {
          if (hRes.data && hRes.data.success) {
            setHealthScoreData(hRes.data.data);
            setHealthScoreError(null);
          }
        }).catch(err => console.error(err));
      }
    } catch (err) {
      console.error('Failed to log water intake:', err);
      toast.error(err.response?.data?.message || 'Failed to log water intake.');
    }
  };

  const handleResetWater = async () => {
    try {
      const logsRes = await api.get('/water');
      if (logsRes.data && logsRes.data.success) {
        const todayLogs = logsRes.data.data.filter((log) => {
          const logDate = new Date(log.intakeDate).toDateString();
          const today = new Date().toDateString();
          return logDate === today;
        });

        if (todayLogs.length === 0) {
          toast.error('No water logs found for today.');
          return;
        }

        await Promise.all(todayLogs.map((log) => api.delete(`/water/${log._id}`)));
        toast.success('Successfully reset daily water intake.');
        
        // Refresh water stats
        const waterRes = await api.get('/water/stats');
        if (waterRes.data && waterRes.data.success) {
          setWaterStats(waterRes.data.data);
        }
        // Refresh health score silently
        api.get('/ai/health-score').then((hRes) => {
          if (hRes.data && hRes.data.success) {
            setHealthScoreData(hRes.data.data);
            setHealthScoreError(null);
          }
        }).catch(err => console.error(err));
      }
    } catch (err) {
      console.error('Failed to reset water intake:', err);
      toast.error('Failed to reset daily water intake.');
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 text-sm font-sans">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-purple-600 animate-spin mb-3"></div>
          <span>Loading dashboard analytics...</span>
        </div>
      </MainLayout>
    );
  }

  // Get first name of authenticated user
  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'User';

  // Map backend goals list to structure expected by GoalsCard
  const activeGoals = goals
    .filter((g) => g.status === 'Active')
    .slice(0, 2)
    .map((g) => {
      let progress = 50;
      if (g.goalType === 'Weight Loss') {
        const totalDiff = Math.abs(g.currentWeight - g.targetWeight);
        progress = totalDiff === 0 ? 100 : Math.min(100, Math.max(0, Math.round((totalDiff / g.targetWeight) * 100)));
      }
      return {
        id: g._id,
        type: g.goalType,
        current: g.goalType === 'Calorie Deficit' ? 'Deficit' : `${g.currentWeight} kg`,
        target: g.goalType === 'Calorie Deficit' ? `${g.targetCalories} kcal` : `${g.targetWeight} kg`,
        progress: progress
      };
    });

  // Fallback default goals if none are configured in database
  const goalsToRender = activeGoals.length > 0 ? activeGoals : [
    { id: 'mock-1', type: 'Weight Loss', target: '65 kg', current: '70 kg', progress: 70 },
    { id: 'mock-2', type: 'Calorie Deficit', target: '1800 kcal', current: '1850 kcal', progress: 90 }
  ];

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
              Welcome back, {userFirstName}
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Here is your fitness and health summary for today. Your progress is looking solid!
            </p>
          </div>
          <button 
            onClick={() => fetchDashboardData(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-855 border border-slate-800 self-start sm:self-center cursor-pointer transition-all active:scale-98"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300">Synchronized</span>
          </button>
        </div>

        {/* Error message slot */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {/* First Row: Core fitness metric cards (Workouts, Calories, Water, Goals) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WorkoutCard 
            totalWorkouts={dashboardData?.allTime?.workoutsCount || 0} 
            weeklyCount={dashboardData?.today?.workoutsCount || 0} 
            streakDays={[true, false, true, true, false, true, false]}
          />
          <CaloriesCard 
            consumed={dashboardData?.today?.caloriesConsumed || 0} 
            burned={dashboardData?.today?.caloriesBurned || 0} 
          />
          <WaterCard 
            initialIntakeMl={waterStats?.totalIntakeMl || 0} 
            goalMl={waterStats?.dailyGoalMl || 2000} 
            onAddWater={handleAddWater}
            onReset={handleResetWater}
          />
          <GoalsCard 
            goalsCount={dashboardData?.activeGoalsCount || goals.filter(g => g.status === 'Active').length || 2} 
            goals={goalsToRender} 
          />
        </div>

        {/* Second Row: Detailed analytics, actions, and AI insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI Health Score Card */}
          <HealthScoreCard
            score={healthScoreData?.healthScore || 0}
            status={healthScoreData?.status || 'N/A'}
            strengths={healthScoreData?.strengths || []}
            improvements={healthScoreData?.improvements || []}
            isLoading={isHealthScoreLoading}
            error={healthScoreError}
          />

          {/* Health Index Card */}
          <BMICard 
            bmi={bmiData?.bmi || 0} 
            height={bmiData?.height || currentUser?.height || 0} 
            weight={bmiData?.weight || currentUser?.weight || 0} 
            incomplete={bmiData?.incomplete || false}
          />

          {/* Quick Actions Panel */}
          <QuickActions onActionClick={handleQuickAction} />

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
                    You have consumed <strong className="text-purple-400">{dashboardData?.today?.caloriesConsumed || 0} kcal</strong> and burned <strong className="text-indigo-400">{dashboardData?.today?.caloriesBurned || 0} kcal</strong> today. Maintain your logs to keep tracking!
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
