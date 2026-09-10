import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Video, CheckCircle2, MessageCircle, Clock, ShieldCheck, ArrowRight, Mail } from 'lucide-react';
import { formatConsultationWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp';
import { ConsultationFormData } from '../types';
import { saveSubmission } from '../utils/submissions';
import { getCurrentUser } from '../utils/auth';
import { sendInquiryConfirmationEmail } from '../utils/emailService';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
  initialService?: string;
  initialCountry?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
  initialService = 'Study Abroad Programs',
  initialCountry = ''
}) => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    email: '',
    phone: '',
    service: initialService,
    targetCountry: initialCountry,
    preferredDate: '',
    consultationType: 'Virtual (Zoom/WhatsApp)',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Pre-fill user profile if logged in
  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName: prev.fullName || user.fullName,
          email: prev.email || user.email,
          phone: prev.phone || user.phone
        }));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'consultation',
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      service: formData.service || 'General Consultation',
      destination: formData.destinationCountry || '',
      summary: `${formData.service} • ${formData.consultationType} on ${formData.date} (${formData.timeSlot})`,
      details: {
        date: formData.date,
        timeSlot: formData.timeSlot,
        consultationType: formData.consultationType,
        highestQualification: formData.highestQualification,
        waecEnglish: formData.waecEnglish,
        notes: formData.additionalNotes
      },
      notes: formData.additionalNotes || 'Booked via Consultation Modal'
    });

    // Send confirmation email to client if email was provided
    if (formData.email) {
      sendInquiryConfirmationEmail({
        to: formData.email,
        fullName: formData.fullName,
        service: formData.service || 'Private Consultation',
        summary: `${formData.consultationType || 'Virtual Session'} on ${formData.date || 'upcoming date'} (${formData.timeSlot || 'preferred slot'}).`
      }).catch(err => console.error('Error dispatching consultation confirmation email:', err));
    }

    const waMsg = formatConsultationWhatsAppMessage(formData);
    setSubmitted(true);
    onSuccessToast(
      formData.email
        ? `Consultation recorded! Confirmation emailed to ${formData.email}. Opening WhatsApp...`
        : 'Consultation appointment recorded! Opening WhatsApp to verify your time slot.'
    );

    setTimeout(() => {
      window.open(createWhatsAppUrl(waMsg), '_blank');
      onClose();
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#162c4e] to-[#0c182b] rounded-2xl sm:rounded-3xl border-2 border-[#CFAE70] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#0e1d33] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#CFAE70]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1B365D] border border-[#CFAE70] flex items-center justify-center text-[#CFAE70] shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-white font-serif-luxury leading-tight">
                Book a Private Consultation
              </h3>
              <p className="text-[10px] sm:text-xs text-[#E4C88E]">
                Horizon Move Limited • 4, Ayanbole Street, Anthony, Lagos | Virtual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-7 overflow-y-auto overscroll-contain flex-1">
          {submitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg sm:text-xl font-bold text-white">Appointment Scheduled!</h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Opening WhatsApp now to connect you with our scheduling desk and lock in your session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Meeting Type Radio Buttons */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#E4C88E]">
                  1. Select Meeting Location / Format *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Virtual (Zoom/WhatsApp)', label: 'Virtual Session (Zoom / Call)', icon: Video, desc: 'Anywhere in Nigeria & abroad' },
                    { id: 'In-Person (Anthony Office)', label: 'In-Person (Anthony Office, Lagos)', icon: MapPin, desc: '4, Ayanbole Street, Anthony, Lagos' },
                  ].map((item) => {
                    const isSelected = formData.consultationType === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData({ ...formData, consultationType: item.id as any })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#CFAE70]/20 border-[#CFAE70] shadow-md ring-1 ring-[#CFAE70]'
                            : 'bg-white/5 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#CFAE70]' : 'text-slate-400'}`} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {item.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victor Okafor"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="victor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Preferred Date & Time Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow at 2:00 PM"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Service of Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Service of Interest *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Study Abroad (UK, Canada, Europe, USA)">Study Abroad (UK, Canada, Europe, USA)</option>
                    <option value="European Work Permit (Serbia, Poland, Czech, Germany)">European Work Permit (Serbia, Poland, Czech, Germany)</option>
                    <option value="China Business & Canton Fair Visa">China Business & Canton Fair Visa</option>
                    <option value="Schengen / UK / USA Visitor Visa">Schengen / UK / USA Visitor Visa</option>
                    <option value="Flight Tickets & Hotel Bookings">Flight Tickets & Hotel Bookings</option>
                    <option value="Custom Holiday Package">Custom Holiday Package</option>
                    <option value="General Profile Evaluation">General Profile Evaluation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Destination Preference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. United Kingdom / Serbia / Canada"
                    value={formData.targetCountry}
                    onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                    className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                  Brief Summary of Background / Travel Goals
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. I have a BSc in Accounting. Looking for MSc in UK for Jan 2027 or European work permit."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#102038] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3.5 py-2 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-1 sm:pt-2">
                <button
                  type="submit"
                  className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] hover:brightness-110 text-[#1B365D] font-extrabold py-3 sm:py-3.5 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-[#1B365D]" />
                  <span>Confirm Booking via WhatsApp Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#CFAE70]" />
                  Confirmation within 15 mins
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  No Upfront Payment Required
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
