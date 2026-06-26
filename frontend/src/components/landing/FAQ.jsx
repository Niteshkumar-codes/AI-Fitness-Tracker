import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'How does the AI calorie estimation work?',
      a: 'FitAI integrates with advanced language models. When you log a meal by description (e.g. "two eggs and wheat toast") or upload a meal photo, the AI parses the ingredients and estimates daily calories, protein, carbs, and fats.'
    },
    {
      q: 'Is my health data secure?',
      a: 'Absolutely. FitAI protects user data using encrypted transmissions. Your private metrics, daily logs, height, and weight profiles are secured within your private account workspace, and we never share your data with third parties.'
    },
    {
      q: 'Can I track daily workouts?',
      a: 'Yes! You can record your exercises, durations, calories burned, and dates. The AI Coach uses this tracking history to provide weekly suggestions and fitness trends.'
    },
    {
      q: 'Can I upload food images for analysis?',
      a: 'Yes, the AI Food Analyzer supports meal image uploads and text logs. You can upload a photo of your food plate, and the AI model will parse the ingredients and calculate macronutrients.'
    },
    {
      q: 'Is FitAI mobile responsive?',
      a: 'Yes. FitAI is optimized to render across smartphones, tablets, laptops, and desktop viewports, preserving the premium dashboard and trackers on any screen size.'
    }
  ];

  const toggleFAQ = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 border-t border-white/5 bg-slate-950/20 relative z-10 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Common inquiries</h2>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Find answers to common questions about FitAI\'s tracking tools, AI meal estimation accuracy, and mobile viewports.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-purple-500/20"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer select-none group border-none bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 group-hover:scale-108 transition-transform" />
                    <span className="text-sm sm:text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-450 transition-transform duration-350 shrink-0 ${
                      isOpen ? 'rotate-180 text-purple-400' : 'group-hover:text-white'
                    }`} 
                  />
                </button>

                {/* Accordion Content */}
                <div 
                  className={`transition-all duration-350 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-48 border-t border-white/5' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-xs sm:text-sm text-slate-450 leading-relaxed text-left bg-slate-950/25">
                    {faq.a}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
