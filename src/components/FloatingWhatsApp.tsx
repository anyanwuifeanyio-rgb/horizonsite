import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, GraduationCap, Briefcase, Plane, PhoneCall, Sparkles } from 'lucide-react';
import { createWhatsAppUrl, PRIMARY_PHONE } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickOptions = [
    {
      label: 'Study Abroad (UK / Canada / Europe)',
      icon: GraduationCap,
      color: 'text-amber-400',
      message: 'Hello Horizon Move Limited, I would like to inquire about studying abroad in UK / Canada / Europe for upcoming intakes.'
    },
    {
      label: 'Work Permits (Serbia, Poland, Czech, Germany)',
      icon: Briefcase,
      color: 'text-blue-400',
      message: 'Hello Horizon Move, I am interested in legal European Work Permit opportunities (Serbia, Poland, Czech, etc.). Please share current requirements and available quotas.'
    },
    {
      label: 'Visit / Business Visa (China, Schengen, UK)',
      icon: Plane,
      color: 'text-emerald-400',
      message: 'Hello Horizon Move, I need urgent assistance with a Visit / Business Visa (China Canton Fair, Schengen, UK, Canada).'
    },
    {
      label: 'Direct Call / Priority Inquiry',
      icon: PhoneCall,
      color: 'text-rose-400',
      message: 'Hello, I would like to speak directly with a Senior Travel Counselor at Horizon Move Limited regarding an urgent case.'
    }
  ];

  const handleOptionClick = (msg: string) => {
    window.open(createWhatsAppUrl(msg), '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop for mobile dismiss */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        {/* Popover Menu */}
        {isOpen && (
          <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm max-h-[75vh] flex flex-col rounded-2xl bg-[#0f213d] border border-[#CFAE70]/40 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B365D] to-[#122543] p-3.5 sm:p-4 border-b border-[#CFAE70]/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-[#1B365D] rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-serif-luxury">Horizon Move WhatsApp</h4>
                  <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">Online • Fast Response (&lt;5 mins)</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                aria-label="Close WhatsApp options"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick options list */}
            <div className="p-3 space-y-2 bg-[#0e1c31]/90 overflow-y-auto overscroll-contain flex-1">
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium px-1.5 pt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span>Select inquiry category:</span>
              </p>

              {quickOptions.map((opt, idx) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt.message)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-[#CFAE70]/15 border border-white/10 hover:border-[#CFAE70]/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-[#CFAE70]/20 transition-colors shrink-0">
                        <Icon className={`w-4 h-4 ${opt.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-[#F3E5AB] line-clamp-1">
                        {opt.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#CFAE70] shrink-0" />
                  </button>
                );
              })}

              <div className="pt-2 border-t border-white/10 px-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span>Anthony Office, Lagos</span>
                <a href={`tel:${PRIMARY_PHONE}`} className="text-[#CFAE70] hover:underline font-semibold">
                  Call {PRIMARY_PHONE}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Main Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-3 sm:p-4 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/30 cursor-pointer"
          aria-label="Chat with Horizon Move on WhatsApp"
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />

          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          <span className="hidden md:inline font-bold text-sm tracking-wide pr-1">
            Chat on WhatsApp
          </span>

          {/* Unread badge indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#A61C1C] text-white text-[9px] sm:text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow">
            1
          </span>
        </button>
      </div>
    </>
  );
};
