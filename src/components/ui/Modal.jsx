import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm">
      <div className="bg-navy-800 border border-navy-700 rounded-lg shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-navy-700">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
