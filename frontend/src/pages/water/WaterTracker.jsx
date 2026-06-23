import { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Droplet, Plus, Coffee, Sparkles, Trash2 } from 'lucide-react';
import { waterService } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * WaterTracker Component
 * Renders the water tracking dashboard inside the protected dashboard area.
 * Connects to live backend API endpoints for retrieving stats/logs, adding logs, and deleting logs.
 */
const WaterTracker = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalIntakeMl: 0,
    dailyGoalMl: 2000,
    progressPercentage: 0,
    totalGlasses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom amount states
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Fetch all data
  const fetchWaterData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        waterService.getWaterLogs(),
        waterService.getDailyStats(),
      ]);

      if (logsRes.success) {
        // Filter logs to only display today's local date logs
        const todayStr = new Date().toDateString();
        const todayLogs = (logsRes.data || []).filter((log) => {
          return new Date(log.intakeDate).toDateString() === todayStr;
        });
        setLogs(todayLogs);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error fetching water data:', err);
      toast.error('Failed to load hydration statistics.', {
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
        },
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWaterData();
  }, []);


  const handleAddWater = async (amount) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await waterService.addWater({ amount });
      if (res.success) {
        toast.success(res.message || `Added ${amount}ml of water!`, {
          icon: '💧',
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
          },
        });
        setCustomAmount('');
        setShowCustomInput(false);
        await fetchWaterData(true);
      }
    } catch (err) {
      console.error('Error logging water:', err);
      toast.error(err.response?.data?.message || 'Failed to log water intake.', {
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await waterService.deleteWaterLog(id);
      if (res.success) {
        toast.success(res.message || 'Water log entry deleted.', {
          icon: '🗑️',
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
          },
        });
        await fetchWaterData(true);
      }
    } catch (err) {
      console.error('Error deleting log:', err);
      toast.error(err.response?.data?.message || 'Failed to delete water log.', {
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Droplet className="w-10 h-10 text-blue-400 animate-bounce" />
          <div className="text-slate-400 font-medium text-sm">Loading hydration stats...</div>
        </div>
      </MainLayout>
    );
  }

  const progressPercent = Math.min(Math.round(stats.progressPercentage || 0), 100);

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
                <span className="text-3xl font-black text-white">{stats.totalIntakeMl}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  / {stats.dailyGoalMl} ml
                </span>
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
            <div className="flex flex-col items-center gap-4 mt-2 w-full max-w-md">
              <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full justify-center">
                <button 
                  onClick={() => handleAddWater(250)}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-extrabold hover:text-white transition-all cursor-pointer disabled:opacity-50 min-w-[120px]"
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>+250ml Glass</span>
                </button>
                <button 
                  onClick={() => handleAddWater(500)}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-extrabold hover:text-white transition-all cursor-pointer disabled:opacity-50 min-w-[120px]"
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>+500ml Bottle</span>
                </button>
                <button 
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer min-w-[120px] ${
                    showCustomInput 
                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20' 
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>Custom Amount</span>
                </button>
              </div>

              {showCustomInput && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const amountVal = parseInt(customAmount, 10);
                    if (!amountVal || amountVal <= 0) {
                      toast.error('Please enter a valid positive water amount in ml.');
                      return;
                    }
                    handleAddWater(amountVal);
                  }}
                  className="flex items-center gap-2 w-full bg-slate-950/60 p-2 rounded-2xl border border-slate-900 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount (ml)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 text-xs font-bold text-white outline-none border-none placeholder:text-slate-600 focus:ring-0"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !customAmount}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Logging...' : 'Log'}
                  </button>
                </form>
              )}
            </div>

            {/* Dynamic Stats summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-4 border-t border-slate-900/60 pt-6">
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Intake</span>
                <span className="text-base font-black text-white mt-1">{stats.totalIntakeMl} ml</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Daily Goal</span>
                <span className="text-base font-black text-white mt-1">{stats.dailyGoalMl} ml</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Progress</span>
                <span className="text-base font-black text-blue-400 mt-1">{stats.progressPercentage}%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Glass Count</span>
                <span className="text-base font-black text-indigo-400 mt-1">{stats.totalGlasses} 🥛</span>
              </div>
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
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No logs for today. Start drinking!
                  </div>
                ) : (
                  logs.map((log) => (
                    <div 
                      key={log._id} 
                      className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-950 border border-slate-900 group"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-200">
                          {log.amount === 250 
                            ? 'Glass of Water' 
                            : log.amount === 500 
                              ? 'Sports Bottle' 
                              : 'Custom Hydration'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.intakeDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-blue-400">+{log.amount} ml</span>
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          disabled={isSubmitting}
                          className="text-slate-650 hover:text-red-400 transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 p-1 rounded hover:bg-slate-900"
                          title="Delete log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

