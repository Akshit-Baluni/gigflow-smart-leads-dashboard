import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Target, 
  CheckCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Plus,
  Loader2,
  Calendar,
  MessageSquare,
  Clock
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import useThemeStore from '../store/useThemeStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/leads?limit=5') // Assuming limit param or just slice
        ]);
        setStats(statsRes.data.stats);
        
        // Fetch real activities for the dashboard
        // For simplicity, we'll get the last 5 leads created as "recent activity"
        // or we could have a specific endpoint for recent activities.
        setActivities(leadsRes.data.slice(0, 5));
      } catch (error) {
        toast.error('Failed to sync dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Candidate Velocity',
        data: [12, 19, 15, 22, 28, 24, 32],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#0f172a',
        bodyColor: isDarkMode ? '#ffffff' : '#0f172a',
        borderColor: 'rgba(14, 165, 233, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Pipeline', value: stats?.total || 0, icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { title: 'Active Interviews', value: stats?.interview || 0, icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'New Onboarded', value: stats?.new || 0, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Hired Success', value: stats?.hired || 0, icon: CheckCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Command Center</h1>
          <p className="text-slate-500 font-bold mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
            Your pipeline velocity is up 12% this week.
          </p>
        </div>
        <button 
          onClick={() => navigate('/leads/add')}
          className="inline-flex items-center justify-center px-8 py-4 neuro-gradient text-white rounded-[24px] font-black text-sm shadow-2xl shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="neuro-card p-8 group hover:scale-[1.02] transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +14%
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{card.title}</h3>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 neuro-card p-8 min-h-[450px] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Hiring Velocity</h3>
              <p className="text-slate-500 text-sm font-medium">Candidate onboarding metrics over time.</p>
            </div>
            <select className="bg-slate-100 dark:bg-white/5 border-none rounded-xl text-xs font-black text-slate-500 px-4 py-2 outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="neuro-card p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
            <button 
              onClick={() => navigate('/leads')}
              className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-6 flex-1">
            {activities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                <Clock className="h-12 w-12 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No recent pulses</p>
              </div>
            ) : (
              activities.map((lead, idx) => (
                <div 
                  key={lead.id} 
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="flex items-start space-x-4 group cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 p-3 rounded-2xl transition-all"
                >
                  <div className="h-10 w-10 rounded-xl neuro-gradient flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                    {lead.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-sky-500 transition-colors">
                      {lead.full_name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                      Status: <span className="text-sky-500/70">{lead.status}</span>
                    </p>
                    <div className="flex items-center text-[10px] text-slate-400 mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
