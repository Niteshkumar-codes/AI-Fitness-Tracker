import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Dumbbell, Plus, Play, Calendar, Clock, X, Trash2, AlertCircle } from 'lucide-react';
import { workoutService } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Workouts Component
 * Renders the workout logs and tracker inside the protected dashboard area.
 * Connects to live MongoDB endpoints for fetching, adding, and deleting workouts.
 */
const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields state
  const [formData, setFormData] = useState({
    workoutType: 'Running',
    duration: '',
    caloriesBurned: '',
    notes: '',
    workoutDate: new Date().toISOString().substring(0, 16) // Format: YYYY-MM-DDTHH:MM
  });

  // Fetch all workouts
  const fetchWorkouts = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await workoutService.getWorkouts();
      if (res.success) {
        setWorkouts(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.response?.data?.message || 'Failed to load your workouts.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Calculate dynamic stats
  const totalWorkouts = workouts.length;
  
  const getWeeklyCount = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return workouts.filter(w => new Date(w.workoutDate) >= sevenDaysAgo).length;
  };
  const weeklyCount = getWeeklyCount();

  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  // Streak calculation (consecutive days with workouts)
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    // Extract unique dates in YYYY-MM-DD format
    const dates = [...new Set(workouts.map(w => new Date(w.workoutDate).toDateString()))]
      .map(d => new Date(d))
      .sort((a, b) => b - a); // Sort newest first

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const mostRecent = dates[0];
    if (!mostRecent) return 0;

    const mostRecentTime = new Date(mostRecent).setHours(0, 0, 0, 0);
    // If the most recent workout is older than yesterday, the streak is broken
    if (mostRecentTime !== today.getTime() && mostRecentTime !== yesterday.getTime()) {
      return 0;
    }

    let streak = 0;
    // Start checking from the most recent workout date (either today or yesterday)
    let checkDate = new Date(mostRecentTime);

    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      d.setHours(0, 0, 0, 0);
      
      if (d.getTime() === checkDate.getTime()) {
        streak++;
        // Go back 1 day
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (d.getTime() < checkDate.getTime()) {
        // Gap in dates found
        break;
      }
    }
    return streak;
  };
  const activeStreak = calculateStreak();

  // Map workout metrics to intensity pill
  const getIntensity = (type, calories, duration) => {
    if (type === 'HIIT') return 'Very High';
    if (type === 'Gym' || type === 'Running' || type === 'Swimming') {
      return calories / duration > 8 ? 'High' : 'Medium';
    }
    if (type === 'Yoga' || type === 'Walking') return 'Low';
    
    const ratio = calories / duration;
    if (ratio > 10) return 'Very High';
    if (ratio > 7) return 'High';
    if (ratio > 4) return 'Medium';
    return 'Low';
  };

  // Human friendly relative dates
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    
    const isToday = d.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeStr = d.toLocaleTimeString([], options);
    
    if (isToday) {
      return `Today, ${timeStr}`;
    }
    if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    }
    
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const dayStr = d.toLocaleDateString([], dateOptions);
    return `${dayStr}, ${timeStr}`;
  };

  // Form handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new workout
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const durationNum = Number(formData.duration);
    const caloriesNum = Number(formData.caloriesBurned);

    // Frontend validations
    if (!formData.workoutType) {
      toast.error('Please select a workout type.');
      return;
    }
    if (!formData.duration || durationNum <= 0 || durationNum > 1440) {
      toast.error('Please enter a valid duration (1 - 1440 mins).');
      return;
    }
    if (formData.caloriesBurned === '' || caloriesNum < 0 || caloriesNum > 10000) {
      toast.error('Please enter realistic calories burned (0 - 10000 kcal).');
      return;
    }
    if (formData.notes.length > 500) {
      toast.error('Notes cannot exceed 500 characters.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Logging workout session...');
    
    try {
      const payload = {
        workoutType: formData.workoutType,
        duration: durationNum,
        caloriesBurned: caloriesNum,
        notes: formData.notes.trim(),
        workoutDate: new Date(formData.workoutDate).toISOString()
      };
      
      const res = await workoutService.addWorkout(payload);
      if (res.success) {
        toast.success(res.message || 'Workout logged successfully!', { id: toastId });
        setIsModalOpen(false);
        // Reset form
        setFormData({
          workoutType: 'Running',
          duration: '',
          caloriesBurned: '',
          notes: '',
          workoutDate: new Date().toISOString().substring(0, 16)
        });
        // Reload list silently
        fetchWorkouts(true);
      } else {
        toast.error(res.message || 'Failed to log workout.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while saving workout.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete workout session
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout log?')) return;
    
    const toastId = toast.loading('Deleting workout session...');
    try {
      const res = await workoutService.deleteWorkout(id);
      if (res.success) {
        toast.success(res.message || 'Workout deleted successfully.', { id: toastId });
        // Reload list silently
        fetchWorkouts(true);
      } else {
        toast.error(res.message || 'Failed to delete workout.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while deleting workout.', { id: toastId });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto relative">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Dumbbell className="w-4.5 h-4.5" />
              <span>Track & Log</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Workouts</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Log your exercises, trace your calorie burns, and level up your training logs.
            </p>
          </div>
          <button 
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                workoutDate: new Date().toISOString().substring(0, 16)
              }));
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all active:scale-98 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Log Workout</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Workouts</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalWorkouts}</span>
              <span className="text-xs text-emerald-400 font-semibold">+{weeklyCount} this week</span>
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{activeStreak} {activeStreak === 1 ? 'Day' : 'Days'}</span>
              <span className="text-xs text-purple-400 font-semibold">{activeStreak > 0 ? 'Keep it up!' : 'Start logging!'}</span>
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Calories</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalCalories.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-semibold">kcal total</span>
            </div>
          </div>
        </div>

        {/* Error message slot */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Workout list */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Sessions</h2>
          
          {loading && workouts.length === 0 ? (
            /* Loading skeletons */
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-900 rounded w-40"></div>
                      <div className="h-3 bg-slate-900 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-900 rounded w-20 self-end sm:self-center"></div>
                </div>
              ))}
            </div>
          ) : workouts.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl border border-slate-900 bg-slate-900/10 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Dumbbell className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-200">No workouts logged yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Log your first training session to start tracking your dynamic streak and calorie burn metrics.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs transition-all active:scale-97 cursor-pointer"
              >
                Log Your First Workout
              </button>
            </div>
          ) : (
            /* Workouts list */
            <div className="grid grid-cols-1 gap-4">
              {workouts.map((workout) => {
                const intensity = getIntensity(workout.workoutType, workout.caloriesBurned, workout.duration);
                return (
                  <div 
                    key={workout._id} 
                    className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/30 hover:border-slate-850 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Play className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 flex items-center gap-2">
                          {workout.workoutType} Session
                          {workout.notes && (
                            <span className="text-[10px] font-normal text-slate-500 max-w-[150px] md:max-w-[250px] truncate" title={workout.notes}>
                              — {workout.notes}
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {workout.duration} mins
                          </span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            intensity === 'High' || intensity === 'Very High' 
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                              : intensity === 'Low'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {intensity} Intensity
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center sm:items-end justify-between sm:justify-start gap-4 border-t border-slate-900/60 sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-sm font-extrabold text-white">{workout.caloriesBurned} kcal</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(workout.workoutDate)}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDelete(workout._id)}
                        title="Delete Session"
                        className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Workout Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md p-6 rounded-3xl border border-slate-900 bg-slate-900/90 backdrop-blur-md shadow-2xl flex flex-col gap-5 relative animate-in fade-in-50 zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Dumbbell className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">Log New Workout</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400" htmlFor="workoutType">
                    Workout Type
                  </label>
                  <select
                    id="workoutType"
                    name="workoutType"
                    value={formData.workoutType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 cursor-pointer"
                  >
                    {['Running', 'Cycling', 'Swimming', 'Yoga', 'Gym', 'Walking', 'Hiking', 'HIIT', 'Sports', 'Other'].map(type => (
                      <option key={type} value={type} className="bg-slate-950">{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="duration">
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 45"
                      min="1"
                      max="1440"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="caloriesBurned">
                      Burned (kcal)
                    </label>
                    <input
                      type="number"
                      id="caloriesBurned"
                      name="caloriesBurned"
                      value={formData.caloriesBurned}
                      onChange={handleChange}
                      placeholder="e.g. 350"
                      min="0"
                      max="10000"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400" htmlFor="workoutDate">
                    Workout Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="workoutDate"
                    name="workoutDate"
                    value={formData.workoutDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400" htmlFor="notes">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Felt strong today, increased weight limits."
                    rows="3"
                    maxLength="500"
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 resize-none"
                  />
                  <span className="text-[10px] text-slate-500 self-end">
                    {formData.notes.length}/500 chars
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-all active:scale-97 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-sm transition-all active:scale-97 cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        <span>Logging...</span>
                      </>
                    ) : (
                      <span>Save Workout</span>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Workouts;

