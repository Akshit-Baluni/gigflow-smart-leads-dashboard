import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, User, Mail, Phone, Building2, Briefcase } from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const AddEditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    job_role: '',
    source: '',
    status: 'New'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchLead = async () => {
        try {
          const response = await api.get(`/leads/${id}`);
          setFormData(response.data);
        } catch (error) {
          toast.error('Failed to fetch lead details');
          navigate('/leads');
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name?.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone && !/^\+?[0-9\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format (min 10 digits)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/leads/${id}`, formData);
        toast.success('Candidate profile updated', { icon: '✨' });
      } else {
        await api.post('/leads', formData);
        toast.success('New candidate onboarded', { icon: '🚀' });
      }
      navigate('/leads');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
      if (message.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'This email is already in the system' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing candidate secure file...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold"
        >
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mr-4 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </div>
          Return
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            {isEdit ? 'Refine Profile' : 'New Onboarding'}
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">
            Stage: {formData.status}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="neuro-card p-10 space-y-12">
          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Identity Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name *</label>
                <div className="relative group">
                  <span className={clsx(
                    "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
                    errors.full_name ? "text-rose-500" : "text-slate-400 group-focus-within:text-sky-500"
                  )}>
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={clsx(
                      "block w-full pl-11 pr-4 py-4 border rounded-2xl bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all",
                      errors.full_name ? "border-rose-500 ring-rose-500/20" : "border-slate-200 dark:border-white/5 focus:ring-sky-500/30"
                    )}
                    placeholder="Enter candidate name..."
                  />
                </div>
                {errors.full_name && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.full_name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address *</label>
                <div className="relative group">
                  <span className={clsx(
                    "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
                    errors.email ? "text-rose-500" : "text-slate-400 group-focus-within:text-sky-500"
                  )}>
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={clsx(
                      "block w-full pl-11 pr-4 py-4 border rounded-2xl bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all",
                      errors.email ? "border-rose-500 ring-rose-500/20" : "border-slate-200 dark:border-white/5 focus:ring-sky-500/30"
                    )}
                    placeholder="candidate@email.com"
                  />
                </div>
                {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Line</label>
                <div className="relative group">
                  <span className={clsx(
                    "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
                    errors.phone ? "text-rose-500" : "text-slate-400 group-focus-within:text-sky-500"
                  )}>
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={clsx(
                      "block w-full pl-11 pr-4 py-4 border rounded-2xl bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all",
                      errors.phone ? "border-rose-500 ring-rose-500/20" : "border-slate-200 dark:border-white/5 focus:ring-sky-500/30"
                    )}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                {errors.phone && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Career Context</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Organization</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                    placeholder="Current employer..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Applied Role</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="job_role"
                    value={formData.job_role}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                    placeholder="Position in pipeline..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lead Source</label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="block w-full px-5 py-4 border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                  placeholder="LinkedIn, Referral, etc."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-6 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 py-4 border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-2xl font-bold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-4 neuro-gradient text-white rounded-2xl font-black shadow-2xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin mr-3" />
            ) : (
              <Save className="h-5 w-5 mr-3" />
            )}
            {isEdit ? 'Sync Changes' : 'Initialize Onboarding'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditLead;
