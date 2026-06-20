import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

/**
 * MainLayout Component
 * 
 * Purpose:
 * Core layout structural container.
 * Integrates the Sidebar navigation, Navbar header, and dynamically handles
 * viewport sizing (collapsing/expanding grids) and mobile drawers.
 * 
 * Design Inspiration:
 * - Linear / Vercel (Dark, glassmorphism, minimal borders, accent glows).
 */
const MainLayout = ({ children }) => {
  // Sidebar state configurations
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans antialiased selection:bg-purple-600 selection:text-white relative">
      
      {/* Decorative SaaS gradient background glows (Linear/Vercel style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Navigation Sidebar (Desktop collapsible & Mobile drawer-overlay) */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main content viewport panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden z-10">
        
        {/* Navigation Navbar (Top Header) */}
        <Navbar setIsMobileOpen={setIsMobileOpen} />

        {/* Scrollable Viewport workspace */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {/* Support both wrapper usage (children) and React Router Outlet context */}
          {children || <Outlet />}
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
