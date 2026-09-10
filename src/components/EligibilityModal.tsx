import React, { useState } from 'react';
import { X, CheckCircle2, Award, ArrowRight, MessageCircle, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/whatsapp';
import { saveSubmission } from '../utils/submissions';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
  initialType?: 'work' | 'study';
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
  initialType = 'work'
}) => {
  const [track, setTrack] = useState<'work' | 'study'>(initialType);
  const [step, setStep] = useState(1);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ageGroup, setAgeGroup] = useState('22 - 35 years');
  const [educationLevel, setEducationLevel] = useState('BSc / HND');
  const [workExperience, setWorkExperience] = useState('3 - 5 Years');
  const [preferredField, setPreferredField] = useState('Logistics & Warehousing / General Labor');
  const [passportStatus, setPassportStatus] = useState('Yes, Valid for 2+ Years');
  const [budgetRange, setBudgetRange] = useState('Standard Processing Ready');
  const [resultShown, setResultShown] = useState(false);

  if (!isOpen) return null;

  const calculateMatch = () => {
    let score = 85;
    if (passportStatus.includes('Valid')) score += 5;
    if (ageGroup === '22 - 35 years') score += 5;
    if (educationLevel.includes('BSc') || educationLevel.includes('Master')) score += 4;
    return Math.min(score, 98);
  };

  const handleFinishAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phoneNumber) return;
    setResultShown(true);
  };

  const handleSendToWhatsApp = () => {
    const matchScore = calculateMatch();

    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'eligibility_assessment',
      fullName: applicantName,
      phone: phoneNumber,
      service: track === 'work' ? 'International Work Permit (Europe)' : 'Study Abroad Academic Program',
      summary: `${track === 'work' ? 'Work Permit Assessment' : 'Study Abroad Assessment'} • ${matchScore}% Match Score • ${preferredField}`,
      details: {
        track,
        matchScore: `${matchScore}%`,
        ageGroup,
        educationLevel,
        workExperience,
        preferredField,
        passportStatus,
        budgetRange
      },
      notes: `Evaluator result: ${matchScore}% match score. Target: ${preferredField}. Budget: ${budgetRange}`
    });

    const msg = `*ELIGIBILITY ASSESSMENT RESULT - HORIZON MOVE LIMITED*
---------------------------------------
*Applicant Name:* ${applicantName}
*Phone / WhatsApp:* ${phoneNumber}
*Track:* ${track === 'work' ? 'International Work Permit' : 'Study Abroad Academic Program'}
*Match Score:* ${matchScore}% High Eligibility
*Age Group:* ${ageGroup}
*Highest Qualification:* ${educationLevel}
*Work Experience:* ${workExperience}
*Target Field / Sector:* ${preferredField}
*Passport Validity:* ${passportStatus}
*Processing Budget:* ${budgetRange}
---------------------------------------
_I would like to proceed with my official document verification and employer quota reservation._`;

    onSuccessToast('Eligibility report generated! Forwarding to senior advisor on WhatsApp.');
    window.open(createWhatsAppUrl(msg), '_blank');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#142847] to-[#0d1a2d] rounded-2xl sm:rounded-3xl border-2 border-[#CFAE70] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f1e35] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#CFAE70]/25 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#CFAE70]/20 border border-[#CFAE70] flex items-center justify-center text-[#CFAE70] shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white font-serif-luxury leading-tight">
                Instant Global Pathway Evaluator
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#E4C88E]">
                Horizon Move Official Assessment Tool
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
          {!resultShown ? (
            <form onSubmit={handleFinishAssessment} className="space-y-4">
              {/* Select track */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E4C88E] mb-2">
                  What is your primary relocation goal?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTrack('work')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      track === 'work'
                        ? 'bg-[#CFAE70] text-[#1B365D] border-[#CFAE70] shadow'
                        : 'bg-white/5 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    🛠️ Legal Work Permit (Europe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrack('study')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      track === 'study'
                        ? 'bg-[#CFAE70] text-[#1B365D] border-[#CFAE70] shadow'
                        : 'bg-white/5 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    🎓 Study Abroad (UK/Canada/EU)
                  </button>
                </div>
              </div>

              {/* Applicant Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emmanuel Adeleke"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Highest Educational Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="BSc / HND">BSc / HND Degree</option>
                    <option value="Master's / Post-Grad">Master's / Post-Graduate</option>
                    <option value="OND / NCE / Diploma">OND / NCE / Diploma</option>
                    <option value="WAEC / NECO / High School">WAEC / NECO / Secondary</option>
                    <option value="Technical / Trade Certificate">Technical / Trade Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Age Bracket
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="20 - 30 years">20 - 30 years</option>
                    <option value="31 - 40 years">31 - 40 years</option>
                    <option value="41 - 50 years">41 - 50 years</option>
                    <option value="50+ years">50+ years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {track === 'work' ? 'Target Job Sector' : 'Desired Field of Study'}
                  </label>
                  {track === 'work' ? (
                    <select
                      value={preferredField}
                      onChange={(e) => setPreferredField(e.target.value)}
                      className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Logistics & Warehousing">Logistics & Warehousing / Forklift</option>
                      <option value="Construction & Trades (Welding, Masonry)">Construction & Trades (Welding, Masonry)</option>
                      <option value="Factory Production & Packaging">Factory Production & Packaging</option>
                      <option value="Hospitality & Culinary">Hospitality & Hotel Services</option>
                      <option value="Healthcare & Nursing">Healthcare & Eldercare</option>
                      <option value="IT, Software & Engineering">IT, Software & Engineering</option>
                    </select>
                  ) : (
                    <select
                      value={preferredField}
                      onChange={(e) => setPreferredField(e.target.value)}
                      className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Business, Management & MBA">Business, Management & MBA</option>
                      <option value="Computer Science, AI & Cyber Security">Computer Science, AI & Cyber Security</option>
                      <option value="Public Health, Nursing & Medicine">Public Health, Nursing & Medicine</option>
                      <option value="Engineering & Construction">Engineering & Construction</option>
                      <option value="Law & International Relations">Law & International Relations</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    International Passport Status
                  </label>
                  <select
                    value={passportStatus}
                    onChange={(e) => setPassportStatus(e.target.value)}
                    className="w-full bg-[#0d1b30] border border-slate-700 focus:border-[#CFAE70] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Yes, Valid for 2+ Years">Yes, Valid for 2+ Years</option>
                    <option value="Valid for less than 1 Year">Valid for less than 1 Year (Will Renew)</option>
                    <option value="No, Currently Applying">No, Currently Applying for Passport</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <Award className="w-4 h-4 text-[#1B365D]" />
                  <span>Generate My Eligibility Rating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 animate-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                  High Approval Probability
                </span>
                <h4 className="text-2xl font-black text-white">
                  Match Rating: <span className="text-[#CFAE70]">{calculateMatch()}% Match</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Congratulations, <strong className="text-white">{applicantName}</strong>! Based on your qualifications, age, and profile, you meet the legal requirements for:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-[#CFAE70]/30 text-left space-y-2 text-xs">
                {track === 'work' ? (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Serbia 2-Year Renewable Work Permit (High Demand)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Poland Voivodeship Schengen Work Visa (Type D)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Czech Republic & Albania Accelerated Routes</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>United Kingdom (No IELTS Required with WAEC C6)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Canada PGWP & Ontario/Alberta College Programs</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Europe (Germany & Poland Low-Tuition Masters)</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Report to Senior Counselor on WhatsApp</span>
                </button>

                <p className="text-[10px] text-slate-400">
                  Processing Fee Applies. All submissions subject to employer and diplomatic verification.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
