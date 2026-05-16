import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="neuro-card w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>
          
          <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 border border-white/5 rounded-2xl text-slate-400 font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
