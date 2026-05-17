import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  User,
  GripVertical
} from 'lucide-react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS = [
  { id: 'New', label: 'New Leads', color: 'bg-sky-500' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-indigo-500' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-amber-500' },
  { id: 'Interview', label: 'Interview', color: 'bg-purple-500' },
  { id: 'Hired', label: 'Hired', color: 'bg-emerald-500' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-rose-500' },
];

const SortableLeadCard = ({ lead }) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="neuro-card p-5 group cursor-pointer hover:border-sky-500/30 hover:bg-white/10 transition-all shadow-sm relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          {...attributes} 
          {...listeners}
          className="p-1 rounded hover:bg-white/10 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-slate-600" />
        </div>
        <div 
          onClick={() => navigate(`/leads/${lead.id}`)}
          className="h-8 w-8 rounded-lg neuro-gradient flex items-center justify-center text-[10px] text-white font-black shadow-lg"
        >
          {lead.full_name?.charAt(0)}
        </div>
      </div>

      <div onClick={() => navigate(`/leads/${lead.id}`)}>
        <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors mb-1">
          {lead.full_name}
        </h4>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          {lead.job_role || 'General Role'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center text-[10px] font-bold text-slate-500">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="h-5 w-5 rounded-full border-2 border-white dark:border-[#05070a] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600 dark:text-white">
            <User className="h-2 w-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Pipeline = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeLead = leads.find(l => l.id === active.id);
    const overId = over.id;

    // Check if dropping over a column or a lead
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    const overLead = isOverColumn ? null : leads.find(l => l.id === overId);
    
    const newStatus = isOverColumn ? overId : overLead?.status;

    if (activeLead && newStatus && activeLead.status !== newStatus) {
      setLeads(prev => prev.map(l => 
        l.id === active.id ? { ...l, status: newStatus } : l
      ));
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeLead = leads.find(l => l.id === active.id);
    const overId = over.id;
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    const overLead = isOverColumn ? null : leads.find(l => l.id === overId);
    const newStatus = isOverColumn ? overId : overLead?.status;

    if (activeLead && newStatus) {
      try {
        await api.put(`/leads/${activeLead.id}`, { status: newStatus });
        toast.success(`Candidate moved to ${newStatus}`, {
          icon: '🎯',
          className: 'neuro-card !bg-sky-500/10 !text-sky-400 !border-sky-500/20'
        });
        fetchLeads(); // Refresh to sync with backend activities
      } catch (error) {
        toast.error('Failed to update status');
        fetchLeads(); // Revert on failure
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Visual Pipeline</h1>
          <p className="text-slate-500 font-bold mt-2 italic">Drag and drop candidates across hiring stages.</p>
        </div>
        <button 
          onClick={() => navigate('/leads/add')}
          className="px-6 py-3 neuro-gradient text-white rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all w-full md:w-auto"
        >
          + Quick Onboard
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide">
          {COLUMNS.map((column) => {
            const columnLeads = leads.filter(l => l.status === column.id);
            return (
              <div key={column.id} className="flex-shrink-0 w-80 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-3">
                    <div className={clsx("h-2.5 w-2.5 rounded-full shadow-lg", column.color)} />
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">{column.label}</h3>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-[10px] font-black text-slate-500 border border-slate-200 dark:border-white/5">
                    {columnLeads.length}
                  </span>
                </div>

                <div id={column.id} className="space-y-4 min-h-[500px] p-2 bg-slate-50/50 dark:bg-white/5 rounded-[32px] border border-dashed border-slate-200 dark:border-white/5">
                  <SortableContext 
                    id={column.id}
                    items={columnLeads.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnLeads.map((lead) => (
                      <SortableLeadCard key={lead.id} lead={lead} />
                    ))}
                  </SortableContext>

                  {columnLeads.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-slate-400 opacity-20 italic text-xs font-bold uppercase tracking-widest">
                      Empty Stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default Pipeline;
