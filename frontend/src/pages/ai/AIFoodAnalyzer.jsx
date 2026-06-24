import React, { useState, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Camera, Upload, Trash2, Loader2, Flame, Brain, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AIFoodAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null); // Clear previous results
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeFood = async () => {
    if (!selectedImage) {
      toast.error('Please upload or select a food image first.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await api.post('/ai/analyze-food-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        setAnalysisResult(response.data.data);
        toast.success('Food image analyzed successfully!', {
          icon: '🍳',
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
          },
        });
      } else {
        throw new Error('Failed to parse food analysis response.');
      }
    } catch (error) {
      console.error('Error analyzing food image:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error occurred while analyzing image.';
      toast.error(errorMsg, {
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
        },
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
            <Camera className="w-4.5 h-4.5" />
            <span>Gemini Vision Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            AI Food Analyzer
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Snap or upload a photo of your meal. Our AI Vision model will identify the food item, estimate calories and macronutrients, and give you expert nutritional coaching.
          </p>
        </div>

        {/* Input Dropzone Card */}
        <div className="p-6 rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900/30 to-indigo-950/10 backdrop-blur-md relative overflow-hidden">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {!imagePreview ? (
            /* Empty dropzone state */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className="border-2 border-dashed border-slate-800 hover:border-purple-500/40 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all duration-300 group hover:bg-slate-900/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:scale-105 transition-all duration-350">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-slate-200 text-sm md:text-base">
                  Drag and drop your food photo here
                </p>
                <p className="text-xs text-slate-500 mt-1.5">
                  Supports JPEG, PNG, or WEBP up to 5MB
                </p>
              </div>
              <span className="px-4 py-2 text-xs font-extrabold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-xl mt-2">
                Browse Files
              </span>
            </div>
          ) : (
            /* Selected preview state */
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 aspect-video md:aspect-[4/3] rounded-2xl border border-slate-800 overflow-hidden relative group">
                <img
                  src={imagePreview}
                  alt="Meal Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={clearSelectedImage}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-red-500/90 text-white backdrop-blur-sm cursor-pointer transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-850">
                  <h4 className="font-bold text-slate-200 text-sm mb-1">Image Selected</h4>
                  <p className="text-xs text-slate-500 truncate">{selectedImage?.name}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Size: {(selectedImage?.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={triggerFileInput}
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 transition-all active:scale-98 cursor-pointer"
                  >
                    Change Photo
                  </button>
                  <button
                    onClick={analyzeFood}
                    disabled={isAnalyzing}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/15"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing Meal...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span>Analyze Meal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isAnalyzing && (
          <div className="p-10 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center text-slate-400 text-xs md:text-sm font-sans gap-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <span>AI is scanning your image and calculating nutritional values...</span>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysisResult && !isAnalyzing && (
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-900/20 backdrop-blur-md relative overflow-hidden animate-fadeIn">
            {/* Title / Food Name */}
            <div className="border-b border-slate-850 pb-4 mb-6">
              <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Analysis Complete
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-3 tracking-tight">
                {analysisResult.foodName}
              </h2>
            </div>

            {/* Nutritional Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Calories */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Flame className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Calories</span>
                </div>
                <span className="text-lg md:text-xl font-extrabold text-slate-200">
                  {analysisResult.estimatedCalories}
                </span>
                <span className="text-[10px] text-slate-500">kcal (estimated)</span>
              </div>

              {/* Protein */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-500/10 flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Protein</span>
                <span className="text-lg md:text-xl font-extrabold text-slate-200">
                  {analysisResult.protein}
                </span>
                <span className="text-[10px] text-slate-500">grams</span>
              </div>

              {/* Carbs */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Carbs</span>
                <span className="text-lg md:text-xl font-extrabold text-slate-200">
                  {analysisResult.carbs}
                </span>
                <span className="text-[10px] text-slate-500">grams</span>
              </div>

              {/* Fat */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/5 to-rose-500/5 border border-pink-500/10 flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-400">Fat</span>
                <span className="text-lg md:text-xl font-extrabold text-slate-200">
                  {analysisResult.fat}
                </span>
                <span className="text-[10px] text-slate-500">grams</span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="p-5 rounded-2xl border border-slate-850 bg-slate-900/40 relative overflow-hidden">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Brain className="w-4.5 h-4.5" />
                <h4 className="font-extrabold text-slate-200 text-sm">AI Coach Recommendation</h4>
              </div>
              <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-sans">
                {analysisResult.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AIFoodAnalyzer;
