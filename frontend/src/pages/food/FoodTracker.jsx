import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Utensils, Plus, Apple, Flame, X, Trash2, AlertCircle } from 'lucide-react';
import { foodService } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * FoodTracker Component
 * Renders the food and nutrition tracker inside the protected dashboard area.
 * Connects to live MongoDB endpoints for fetching, adding, and deleting food logs.
 */
const FoodTracker = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields state
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealType: 'Breakfast',
    foodDate: new Date().toISOString().substring(0, 16) // Format: YYYY-MM-DDTHH:MM
  });

  // Daily budget targets (standard SaaS defaults)
  const CALORIES_GOAL = 2200;
  const PROTEIN_GOAL = 140;
  const CARBS_GOAL = 250;
  const FATS_GOAL = 70;

  // Fetch all food entries
  const fetchFoods = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await foodService.getFoods();
      if (res.success) {
        setFoods(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching food logs:', err);
      setError(err.response?.data?.message || 'Failed to load your nutrition logs.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Filter today's foods for macro dashboard summation
  const getTodayMeals = () => {
    const todayStr = new Date().toDateString();
    return foods.filter(f => new Date(f.foodDate).toDateString() === todayStr);
  };
  const todayMeals = getTodayMeals();

  // Sum macro values for today's logs
  const totalCalories = todayMeals.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = todayMeals.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalCarbs = todayMeals.reduce((sum, f) => sum + (f.carbs || 0), 0);
  const totalFats = todayMeals.reduce((sum, f) => sum + (f.fats || 0), 0);

  // Math metrics for summary
  const caloriesConsumedPct = Math.min(100, Math.round((totalCalories / CALORIES_GOAL) * 100)) || 0;
  const caloriesRemaining = Math.max(0, CALORIES_GOAL - totalCalories);

  // Form handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Human friendly meal dates and times
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeStr = d.toLocaleTimeString([], options);

    if (isToday) {
      return timeStr;
    }
    if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    }

    const dateOptions = { day: '2-digit', month: 'short' };
    const dayStr = d.toLocaleDateString([], dateOptions);
    return `${dayStr}, ${timeStr}`;
  };

  // Submit food entry
  const handleSubmit = async (e) => {
    e.preventDefault();

    const caloriesNum = Number(formData.calories);
    const proteinNum = Number(formData.protein);
    const carbsNum = Number(formData.carbs);
    const fatsNum = Number(formData.fats);

    // Front-end validations
    if (!formData.foodName.trim()) {
      toast.error('Please enter a food name.');
      return;
    }
    if (formData.calories === '' || caloriesNum < 0 || caloriesNum > 5000) {
      toast.error('Please enter a valid calorie amount (0 - 5000 kcal).');
      return;
    }
    if (formData.protein === '' || proteinNum < 0 || proteinNum > 500) {
      toast.error('Please enter valid protein content (0 - 500 g).');
      return;
    }
    if (formData.carbs === '' || carbsNum < 0 || carbsNum > 1000) {
      toast.error('Please enter valid carbohydrate content (0 - 1000 g).');
      return;
    }
    if (formData.fats === '' || fatsNum < 0 || fatsNum > 500) {
      toast.error('Please enter valid fat content (0 - 500 g).');
      return;
    }
    if (!formData.mealType) {
      toast.error('Please select a meal type.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Logging nutritional entry...');

    try {
      const payload = {
        foodName: formData.foodName.trim(),
        calories: caloriesNum,
        protein: proteinNum,
        carbs: carbsNum,
        fats: fatsNum,
        mealType: formData.mealType,
        foodDate: new Date(formData.foodDate).toISOString()
      };

      const res = await foodService.addFood(payload);
      if (res.success) {
        toast.success(res.message || 'Food logged successfully!', { id: toastId });
        setIsModalOpen(false);
        // Reset form
        setFormData({
          foodName: '',
          calories: '',
          protein: '',
          carbs: '',
          fats: '',
          mealType: 'Breakfast',
          foodDate: new Date().toISOString().substring(0, 16)
        });
        // Reload list silently
        fetchFoods(true);
      } else {
        toast.error(res.message || 'Failed to log food.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while saving food entry.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete food entry
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food entry?')) return;

    const toastId = toast.loading('Deleting food log...');
    try {
      const res = await foodService.deleteFood(id);
      if (res.success) {
        toast.success(res.message || 'Food entry deleted successfully.', { id: toastId });
        // Reload list silently
        fetchFoods(true);
      } else {
        toast.error(res.message || 'Failed to delete food entry.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error occurred while deleting food entry.', { id: toastId });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto relative">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Utensils className="w-4.5 h-4.5" />
              <span>Nutrition Analytics</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Food Tracker</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Track your meals, watch your macros, and balance your calorie targets.
            </p>
          </div>
          <button 
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                foodDate: new Date().toISOString().substring(0, 16)
              }));
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all active:scale-98 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food</span>
          </button>
        </div>

        {/* Macro Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Calorie Card */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between gap-4 md:col-span-2 relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all duration-500"></div>
            
            <div className="flex justify-between items-center z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calories Budget</span>
              <Flame className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-4xl font-black text-white">{totalCalories.toLocaleString()}</span>
              <span className="text-sm text-slate-500">/ {CALORIES_GOAL} kcal</span>
            </div>
            {/* Custom progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-900 z-10">
              <div 
                className="bg-gradient-to-r from-orange-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${caloriesConsumedPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 z-10">
              <span>{caloriesConsumedPct}% consumed today</span>
              <span>{caloriesRemaining.toLocaleString()} kcal remaining</span>
            </div>
          </div>

          {/* Macro breakdowns */}
          <div className="grid grid-cols-3 md:grid-cols-1 md:col-span-2 gap-4">
            {/* Protein Progress */}
            <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-850 transition-all flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Protein</span>
                <span className="text-sm md:text-base font-extrabold text-white">{totalProtein}g / {PROTEIN_GOAL}g</span>
              </div>
              <div className="hidden md:block w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((totalProtein / PROTEIN_GOAL) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs Progress */}
            <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-850 transition-all flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Carbohydrates</span>
                <span className="text-sm md:text-base font-extrabold text-white">{totalCarbs}g / {CARBS_GOAL}g</span>
              </div>
              <div className="hidden md:block w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((totalCarbs / CARBS_GOAL) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Fats Progress */}
            <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-850 transition-all flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Fats</span>
                <span className="text-sm md:text-base font-extrabold text-white">{totalFats}g / {FATS_GOAL}g</span>
              </div>
              <div className="hidden md:block w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-pink-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((totalFats / FATS_GOAL) * 100))}%` }}
                ></div>
              </div>
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

        {/* Meal Logs */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Logged Food Items</h2>
          
          {loading && foods.length === 0 ? (
            /* Loading skeletons */
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-900 rounded w-44"></div>
                      <div className="h-3 bg-slate-900 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-slate-900 rounded w-20 self-end sm:self-center"></div>
                </div>
              ))}
            </div>
          ) : foods.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl border border-slate-900 bg-slate-900/10 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-650/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Apple className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-200">No meals logged yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Start tracking your breakfast, lunch, dinners, or snacks to reach your macro goals!
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs transition-all active:scale-97 cursor-pointer"
              >
                Log Your First Meal
              </button>
            </div>
          ) : (
            /* Meal List */
            <div className="grid grid-cols-1 gap-4">
              {foods.map((meal) => (
                <div key={meal._id} className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/30 hover:border-slate-850 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <Apple className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">{meal.foodName}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-900 text-[10px] font-bold text-purple-400">{meal.mealType}</span>
                        <span>•</span>
                        <span>Protein: <strong className="text-slate-200">{meal.protein}g</strong></span>
                        <span>•</span>
                        <span>Carbs: <strong className="text-slate-200">{meal.carbs}g</strong></span>
                        <span>•</span>
                        <span>Fat: <strong className="text-slate-200">{meal.fats}g</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center sm:items-end justify-between sm:justify-start gap-4 border-t border-slate-900/60 sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-sm font-extrabold text-white">{meal.calories} kcal</span>
                      <span className="text-xs text-slate-500 mt-0.5">{formatTime(meal.foodDate)}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(meal._id)}
                      title="Delete Entry"
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Food Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md p-6 rounded-3xl border border-slate-900 bg-slate-900/90 backdrop-blur-md shadow-2xl flex flex-col gap-5 relative animate-in fade-in-50 zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Utensils className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">Log Food Item</h3>
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
                  <label className="text-xs font-bold text-slate-400" htmlFor="foodName">
                    Food Item Name
                  </label>
                  <input
                    type="text"
                    id="foodName"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    placeholder="e.g. Oatmeal with Chia Seeds"
                    maxLength="100"
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="mealType">
                      Meal Type
                    </label>
                    <select
                      id="mealType"
                      name="mealType"
                      value={formData.mealType}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 cursor-pointer"
                    >
                      {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
                        <option key={type} value={type} className="bg-slate-950">{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="calories">
                      Calories (kcal)
                    </label>
                    <input
                      type="number"
                      id="calories"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      placeholder="e.g. 320"
                      min="0"
                      max="5000"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>

                {/* Macro Inputs */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="protein">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      id="protein"
                      name="protein"
                      value={formData.protein}
                      onChange={handleChange}
                      placeholder="g"
                      min="0"
                      max="500"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-3 py-2 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="carbs">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      id="carbs"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleChange}
                      placeholder="g"
                      min="0"
                      max="1000"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-3 py-2 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="fats">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      id="fats"
                      name="fats"
                      value={formData.fats}
                      onChange={handleChange}
                      placeholder="g"
                      min="0"
                      max="500"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-3 py-2 text-sm transition-colors text-slate-200 disabled:opacity-55"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400" htmlFor="foodDate">
                    Logged Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="foodDate"
                    name="foodDate"
                    value={formData.foodDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors text-slate-200 disabled:opacity-55 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 mt-3">
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
                      <span>Save Food</span>
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

export default FoodTracker;
