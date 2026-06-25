import React, { useState, useContext } from 'react';
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

/**
 * Navbar Component
 * 
 * Purpose:
 * Top toolbar for layout actions (profile dropdown, global searches, notifications, mobile menu toggle).
 * Uses glassmorphism and modern dark design tokens.
 * 
 * Props:
 * - setIsMobileOpen: State setter to trigger mobile sidebar drawer.
 */
const Navbar = ({ setIsMobileOpen }) => {
  const { currentUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'You reached your water target yesterday! 💧', unread: true },
    { id: 2, message: 'Set a new goal for this week! 🎯', unread: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      
      {/* Left: Mobile Menu button + Welcome text */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Overview</span>
          <h2 className="font-extrabold text-slate-100 text-sm tracking-tight -mt-0.5">
            Good day, Champ
          </h2>
        </div>
      </div>

      {/* Middle: Modern Search Bar (Stripe Dashboard inspired) */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search logs, workouts, goals..."
          className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-900 hover:border-slate-850 focus:border-purple-600 focus:outline-none rounded-xl pl-10 pr-4 py-2 text-xs transition-all text-slate-200"
        />
      </div>

      {/* Right: Actions (Notification bell + Profile profile) */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setDropdownOpen(false);
            }}
            className="p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-850 rounded-2xl shadow-xl p-4 flex flex-col gap-3 z-50">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="font-bold text-slate-200 text-xs">Notifications</span>
                <span 
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                  className="text-[10px] text-purple-400 font-bold hover:underline cursor-pointer"
                >
                  Mark all as read
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-4">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl border border-slate-900 text-xs leading-relaxed ${n.unread ? 'bg-purple-950/10 text-slate-200 font-medium' : 'text-slate-400'}`}>
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-900/50 border border-transparent hover:border-slate-900 cursor-pointer transition-colors text-left"
          >
            {/* Avatar Pill */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-purple-500/10">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-slate-200 text-xs block leading-none">{currentUser?.name || 'User'}</span>
              <span className="text-[9px] text-slate-500 leading-none">Fitness Member</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Profile Dropdown Menu Card */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-slate-950 border border-slate-850 rounded-2xl shadow-xl p-2 flex flex-col z-50">
              <a 
                href="/profile" 
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-xl transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                My Profile
              </a>
              <a 
                href="/profile" 
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-xl transition-colors font-medium"
              >
                <Settings className="w-4 h-4" />
                Settings
              </a>
              <hr className="border-slate-900 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-semibold text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default Navbar;
