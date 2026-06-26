import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import DashboardPreview from '../components/landing/DashboardPreview';
import AppPreview from '../components/landing/AppPreview';
import AIFeatures from '../components/landing/AIFeatures';
import HowItWorks from '../components/landing/HowItWorks';
import WhyChoose from '../components/landing/WhyChoose';
import FAQ from '../components/landing/FAQ';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

/**
 * Landing Component
 * 
 * Purpose:
 * Premium consumer-focused wellness landing page for FitAI. Showcases platform capabilities
 * and acts as the entry point for guest users and recruiters.
 */
const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Mesh Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-purple-600/5 blur-[130px] pointer-events-none animate-drift-glow-1" />
      <div className="absolute bottom-[20%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-drift-glow-2" />
      <div className="absolute top-[35%] left-[25%] w-[35vw] h-[35vw] rounded-full bg-cyan-500/5 blur-[110px] pointer-events-none animate-drift-glow-3" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none animate-drift-glow-1" />

      {/* Background Particles */}
      <div className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-purple-400/30 blur-[1px] animate-particle-1 pointer-events-none" />
      <div className="absolute top-[52%] left-[48%] w-2 h-2 rounded-full bg-cyan-400/25 blur-[1px] animate-particle-2 pointer-events-none" />
      <div className="absolute bottom-[35%] left-[18%] w-1 h-1 rounded-full bg-indigo-400/20 blur-[0.5px] animate-particle-3 pointer-events-none" />
      <div className="absolute top-[30%] right-[22%] w-2 h-2 rounded-full bg-purple-400/25 blur-[1px] animate-particle-2 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] w-1.5 h-1.5 rounded-full bg-cyan-400/30 blur-[1px] animate-particle-1 pointer-events-none" />

      {/* Consumer Fitness SaaS Sections */}
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <AppPreview />
      <AIFeatures />
      <HowItWorks />
      <WhyChoose />
      <FAQ />
      <FinalCTA />
      <Footer />

    </div>
  );
};

export default Landing;
