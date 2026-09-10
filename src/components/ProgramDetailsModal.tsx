import React, { useState } from 'react';
import { X, GraduationCap, Download, CheckCircle2, ArrowRight, MessageCircle, FileText, Sparkles } from 'lucide-react';
import { StudyCountry } from '../types';
import { createWhatsAppUrl } from '../utils/whatsapp';
import { saveSubmission } from '../utils/submissions';

interface ProgramDetailsModalProps {
  country: StudyCountry | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  country,
  isOpen,
  onClose,
  onSuccessToast
}) => {
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [degreeLevel, setDegreeLevel] = useState('Master / Postgraduate');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [intake, setIntake] = useState(country?.intakes[0] || 'September 2026');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !country) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) return;

    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'program_inquiry',
      fullName: studentName,
      phone,
      email,
      service: `Study Abroad (${country.name})`,
      destination: country.name,
      summary: `${degreeLevel} in ${selectedCourse || 'General Program'} • Intake: ${intake} • ${country.name}`,
      details: {
        country: country.name,
        degreeLevel,
        selectedCourse: selectedCourse || 'General Recommendation',
        intake,
        source: 'Program Brochure Download Modal'
      },
      notes: `Requested brochure & fee breakdown for ${country.name} (${intake})`
    });

    const msg = `*ACADEMIC PROGRAM DETAILS REQUEST - HORIZON MOVE*
---------------------------------------
*Destination:* ${country.name} ${country.flag}
*Applicant Name:* ${studentName}
*Phone / WhatsApp:* ${phone}
*Email:* ${email}
*Degree Target:* ${degreeLevel}
*Preferred Course:* ${selectedCourse || 'General Recommendation'}
*Intake:* ${intake}
---------------------------------------
_Please send the official university brochure, fee breakdown, and CAS admission requirements._`;

    setSubmitted(true);
    onSuccessToast(`Program brochure request logged! Opening admissions counselor desk.`);
    
    setTimeout(() => {
      window.open(createWhatsAppUrl(msg), '_blank');
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
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#142847] to-[#0c182b] rounded-2xl sm:rounded-3xl border-2 border-[#CFAE70] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0e1d33] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#CFAE70]/25 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white font-serif-luxury leading-tight">
                {country.name} Study Programs & Prospectus
              </h3>
              <p className="text-[10px] sm:text-xs text-[#E4C88E]">
                Direct Admissions & CAS Guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-7 overflow-y-auto overscroll-contain flex-1">
          {submitted ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base sm:text-lg font-bold text-white">Brochure Dispatched!</h4>
              <p className="text-xs text-slate-300">
                Opening WhatsApp to connect you with our designated {country.name} Admissions Desk...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] sm:text-xs font-semibold text-[#E4C88E] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#CFAE70]" />
                  What you will receive:
                </span>
                <ul className="text-[11px] sm:text-xs text-slate-300 space-y-0.5">
                  <li>• Partner university list with tuition fees & scholarship options</li>
                  <li>• Step-by-step document checklist (SOP, Transcript & WAEC requirements)</li>
                  <li>• 1-on-1 counselor guidance on post-study work visa eligibility</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cynthia Nnamdi"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
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
                    placeholder="cynthia@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Target Degree Level
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-base sm:text-sm text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Master / Postgraduate">Master's / Postgraduate Degree</option>
                    <option value="Bachelor / Undergraduate">Bachelor's / Undergraduate Degree</option>
                    <option value="Post-Graduate Diploma (PGD)">Post-Graduate Diploma (PGD)</option>
                    <option value="PhD / Doctorate">PhD / Doctorate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Field / Program of Interest
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MSc Data Science / MBA"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-200 mb-1">
                    Intake Window
                  </label>
                  <select
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-base sm:text-sm text-white focus:outline-none cursor-pointer"
                  >
                    {country.intakes.map((itk, idx) => (
                      <option key={idx} value={itk}>{itk}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-1.5">
                <button
                  type="submit"
                  className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold py-3 sm:py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 text-[#1B365D]" />
                  <span>Request Full Prospectus on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
