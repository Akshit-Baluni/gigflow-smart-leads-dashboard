import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back to GigFlow!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#05070a] relative overflow-hidden px-4 transition-colors duration-700">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] neuro-gradient text-white mb-6 shadow-2xl shadow-sky-500/30 transform hover:rotate-12 transition-transform duration-500">
            <Zap className="h-10 w-10 fill-white" />
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">GigFlow</h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">The intelligent command center for modern hiring teams.</p>
        </div>

        <div className="neuro-card p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:bg-white dark:focus:bg-white/10 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Secret Key</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:bg-white dark:focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex justify-center items-center py-4 px-4 neuro-gradient rounded-2xl shadow-2xl shadow-sky-500/30 text-sm font-black text-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  Enter Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 text-center">
              <p className="text-sm text-slate-500 font-medium">
                New to the platform?{' '}
                <Link to="/register" className="font-bold text-sky-500 hover:text-sky-400 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="mt-8 flex justify-center items-center space-x-6 text-slate-400">
          <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3 mr-1" />
            SECURE ACCESS
          </div>
          <div className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="text-[10px] font-black uppercase tracking-widest">
            V 1.0.4
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
