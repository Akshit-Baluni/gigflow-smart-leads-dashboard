import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Plus,
  Loader2,
  Clock,
  Edit,
  Users,
  Zap,
  Globe
} from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const statusStyles = {
  New: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  Contacted: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  Qualified: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Interview: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  Hired: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const activityIcons = {
  Call: Phone,
  Email: Mail,
  'Follow-up': Clock,
  'Interview Scheduled': Calendar,
  Meeting: Users,
  'Status Update': MessageSquare,
};

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'Call', note: '' });

  const fetchData = async () => {
    try {
      const [leadRes, activityRes] = await Promise.all([
        api.get(`/leads/${id}`),
        api.get(`/leads/${id}/activities`)
      ]);
      setLead(leadRes.data);
      setActivities(activityRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchData();
      await api.post(`/leads/${id}/activities`, {
        type: 'Status Update',
        note: `Stage changed to ${newStatus}`
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/leads/${id}/activities`, newActivity);
      toast.success('Activity logged');
      setNewActivity({ type: 'Call', note: '' });
      setShowActivityForm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to log activity');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate('/leads')}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{lead.full_name}</h1>
              <select 
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={clsx(
                  'px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all',
                  statusStyles[lead.status]
                )}
              >
                {Object.keys(statusStyles).map(status => (
                  <option key={status} value={status} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white">{status}</option>
                ))}
              </select>
            </div>
            <p className="text-slate-500 mt-1 flex items-center font-bold">
              <Mail className="h-4 w-4 mr-2" /> {lead.email}
            </p>
          </div>
        </div>
        
        <Link
          to={`/leads/edit/${lead.id}`}
          className="inline-flex items-center px-6 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-xl"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="neuro-card p-8 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl neuro-gradient flex items-center justify-center text-white font-black text-xl shadow-xl shadow-sky-500/20">
                {lead.full_name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white">Full Profile</h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Candidate ID: #{lead.id}</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: Briefcase, label: 'Job Role', value: lead.job_role, color: 'text-sky-500' },
                { icon: Building2, label: 'Company', value: lead.company_name, color: 'text-indigo-500' },
                { icon: Phone, label: 'Phone', value: lead.phone, color: 'text-amber-500' },
                { icon: Globe, label: 'Source', value: lead.source, color: 'text-purple-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className={clsx("mt-1 p-2 rounded-lg bg-slate-100 dark:bg-white/5", item.color)}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.value || 'Not specified'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="neuro-card p-8 premium-gradient text-white relative overflow-hidden group">
            <Zap className="absolute -bottom-4 -right-4 h-32 w-32 opacity-10 group-hover:scale-125 transition-transform duration-700" />
            <h3 className="text-lg font-black tracking-tight mb-2">Hiring Insights</h3>
            <p className="text-sm font-medium opacity-80 leading-relaxed">
              This candidate shows high potential for the {lead.job_role} position based on recent feedback.
            </p>
            <button 
              onClick={() => toast.success('Analyzing candidate performance...')}
              className="mt-6 px-4 py-2 bg-white text-[#0f172a] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-opacity-90 transition-all"
            >
              View Analytics
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="neuro-card p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Interaction History</h3>
              </div>
              <button
                onClick={() => setShowActivityForm(!showActivityForm)}
                className="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg"
              >
                {showActivityForm ? 'Cancel' : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Log Activity
                  </>
                )}
              </button>
            </div>

            {showActivityForm && (
              <form onSubmit={handleAddActivity} className="mb-10 p-6 rounded-[24px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</label>
                    <select
                      value={newActivity.type}
                      onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                      className="block w-full px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/30"
                    >
                      {Object.keys(activityIcons).map(type => (
                        <option key={type} value={type} className="bg-white dark:bg-[#0f172a]">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes</label>
                    <input
                      type="text"
                      required
                      value={newActivity.note}
                      onChange={(e) => setNewActivity({ ...newActivity, note: e.target.value })}
                      className="block w-full px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/30"
                      placeholder="Summary of the interaction..."
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-8 py-3 neuro-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            )}

            <div className="relative space-y-8 pl-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-sky-500 before:via-slate-200 dark:before:via-white/10 before:to-transparent">
              {activities.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <p className="font-bold text-slate-500">No interactions logged yet</p>
                </div>
              ) : (
                activities.map((activity, idx) => {
                  const Icon = activityIcons[activity.type] || MessageSquare;
                  return (
                    <div key={activity.id} className="relative">
                      <div className="absolute -left-11 top-0 h-6 w-6 rounded-lg bg-white dark:bg-[#0f172a] border-2 border-sky-500 flex items-center justify-center z-10 shadow-lg">
                        <Icon className="h-3 w-3 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{activity.type}</h4>
                          <span className="text-[10px] font-bold text-slate-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1 opacity-50" />
                            {new Date(activity.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                          {activity.note}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
