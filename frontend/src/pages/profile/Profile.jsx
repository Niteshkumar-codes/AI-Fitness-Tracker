import React, { useContext, useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Calendar, Scale, Ruler, LogOut, Shield, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { toTitleCase } from '../../utils/formatters';

/**
 * Profile Component
 * Renders the user's personal details, health parameters, and logout options.
 * Connects to the backend GET /api/auth/profile endpoint.
 */
const Profile = () => {
  const { logout, updateCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Prefer Not To Say',
    height: '',
    weight: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleEditClick = () => {
    if (profile) {
      let initialGender = 'Prefer Not To Say';
      if (profile.gender) {
        const normalized = profile.gender.trim().toLowerCase();
        if (normalized === 'male') initialGender = 'Male';
        else if (normalized === 'female') initialGender = 'Female';
        else if (normalized === 'other') initialGender = 'Other';
      }

      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        gender: initialGender,
        height: profile.height || '',
        weight: profile.weight || '',
      });
      setSubmitError(null);
      setIsEditModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Front-end Validations
    if (!formData.name || formData.name.trim().length < 2) {
      setSubmitError('Name must be at least 2 characters.');
      setIsSubmitting(false);
      return;
    }

    if (formData.age !== '' && formData.age !== null) {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        setSubmitError('Age must be between 13 and 120.');
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.height !== '' && formData.height !== null) {
      const hNum = Number(formData.height);
      if (isNaN(hNum) || hNum < 100 || hNum > 250) {
        setSubmitError('Height must be between 100 cm and 250 cm.');
        setIsSubmitting(false);
        return;
      }
    }

    if (formData.weight !== '' && formData.weight !== null) {
      const wNum = Number(formData.weight);
      if (isNaN(wNum) || wNum < 20 || wNum > 500) {
        setSubmitError('Weight must be between 20 kg and 500 kg.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await api.put('/auth/profile', {
        name: formData.name.trim(),
        age: formData.age === '' ? null : Number(formData.age),
        gender: formData.gender,
        height: formData.height === '' ? null : Number(formData.height),
        weight: formData.weight === '' ? null : Number(formData.weight),
      });

      if (response.data && response.data.success) {
        toast.success('Profile updated successfully!', {
          icon: '✨',
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
          }
        });
        setProfile(response.data.user);
        if (updateCurrentUser) {
          updateCurrentUser(response.data.user);
        }
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setSubmitError(err.response?.data?.message || 'Failed to update profile.');
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/auth/profile');
      if (response.data && response.data.success) {
        setProfile(response.data.user);
        if (updateCurrentUser) {
          updateCurrentUser(response.data.user);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch user profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogoutClick = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 text-sm font-sans">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-purple-600 animate-spin mb-3"></div>
          <span>Synchronizing profile details...</span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto items-center justify-center min-h-[50vh]">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold text-center animate-pulse max-w-md w-full">
            ⚠️ {error}
          </div>
          <button 
            onClick={fetchProfile}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer transition-all active:scale-98"
          >
            Retry Loading
          </button>
        </div>
      </MainLayout>
    );
  }

  // Fallback defaults if profile is null
  const user = profile || {
    name: 'User Name',
    email: 'user@domain.com',
    height: null,
    weight: null,
    age: null,
    gender: 'Prefer Not To Say',
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
              <h2 className="font-extrabold text-white text-lg">{user.name ? toTitleCase(user.name) : 'User Name'}</h2>
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1"><Mail className="w-3.5 h-3.5" />{user.email}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 mt-1 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Verified Account</span>
            </div>

            <button 
              onClick={handleEditClick}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 border border-purple-500 text-white text-sm font-bold transition-all cursor-pointer active:scale-98"
            >
              <User className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button 
              onClick={handleLogoutClick}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm font-bold transition-all cursor-pointer active:scale-98"
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
                  <span className="text-base font-extrabold text-white">{user.gender || 'Not set'}</span>
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-md p-6 rounded-3xl border border-slate-900 bg-slate-950/95 backdrop-blur-md shadow-2xl flex flex-col gap-5 z-10 animate-in fade-in zoom-in duration-200">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Edit Profile</h2>
              <p className="text-xs text-slate-400">Update your personal credentials and health parameters.</p>
            </div>

            {submitError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center animate-pulse">
                ⚠️ {submitError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                  placeholder="Your Name"
                />
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                  placeholder="e.g. 25"
                  min="13"
                  max="120"
                />
              </div>

              {/* Gender (Dropdown) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer Not To Say">Prefer Not To Say</option>
                </select>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                    placeholder="e.g. 175"
                    min="100"
                    max="250"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                    placeholder="e.g. 70"
                    min="20"
                    max="500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-slate-300 font-bold text-xs transition-all active:scale-98 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Profile;
