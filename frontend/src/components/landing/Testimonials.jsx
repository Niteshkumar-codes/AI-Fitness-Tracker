import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      company: 'TechCorp',
      text: 'FitAI completely streamlined my daily wellness routines. The visual food analyzer parses my meals instantly, and as a developer, the clean, responsive API integrations and modern UX are absolutely outstanding.',
      initials: 'RS',
      gradient: 'from-blue-600 to-cyan-500',
      rating: 5
    },
    {
      name: 'Priya Gupta',
      role: 'Fitness Enthusiast',
      company: 'ActiveLife',
      text: 'The Gemini-powered weekly coach feedback is remarkably detailed and helpful. It adapts my workout recommendations based on my real-time BMI and hydration trends. Truly a premium fitness experience.',
      initials: 'PG',
      gradient: 'from-purple-600 to-pink-500',
      rating: 5
    },
    {
      name: 'Amit Verma',
      role: 'Product Designer',
      company: 'DesignFlow',
      text: 'I am highly critical of SaaS design layouts, but FitAI has wowed me. The glassmorphism card UI, smooth transitions, and glowing progress indicators are visually stunning and feel extremely premium.',
      initials: 'AV',
      gradient: 'from-indigo-600 to-purple-500',
      rating: 5
    }
  ];

  return (
    <section id="reviews" className="py-24 border-t border-white/5 bg-slate-950/40 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-black text-purple-400 uppercase tracking-widest">User feedback</h2>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
            Loved by Builders & Creators
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Read how developers, designers, and fitness enthusiasts use FitAI to optimize their health metrics.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div 
              key={idx}
              className="p-[1.2px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-purple-500/35 hover:to-indigo-500/25 transition-all duration-300 group shadow-md"
            >
              {/* Inner card */}
              <div className="p-8 rounded-[23px] bg-slate-950/80 backdrop-blur-2xl flex flex-col justify-between gap-6 h-full text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full bg-purple-500/5 blur-[35px] pointer-events-none" />
                
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex gap-1.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" />
                    ))}
                  </div>
                  
                  {/* Feedback Text */}
                  <p className="text-xs sm:text-sm text-slate-350 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                {/* Profile row */}
                <div className="flex items-center gap-3.5 border-t border-white/5 pt-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${review.gradient} flex items-center justify-center font-black text-xs text-white shadow-md relative overflow-hidden group-hover:scale-105 transition-transform`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="relative z-10">{review.initials}</span>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col select-none">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                      {review.name}
                    </h4>
                    <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
                      {review.role} • <span className="text-slate-400">{review.company}</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
