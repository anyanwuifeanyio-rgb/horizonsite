import React, { useEffect } from 'react';
import { CheckCircle2, X, MessageCircle, Sparkles } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-md bg-[#0f223f] border-2 border-[#CFAE70] text-white rounded-2xl p-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#CFAE70]/20 text-[#CFAE70] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E4C88E]">
            Horizon Move Limited Alert
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed">{message}</p>
          <div className="pt-2 flex items-center gap-3 text-[11px]">
            <a
              href={createWhatsAppUrl(`Hello, I have submitted an inquiry on the Horizon Move website: ${message}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Open WhatsApp Desk</span>
            </a>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
