import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Utensils, Plus, Apple, Flame, ChevronRight, Target } from 'lucide-react';

/**
 * FoodTracker Component
 * Renders the food and nutrition tracker inside the protected dashboard area.
 */
const FoodTracker = () => {
  const mockMeals = [
    { id: 1, name: 'Egg & Avocado Whole Wheat Toast', mealType: 'Breakfast', calories: 420, carbs: '32g', protein: '18g', fat: '14g', time: '08:00 AM' },
    { id: 2, name: 'Grilled Salmon with Quinoa & Asparagus', mealType: 'Lunch', calories: 650, carbs: '45g', protein: '42g', fat: '20g', time: '01:15 PM' },
    { id: 3, name: 'Double Chocolate Whey Protein Shake', mealType: 'Snack', calories: 280, carbs: '12g', protein: '30g', fat: '3g', time: '04:30 PM' }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
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
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all active:scale-98 cursor-pointer self-start sm:self-center">
            <Plus className="w-4 h-4" />
            <span>Add Food</span>
          </button>
        </div>

        {/* Macro Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Calorie Card */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col justify-between gap-4 md:col-span-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calories Budget</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">1,350</span>
              <span className="text-sm text-slate-500">/ 2,200 kcal</span>
            </div>
            {/* Custom progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
              <div className="bg-gradient-to-r from-orange-500 to-purple-600 h-2 rounded-full" style={{ width: '61.3%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>61.3% consumed</span>
              <span>850 kcal remaining</span>
            </div>
          </div>

          {/* Macro breakdowns */}
          <div className="grid grid-cols-3 md:grid-cols-1 md:col-span-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Protein</span>
                <span className="text-sm md:text-base font-extrabold text-white">90g / 140g</span>
              </div>
              <div className="hidden md:block w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Carbohydrates</span>
                <span className="text-sm md:text-base font-extrabold text-white">89g / 250g</span>
              </div>
              <div className="hidden md:block w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Fats</span>
                <span className="text-sm md:text-base font-extrabold text-white">37g / 70g</span>
              </div>
              <div className="hidden md:block w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Logs */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Today's Logged Meals</h2>
          <div className="grid grid-cols-1 gap-4">
            {mockMeals.map((meal) => (
              <div key={meal.id} className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 hover:bg-slate-900/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Apple className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">{meal.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-900 text-[10px] font-bold text-purple-400">{meal.mealType}</span>
                      <span>•</span>
                      <span>Protein: <strong className="text-slate-200">{meal.protein}</strong></span>
                      <span>•</span>
                      <span>Carbs: <strong className="text-slate-200">{meal.carbs}</strong></span>
                      <span>•</span>
                      <span>Fat: <strong className="text-slate-200">{meal.fat}</strong></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-start gap-2 border-t border-slate-900/60 sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-sm font-extrabold text-white">{meal.calories} kcal</span>
                  <span className="text-xs text-slate-500">{meal.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FoodTracker;
