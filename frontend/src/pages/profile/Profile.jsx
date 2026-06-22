import React, { useContext } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Calendar, Scale, Ruler, LogOut, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Profile Component
 * Renders the user's personal details, health parameters, and logout options.
 */
const Profile = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Fallback defaults if currentUser is not initialized
  const user = currentUser || {
    name: 'Alex Rivera',
    email: 'alex.rivera@domain.com',
    height: 175,
    weight: 70,
    age: 28,
    gender: 'prefer not to say',
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
              <User className="w-4.5 h-4.5" />
              <span>User Information</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Profile</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Manage your personal credentials, view health metrics, and control your active session.
            </p>
          </div>
        </div>

        {/* Profile Card & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main User Card */}
          <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center md:col-span-1">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25 border-4 border-slate-950">
              <span className="text-white text-3xl font-black">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-extrabold text-white text-lg">{user.name}</h2>
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1"><Mail className="w-3.5 h-3.5" />{user.email}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 mt-1 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Verified Account</span>
            </div>

            <button 
              onClick={handleLogoutClick}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm font-bold transition-all cursor-pointer active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Session</span>
            </button>
          </div>

          {/* Health and bio details */}
          <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col gap-6 md:col-span-2">
            <h3 className="font-bold text-slate-100 text-base tracking-tight border-b border-slate-900 pb-3 flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-purple-400" />
              Health profile details
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-900">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Ruler className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Height</span>
                  <span className="text-base font-extrabold text-white">{user.height ? `${user.height} cm` : 'Not set'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-900">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Scale className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Weight</span>
                  <span className="text-base font-extrabold text-white">{user.weight ? `${user.weight} kg` : 'Not set'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-900">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Age</span>
                  <span className="text-base font-extrabold text-white">{user.age ? `${user.age} Years` : 'Not set'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-900">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                  <User className="w-5 h-5 text-pink-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Gender</span>
                  <span className="text-base font-extrabold text-white capitalize">{user.gender || 'Not set'}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-400 flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-900/10 border border-slate-900">
              <span className="font-bold text-slate-300">About Health Profiles</span>
              <p className="leading-relaxed">
                Health parameters are used to calculate analytics like BMI, calorie expenditures, and daily fluid target volumes. Keeping these parameters accurate ensures correct tracking feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
