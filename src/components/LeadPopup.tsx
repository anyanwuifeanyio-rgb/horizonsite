import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, MessageCircle, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { formatLeadPopupWhatsApp, createWhatsAppUrl } from '../utils/whatsapp';
import { saveSubmission } from '../utils/submissions';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const LeadPopup: React.FC<LeadPopupProps> = ({ isOpen, onClose, onSuccessToast }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Study Abroad (UK/Canada/EU)');
  const [intake, setIntake] = useState('January 2027 Intake');
  const [submitted, setSubmitted] = useState(false);

  // Time remaining simulation for urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'free_evaluation',
      fullName,
      phone,
      email,
      service: interest,
      summary: `${interest} • Intake: ${intake} • Urgent Evaluation Offer`,
      details: {
        interest,
        intake,
        source: 'Free Consultation Lead Popup Banner'
      },
      notes: `Requested assessment for ${intake}`
    });

    const waMsg = formatLeadPopupWhatsApp({
      fullName,
      phone,
      email,
      interest,
      intake,
    });

    setSubmitted(true);
    onSuccessToast('Your Free Consultation request has been dispatched! Opening WhatsApp for instant agent assignment.');

    setTimeout(() => {
      window.open(createWhatsAppUrl(waMsg), '_blank');
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-gradient-to-b from-[#152a4a] to-[#0d1c33] rounded-2xl sm:rounded-3xl border-2 border-[#CFAE70] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Ribbon */}
        <div className="bg-gradient-to-r from-[#A61C1C] via-[#CFAE70] to-[#A61C1C] text-[#1B365D] py-1 px-3 sm:px-4 text-center text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 shrink-0">
          <Sparkles className="w-3 h-3 fill-[#1B365D]" />
          <span>Priority Intake Window Open</span>
          <Sparkles className="w-3 h-3 fill-[#1B365D]" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-300 hover:text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="p-4 sm:p-7 overflow-y-auto overscroll-contain flex-1">
          {/* Header */}
          <div className="text-center space-y-1.5 mb-4 sm:mb-6 pr-6 sm:pr-0">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#F3E5AB] text-[10px] sm:text-xs font-semibold">
              <Calendar className="w-3 h-3 text-[#CFAE70]" />
              <span>Horizon Move Limited Special Intake</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif-luxury leading-tight">
              Get Free Assessment for <br />
              <span className="gold-gradient-text">Study & Work Permits</span>
            </h3>
            
            <p className="text-[11px] sm:text-xs text-slate-300">
              Claim your Free Credential Audit & Eligibility Match (Worth ₦50,000).
            </p>

            {/* Countdown timer */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-medium">Free slots expiring in:</span>
              <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-[#CFAE70]/30">
                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Application Received!</h4>
              <p className="text-xs text-slate-300">
                Redirecting to WhatsApp to connect you immediately with your assigned Senior Admissions & Permit Advisor...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Adeleke"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="samuel@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Service Interested In
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2.5 text-base sm:text-sm text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Study Abroad (UK/Canada/EU)">Study Abroad (UK/Canada/EU)</option>
                    <option value="Work Permit (Serbia/Poland/Czech)">Work Permit (Serbia/Poland/Czech)</option>
                    <option value="China Canton Fair / Business Visa">China Canton Fair / Business Visa</option>
                    <option value="Schengen / UK / USA Visit Visa">Schengen / UK / USA Visit Visa</option>
                    <option value="Flight & Hotel Booking">Flight & Hotel Booking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                  Target Intake / Travel Month
                </label>
                <select
                  value={intake}
                  onChange={(e) => setIntake(e.target.value)}
                  className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2.5 text-base sm:text-sm text-white focus:outline-none cursor-pointer"
                >
                  <option value="January 2027 Intake">January 2027 Academic Intake</option>
                  <option value="September 2026 Intake">September 2026 Academic Intake</option>
                  <option value="Immediate European Work Permit (2026/2027)">Immediate European Work Permit (2026/2027)</option>
                  <option value="Upcoming Canton Fair / Business Trip">Upcoming Canton Fair / Business Trip</option>
                  <option value="Holiday Vacation">Holiday Vacation</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] hover:brightness-110 text-[#1B365D] font-extrabold py-3 sm:py-3.5 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-[#1B365D]" />
                  <span>Claim Free Evaluation on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  100% Confidential
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  No Hidden Charges
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  RC 9795462
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
