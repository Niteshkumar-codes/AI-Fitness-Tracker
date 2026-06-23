import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Target, Plus, Calendar, CheckCircle2, Trophy, X, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { goalService } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Goals Component
 * Renders the goal logs and tracker inside the protected dashboard area.
 * Connects to live MongoDB endpoints for fetching, creating, updating, and deleting goals.
 */
const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    goalType: 'Weight Loss',
    targetWeight: '',
    currentWeight: '',
    targetCalories: '',
    targetDate: ''
  });

  const [updateForm, setUpdateForm] = useState({
    currentWeight: '',
    status: 'Active'
  });

  // Fetch goals
  const fetchGoals = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await goalService.getGoals();
      if (res.success) {
        setGoals(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err.response?.data?.message || 'Failed to load your goals.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Compute stats
  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'Active').length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const successRate = totalGoals === 0 ? '0.0%' : ((completedGoals / totalGoals) * 100).toFixed(1) + '%';

  // Dynamic progress calculation
  const calculateProgress = (goal) => {
    if (goal.status === 'Completed') return 100;
    
    const cur = Number(goal.currentWeight);
    const tar = Number(goal.targetWeight);
    
    if (goal.goalType === 'Weight Loss') {
      if (cur <= tar) return 100;
      // Compares current vs target relative to target
      const progress = 100 - (((cur - tar) / tar) * 100);
      return Math.max(0, Math.min(100, Math.round(progress)));
    }
    
    if (goal.goalType === 'Weight Gain' || goal.goalType === 'Muscle Gain') {
      if (cur >= tar) return 100;
      const progress = 100 - (((tar - cur) / tar) * 100);
      return Math.max(0, Math.min(100, Math.round(progress)));
    }
    
    if (goal.goalType === 'Maintenance') {
      const diff = Math.abs(cur - tar);
      const progress = 100 - ((diff / tar) * 100);
      return Math.max(0, Math.min(100, Math.round(progress)));
    }
    
    return 50; // Fallback
  };

  // Date formatter
  const formatTargetDate = (dateStr) => {
    if (!dateStr) return 'No target date set';
    const d = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return `Target: ${d.toLocaleDateString([], options)}`;
  };

  // Handle inputs
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Create Goal
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    const targetWNum = Number(createForm.targetWeight);
    const currentWNum = Number(createForm.currentWeight);
    const caloriesNum = createForm.targetCalories ? Number(createForm.targetCalories) : undefined;

    if (!targetWNum || targetWNum <= 0 || targetWNum > 500) {
      toast.error('Please enter a valid target weight (1 - 500 kg).');
      return;
    }
    if (!currentWNum || currentWNum <= 0 || currentWNum > 500) {
      toast.error('Please enter a valid starting weight (1 - 500 kg).');
      return;
    }
    if (caloriesNum !== undefined && (caloriesNum <= 0 || caloriesNum > 10000)) {
      toast.error('Please enter realistic target calories (0 - 10000 kcal).');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating goal details...');

    try {
      const payload = {
        goalType: createForm.goalType,
        targetWeight: targetWNum,
        currentWeight: currentWNum,
        targetCalories: caloriesNum,
        targetDate: createForm.targetDate ? new Date(createForm.targetDate).toISOString() : undefined,
        status: 'Active'
      };

      const res = await goalService.addGoal(payload);
      if (res.success) {
        toast.success('Goal created successfully!', { id: toastId });
        setIsCreateModalOpen(false);
        setCreateForm({
          goalType: 'Weight Loss',
          targetWeight: '',
          currentWeight: '',
          targetCalories: '',
          targetDate: ''
        });
        fetchGoals(true);
      } else {
        toast.error(res.message || 'Failed to create goal.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while saving goal.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Update Modal
  const openUpdateModal = (goal) => {
    setSelectedGoal(goal);
    setUpdateForm({
      currentWeight: goal.currentWeight,
      status: goal.status
    });
    setIsUpdateModalOpen(true);
  };

  // Submit Update Goal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const weightNum = Number(updateForm.currentWeight);
    if (!weightNum || weightNum <= 0 || weightNum > 500) {
      toast.error('Please enter a valid current weight (1 - 500 kg).');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Updating goal progress...');

    try {
      const res = await goalService.updateGoal(selectedGoal._id, {
        currentWeight: weightNum,
        status: updateForm.status
      });

      if (res.success) {
        toast.success('Goal progress updated!', { id: toastId });
        setIsUpdateModalOpen(false);
        setSelectedGoal(null);
        fetchGoals(true);
      } else {
        toast.error(res.message || 'Failed to update goal.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while updating goal.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Goal
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    const toastId = toast.loading('Deleting goal...');
    try {
      const res = await goalService.deleteGoal(id);
      if (res.success) {
        toast.success(res.message || 'Goal deleted successfully.', { id: toastId });
        fetchGoals(true);
      } else {
        toast.error(res.message || 'Failed to delete goal.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while deleting goal.', { id: toastId });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto relative">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Target className="w-4.5 h-4.5" />
              <span>Target Objectives</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Goals</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Set, update, and manage your health targets and physical goals.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all active:scale-98 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </button>
        </div>

        {/* Goals Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Goals</span>
              <span className="text-3xl font-black text-white">{activeGoals}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 animate-pulse">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Goals</span>
              <span className="text-3xl font-black text-white">{completedGoals}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Success Rate</span>
              <span className="text-3xl font-black text-white">{successRate}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
              <Trophy className="w-5 h-5" />
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

        {/* Goals List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Current Milestones</h2>
          
          {loading && goals.length === 0 ? (
            /* Loading Skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((n) => (
                <div key={n} className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 animate-pulse flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-5 bg-slate-900 rounded w-44"></div>
                      <div className="h-3 bg-slate-900 rounded w-28"></div>
                    </div>
                    <div className="h-6 bg-slate-900 rounded w-10"></div>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full w-full"></div>
                  <div className="flex justify-between h-4 bg-slate-900 rounded w-32 mt-1"></div>
                </div>
              ))}
            </div>
          ) : goals.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl border border-slate-900 bg-slate-900/10 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-650/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Target className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-200">No milestones set</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Create your first fitness milestone goal to track your weight, muscle growth, or calorie targets!
                </p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs transition-all active:scale-97 cursor-pointer"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            /* Goal Cards List */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const progress = calculateProgress(goal);
                const isCompleted = goal.status === 'Completed';

                return (
                  <div 
                    key={goal._id} 
                    className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/20 hover:border-slate-850 transition-all flex flex-col gap-4 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                          {goal.goalType}
                          {isCompleted && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-[9px] text-emerald-400 font-extrabold">
                              Completed
                            </span>
                          )}
                        </h3>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatTargetDate(goal.targetDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                          isCompleted 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-purple-600/10 border-purple-500/20 text-purple-400'
                        }`}>
                          {progress}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-900">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-purple-600 to-indigo-500'
                        }`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-500">Current</span>
                        <span className="font-extrabold text-slate-200">{goal.currentWeight} kg</span>
                      </div>
                      
                      {goal.targetCalories && (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase text-slate-500">Daily Target</span>
                          <span className="font-semibold text-slate-400">{goal.targetCalories} kcal</span>
                        </div>
                      )}

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase text-slate-500">Target</span>
                        <span className="font-extrabold text-purple-400">{goal.targetWeight} kg</span>
                      </div>
                    </div>

                    {/* Floating Actions on Hover */}
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-900/40">
                      <button
                        onClick={() => openUpdateModal(goal)}
                        title="Update Progress"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all active:scale-97 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Update Progress</span>
                      </button>
                      <button
                        onClick={() => handleDelete(goal._id)}
                        title="Delete Goal"
                        className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
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

        {/* Create Goal Modal Overlay */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md p-6 rounded-3xl border border-slate-900 bg-slate-900/90 backdrop-blur-md shadow-2xl flex flex-col gap-5 relative animate-in fade-in-50 zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Target className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">Create Fitness Goal</h3>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400" htmlFor="goalType">
                    Goal Target Type
                  </label>
                  <select
                    id="goalType"
                    name="goalType"
                    value={createForm.goalType}
                    onChange={handleCreateChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 cursor-pointer"
                  >
                    {['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Maintenance'].map(type => (
                      <option key={type} value={type} className="bg-slate-950">{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="currentWeight">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="currentWeight"
                      name="currentWeight"
                      value={createForm.currentWeight}
                      onChange={handleCreateChange}
                      placeholder="e.g. 78"
                      min="1"
                      max="500"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="targetWeight">
                      Target Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="targetWeight"
                      name="targetWeight"
                      value={createForm.targetWeight}
                      onChange={handleCreateChange}
                      placeholder="e.g. 70"
                      min="1"
                      max="500"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="targetCalories">
                      Daily Calorie Budget (optional)
                    </label>
                    <input
                      type="number"
                      id="targetCalories"
                      name="targetCalories"
                      value={createForm.targetCalories}
                      onChange={handleCreateChange}
                      placeholder="e.g. 2000"
                      min="0"
                      max="10000"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="targetDate">
                      Target Date (optional)
                    </label>
                    <input
                      type="date"
                      id="targetDate"
                      name="targetDate"
                      value={createForm.targetDate}
                      onChange={handleCreateChange}
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
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
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Save Goal</span>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Update Progress Modal Overlay */}
        {isUpdateModalOpen && selectedGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm p-6 rounded-3xl border border-slate-900 bg-slate-900/90 backdrop-blur-md shadow-2xl flex flex-col gap-5 relative animate-in fade-in-50 zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">Update Goal Progress</h3>
                </div>
                <button 
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedGoal(null);
                  }}
                  disabled={isSubmitting}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-slate-400">Goal Type: <strong>{selectedGoal.goalType}</strong></span>
                  <span className="text-xs text-slate-400">Target Weight: <strong>{selectedGoal.targetWeight} kg</strong></span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400" htmlFor="updateCurrentWeight">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="updateCurrentWeight"
                    name="currentWeight"
                    value={updateForm.currentWeight}
                    onChange={handleUpdateChange}
                    placeholder="e.g. 74"
                    min="1"
                    max="500"
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400" htmlFor="updateStatus">
                    Completion Status
                  </label>
                  <select
                    id="updateStatus"
                    name="status"
                    value={updateForm.status}
                    onChange={handleUpdateChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 cursor-pointer"
                  >
                    <option value="Active" className="bg-slate-950">Active (In Progress)</option>
                    <option value="Completed" className="bg-slate-950">Completed</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdateModalOpen(false);
                      setSelectedGoal(null);
                    }}
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
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

export default Goals;
