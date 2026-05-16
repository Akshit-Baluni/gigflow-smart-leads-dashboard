import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Moon, 
  Sun,
  Monitor,
  Save,
  Loader2,
  Database,
  AlertTriangle
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const Settings = () => {
  const { user, updateProfile, changePassword, deactivateAccount, loading: authLoading } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateProfile(profileData);
    if (result.success) {
      toast.success('Identity profile updated successfully', { icon: '🛡️' });
    } else {
      toast.error(result.message);
    }
    setIsSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSaving(true);
    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    
    if (result.success) {
      toast.success('Security key updated', { icon: '🔐' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(result.message);
    }
    setIsSaving(false);
  };

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    const result = await deactivateAccount();
    if (result.success) {
      toast.success('Account deactivated. Goodbye!', { icon: '🗑️' });
      navigate('/login');
    } else {
      toast.error(result.message);
      setIsDeactivating(false);
      setShowDeactivateModal(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">System Config</h1>
          <p className="text-slate-500 font-bold mt-2 italic">Manage your recruiter profile and system preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-8">
          <div className="neuro-card p-8 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-[32px] neuro-gradient flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-sky-500/20 mb-6 group-hover:rotate-6 transition-transform">
              {user?.full_name?.charAt(0)}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{user?.full_name}</h3>
            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em] mt-1">{user?.role}</p>
            
            <div className="w-full mt-8 pt-8 border-t border-slate-100 dark:border-white/5 space-y-4">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group transition-all">
                  <div className="flex items-center text-slate-500 dark:text-slate-400 group-hover:text-sky-500 transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    <span className="text-xs font-black uppercase tracking-widest">Recruiter ID</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400">#{user?.id}</span>
               </div>
            </div>
          </div>

          <div className="neuro-card p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
             <div className="flex items-center space-x-3 mb-6 text-indigo-500">
                <Shield className="h-5 w-5" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Security Pulse</h4>
             </div>
             <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Your session is protected with <span className="text-slate-900 dark:text-white">AES-256</span> encryption. Session expires in 30 days.
             </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <form onSubmit={handleProfileUpdate} className="neuro-card p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-sky-500/10 rounded-xl">
                  <User className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Identity</h3>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 neuro-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save Profile'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  className="block w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Terminal</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="block w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                />
              </div>
            </div>
          </form>

          <form onSubmit={handlePasswordChange} className="neuro-card p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-rose-500/10 rounded-xl">
                  <Lock className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Security</h3>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Update Key'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="block w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Secret Key</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="block w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Secret Key</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="block w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                />
              </div>
            </div>
          </form>

          <section className="neuro-card p-10 space-y-8">
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Monitor className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Appearance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <button 
                onClick={toggleTheme}
                className={clsx(
                  "p-6 rounded-[24px] border transition-all flex flex-col items-center space-y-4 group",
                  isDarkMode 
                    ? "bg-sky-500/10 border-sky-500/30 shadow-lg" 
                    : "bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/10 hover:bg-slate-200 transition-all"
                )}
               >
                  <div className={clsx(
                    "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110",
                    isDarkMode ? "bg-sky-500 text-white" : "bg-slate-300 text-slate-600"
                  )}>
                    <Moon className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Deep Space</p>
               </button>

               <button 
                onClick={toggleTheme}
                className={clsx(
                  "p-6 rounded-[24px] border transition-all flex flex-col items-center space-y-4 group",
                  !isDarkMode 
                    ? "bg-amber-500/10 border-amber-500/30 shadow-lg" 
                    : "bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/10 hover:bg-slate-200 transition-all"
                )}
               >
                  <div className={clsx(
                    "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110",
                    !isDarkMode ? "bg-amber-500 text-white" : "bg-slate-300 text-slate-600"
                  )}>
                    <Sun className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">High Contrast</p>
               </button>
            </div>
          </section>

          <section className="neuro-card p-10 border-rose-500/20 bg-rose-500/5">
             <div className="flex items-center space-x-4 mb-4">
                <Database className="h-5 w-5 text-rose-500" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">Nuclear Option</h3>
             </div>
             <p className="text-xs font-bold text-slate-500 mb-6 italic">This will wipe all candidate records and your profile terminal from our servers.</p>
             <button
               onClick={() => setShowDeactivateModal(true)}
               className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
             >
                Deactivate Account
             </button>
          </section>
        </div>
      </div>
    </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl p-10 max-w-md w-full mx-4 shadow-2xl shadow-rose-500/10 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-rose-500/10 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Confirm Deactivation</h2>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">
                This action is <span className="text-rose-500">permanent and irreversible</span>. All your leads, pipeline data, and your account will be permanently deleted from our servers.
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowDeactivateModal(false)}
                disabled={isDeactivating}
                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={isDeactivating}
                className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeactivating ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                {isDeactivating ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
