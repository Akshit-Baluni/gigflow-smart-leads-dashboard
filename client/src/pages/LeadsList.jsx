import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Loader2,
  Mail,
  Building2,
  Briefcase
} from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import Modal from '../components/Modal';

const statusStyles = {
  New: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  Contacted: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  Qualified: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Interview: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  Hired: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, leadId: null });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leads', {
        params: { search, status: statusFilter }
      });
      setLeads(response.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${deleteModal.leadId}`);
      toast.success('Lead removed from system');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Talent Pipeline</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Command center for all recruitment leads.</p>
        </div>
        <Link
          to="/leads/add"
          className="inline-flex items-center px-6 py-3 neuro-gradient text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-sky-500/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Onboard Candidate
        </Link>
      </div>

      <div className="neuro-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-white/5 transition-colors">
          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
              placeholder="Search by name, email, or company..."
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full md:w-48 py-3 px-4 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/30 transition-all cursor-pointer"
            >
              <option value="">Filter by Status</option>
              <option value="New">New Leads</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Interview">Interview</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Candidate</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Professional Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Current Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Joined</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="h-10 w-10 text-sky-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="text-slate-400 opacity-20">
                      <Plus className="h-20 w-20 mx-auto mb-4" />
                      <p className="font-black text-xl uppercase tracking-widest">No candidates found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-2xl neuro-gradient flex items-center justify-center text-white font-black mr-4 shadow-lg group-hover:rotate-6 transition-transform">
                          {lead.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">{lead.full_name}</p>
                          <div className="flex items-center text-xs text-slate-500 mt-1 font-medium">
                            <Mail className="h-3 w-3 mr-1 opacity-50" />
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                          <Briefcase className="h-3 w-3 mr-2 text-sky-500 opacity-70" />
                          {lead.job_role || 'General Talent'}
                        </div>
                        <div className="flex items-center text-xs text-slate-500 font-medium">
                          <Building2 className="h-3 w-3 mr-2 opacity-50" />
                          {lead.company_name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={clsx(
                        'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm',
                        statusStyles[lead.status] || 'bg-slate-100 text-slate-400 border-slate-200'
                      )}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="p-3 text-slate-400 hover:text-sky-500 hover:bg-sky-500/10 rounded-2xl transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/leads/edit/${lead.id}`}
                          className="p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-2xl transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, leadId: lead.id })}
                          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, leadId: null })}
        onConfirm={handleDelete}
        title="Remove Candidate"
        message="This will permanently delete the candidate and all their activity history. This action cannot be undone."
      />
    </div>
  );
};

export default LeadsList;
