import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Settings, 
  LogOut, 
  Zap,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Session terminated successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Overview' },
    { path: '/leads', icon: Users, label: 'Candidates' },
    { path: '/pipeline', icon: Kanban, label: 'Pipeline' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-80 h-screen sticky top-0 flex flex-col bg-white dark:bg-[#05070a] border-r border-slate-200 dark:border-white/5 transition-all duration-700">
      <div className="p-10">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-12 w-12 rounded-[18px] neuro-gradient flex items-center justify-center text-white shadow-2xl shadow-sky-500/20 group-hover:rotate-12 transition-transform">
            <Zap className="h-6 w-6 fill-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">GigFlow</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-6 py-4 rounded-[22px] transition-all duration-500 group
              ${isActive 
                ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20 shadow-lg shadow-sky-500/5' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </NavLink>
        ))}
      </nav>

      <div className="p-8 space-y-6">
        <div className="p-6 rounded-[28px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interface Mode</p>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-white/5 text-slate-900 dark:text-white shadow-sm hover:scale-110 transition-transform"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl neuro-gradient p-0.5 shadow-lg">
               <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#05070a] flex items-center justify-center text-slate-900 dark:text-white font-black text-xs">
                  {user?.full_name?.charAt(0)}
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user?.full_name}</p>
              <p className="text-[9px] font-black text-sky-500/50 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-[22px] text-rose-500 hover:bg-rose-500/10 transition-all font-black uppercase tracking-widest text-xs border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="h-4 w-4" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
