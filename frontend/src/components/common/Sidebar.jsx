import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  Target, 
  Droplet, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Camera,
  MessageSquare
} from 'lucide-react';

/**
 * Sidebar Component
 * 
 * Purpose:
 * Collapsible navigation panel for authenticated pages.
 * Supports active route detection via location paths and responsive triggers.
 * 
 * Props:
 * - isCollapsed: Boolean flag for width toggle.
 * - setIsCollapsed: State setter for width toggle.
 * - isMobileOpen: Mobile off-canvas drawer toggle.
 * - setIsMobileOpen: Mobile off-canvas drawer toggler.
 */
const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();

  // Active route matching helper
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Menu items config with associated icons
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Food Tracker', path: '/food', icon: Utensils },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Water Tracker', path: '/water', icon: Droplet },
    { name: 'AI Coach', path: '/ai-coach', icon: Sparkles },
    { name: 'AI Food Analyzer', path: '/ai-food-analyzer', icon: Camera },
    { name: 'AI Chat Assistant', path: '/ai-chat', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    // TODO: Connect AuthContext logout
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Render navigation list
  const renderNavLinks = () => (
    <nav className="flex flex-col gap-1.5 px-3 py-4 flex-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileOpen(false)} // Close mobile drawer on navigation
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold tracking-tight transition-all duration-200 relative group cursor-pointer ${
              active
                ? 'bg-purple-600/10 border-l-2 border-purple-500 text-purple-400 font-bold shadow-md shadow-purple-950/20'
                : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${active ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
            <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              {item.name}
            </span>

            {/* Hover tooltip for collapsed mode */}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                {item.name}
              </div>
            )}
          </Link>
        );
      })}

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold tracking-tight text-red-400 hover:bg-red-500/10 transition-all duration-200 group cursor-pointer mt-auto relative"
      >
        <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
        <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          Logout
        </span>

        {/* Hover tooltip for collapsed mode */}
        {isCollapsed && (
          <div className="absolute left-16 bg-slate-900 border border-slate-800 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
            Logout
          </div>
        )}
      </button>
    </nav>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-slate-950/80 backdrop-blur-xl border-r border-slate-900 transition-all duration-300 ease-in-out relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Collapse Button (Linear Style floating on border) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-8 w-7 h-7 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-md z-30"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Sidebar Header branding */}
        <div className={`h-16 flex items-center border-b border-slate-900/60 px-5 gap-2.5 transition-all ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className={`font-extrabold text-lg text-slate-100 tracking-tight transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            FitAI
          </span>
        </div>

        {/* Navigation list */}
        {renderNavLinks()}
      </aside>

      {/* ================= MOBILE DRAWER OVERLAY ================= */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        ></div>
      )}

      {/* ================= MOBILE DRAWER CONTENT ================= */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 bg-slate-950/95 backdrop-blur-2xl border-r border-slate-900 z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="h-16 flex items-center justify-between border-b border-slate-900 px-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-100 tracking-tight">
              FitAI
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Close drawer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {renderNavLinks()}
      </aside>
    </>
  );
};

export default Sidebar;
