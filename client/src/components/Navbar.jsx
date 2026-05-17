import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Command, Menu } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import toast from 'react-hot-toast';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const { toggleSidebar } = useUIStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/leads?search=${search}`);
      toast.success(`Scanning for "${search}"...`, { icon: '📡' });
      setSearch('');
    }
  };

  return (
    <header className="h-20 lg:h-24 px-4 lg:px-10 flex items-center justify-between sticky top-0 z-20 transition-all duration-700 glass-nav shrink-0">
      <div className="flex items-center flex-1 max-w-xl gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative group flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="block w-full pl-11 pr-4 py-3 lg:py-4 rounded-[20px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white dark:focus:bg-white/10 transition-all duration-500"
            placeholder="Search (Ctrl + K)"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-1 opacity-20 group-focus-within:opacity-100 transition-opacity">
             <Command className="h-3 w-3 text-slate-900 dark:text-white" />
             <span className="text-[10px] font-black text-slate-900 dark:text-white">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-8 ml-4">
        <div className="hidden md:flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/5">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span>System Online</span>
        </div>

        <button 
          onClick={() => toast('Security verified. No new threats.', { icon: '🛡️' })}
          className="relative p-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl transition-all hover:scale-110 hidden sm:block"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-sky-500 rounded-full border-2 border-white dark:border-[#05070a]"></span>
        </button>
        
        <div className="flex items-center space-x-4 sm:pl-4 sm:border-l border-slate-200 dark:border-white/5">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">{user?.full_name}</p>
            <p className="text-[10px] uppercase font-black text-sky-500/50 tracking-[0.2em]">{user?.role}</p>
          </div>
          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-[14px] lg:rounded-[18px] neuro-gradient p-0.5 shadow-xl shadow-sky-500/10 transform hover:scale-105 transition-transform cursor-pointer">
             <div className="w-full h-full rounded-[12px] lg:rounded-[16px] bg-white dark:bg-[#05070a] flex items-center justify-center text-slate-900 dark:text-white font-black text-sm lg:text-lg">
                {user?.full_name?.charAt(0)}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
