import React, { useState } from 'react';
import { Currency, WorkPermitCountry } from '../types';
import { WORK_PERMIT_COUNTRIES } from '../data/mockData';
import { 
  Briefcase, 
  ShieldAlert, 
  Clock, 
  Euro, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck, 
  Building, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  MessageCircle, 
  Calendar, 
  FileText,
  Award
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface WorkPermitPageProps {
  currency: Currency;
  onOpenConsultation: () => void;
  onOpenEligibility: (type: 'work') => void;
}

export const WorkPermitPage: React.FC<WorkPermitPageProps> = ({
  currency,
  onOpenConsultation,
  onOpenEligibility
}) => {
  const [selectedCountry, setSelectedCountry] = useState<'all' | string>('all');

  const filteredCountries = selectedCountry === 'all'
    ? WORK_PERMIT_COUNTRIES
    : WORK_PERMIT_COUNTRIES.filter(c => c.id === selectedCountry);

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0c182b] text-white py-12 sm:py-24 rounded-2xl sm:rounded-3xl mx-2 sm:mx-8 px-4 sm:px-12 border-2 border-[#CFAE70]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80"
            alt="International Careers & Construction"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c182b] via-[#0c182b]/90 to-[#1B365D]/80" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#A61C1C]/30 border border-[#A61C1C]/60 text-[#F3E5AB] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
            <span className="truncate">2026/2027 Verified Work Quotas</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold font-serif-luxury tracking-tight leading-tight">
            International Work Opportunities
          </h1>

          <p className="text-base sm:text-2xl text-[#E4C88E] font-medium font-serif-luxury">
            Legal Work Permit Support for Skilled and General Workers
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Relocate legally to Europe with authenticated work contracts, ministry work permits, and temporary residence authorizations (TRC) across Serbia, Poland, Czech Republic, Germany, Albania, and Croatia.
          </p>

          {/* Prominent Legal Disclaimer Banner */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#A61C1C]/20 border border-[#A61C1C]/40 backdrop-blur-md flex items-start gap-2.5 sm:gap-3 max-w-2xl">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4C88E] shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
              <strong className="text-[#E4C88E]">IMPORTANT NOTICE:</strong> Processing Fee Applies. Subject to Employer and Embassy Approval. Horizon Move Limited strictly operates through licensed overseas employers and accredited diplomatic procedures.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onOpenEligibility('work')}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Check Work Permit Eligibility</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#CFAE70]" />
              <span>Book Profile Audit</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. COUNTRY SELECTOR TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCountry === 'all'
                ? 'bg-[#1B365D] text-[#F3E5AB] shadow-lg border border-[#CFAE70]'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
            }`}
          >
            🇪🇺 All European Countries ({WORK_PERMIT_COUNTRIES.length})
          </button>
          {WORK_PERMIT_COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCountry(c.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCountry === c.id
                  ? 'bg-[#1B365D] text-[#F3E5AB] shadow-lg border border-[#CFAE70]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* 3. COUNTRY WORK PERMIT CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredCountries.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#CFAE70] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c182a] via-black/40 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1B365D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#CFAE70]/40 text-white shadow-lg">
                    <span className="text-xl">{item.flag}</span>
                    <span className="font-bold text-xs uppercase tracking-wider">{item.name}</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-[#A61C1C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                    ⏱️ {item.processingTime}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs text-[#E4C88E] font-semibold uppercase tracking-wider block">
                      {item.visaType}
                    </span>
                    <h3 className="text-xl font-bold font-serif-luxury">
                      {item.name} Legal Work Authorization
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Salary & Contract Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Monthly Earning (EUR):</span>
                      <strong className="text-emerald-700 font-extrabold text-sm block">
                        {item.salaryRange.EUR}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Equivalent in NGN:</span>
                      <strong className="text-[#1B365D] font-bold text-xs block">
                        {item.salaryRange.NGN}
                      </strong>
                    </div>
                    <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                      <span className="text-slate-400 font-medium block">Contract Duration:</span>
                      <span className="text-slate-800 font-semibold">{item.contractDuration}</span>
                    </div>
                  </div>

                  {/* Job Sectors */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#B8934C]" />
                      <span>Available In-Demand Job Sectors:</span>
                    </h4>
                    <div className="space-y-1.5">
                      {item.jobSectors.map((sector, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{sector}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D] flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-[#B8934C]" />
                      <span>Requirements Overview:</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {item.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#B8934C] font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs text-amber-950">
                    <span className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8934C]" />
                      Employer Benefits & Perks:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {item.highlights.map((hl, idx) => (
                        <li key={idx}>✓ {hl}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onOpenEligibility('work')}
                  className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Check Eligibility</span>
                </button>

                <a
                  href={createWhatsAppUrl(`Hello Horizon Move Limited, I want to apply for the ${item.name} Work Permit quota.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Quota Desk WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STEP-BY-STEP WORK PERMIT PROCESSING WORKFLOW */}
      <section className="bg-navy-pattern py-16 sm:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E4C88E]">
              TRANSPARENT 5-STAGE PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury">
              How Your Work Permit Is Processed
            </h2>
            <p className="text-sm text-slate-300">
              Zero ambiguity. Track every milestone from employer contract issuance to embassy visa stamping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: 'Stage 1',
                title: 'Dossier Audit & Europass CV',
                desc: 'We review your passport, format your CV to European labor standards, and apostille police character clearance.'
              },
              {
                step: 'Stage 2',
                title: 'Employer Job Offer & Quota',
                desc: 'Placement with certified European employer and execution of authenticated employment agreement.'
              },
              {
                step: 'Stage 3',
                title: 'Ministry Work Permit Issuance',
                desc: 'Employer lodges application with the Ministry of Labor/Interior. Work permit certificate issued in your name.'
              },
              {
                step: 'Stage 4',
                title: 'Embassy Biometrics & Stamping',
                desc: 'We secure embassy appointment, compile certified dossier, and guide you through consular biometrics.'
              },
              {
                step: 'Stage 5',
                title: 'Flight & Employer Reception',
                desc: 'Flight ticketing, pre-departure briefing, and employer shuttle reception at European airport.'
              }
            ].map((st, idx) => (
              <div key={idx} className="glass-navy p-6 rounded-2xl border border-[#CFAE70]/30 space-y-3 relative">
                <span className="px-2.5 py-1 rounded-full bg-[#CFAE70]/20 text-[#E4C88E] text-[10px] font-bold uppercase tracking-wider">
                  {st.step}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. APPLICANT DOCUMENT CHECKLIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] font-serif-luxury">
            Standard Document Checklist for Work Applicants
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Have these documents ready or let our team assist in procuring/legalizing them for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-[#1B365D]">1. Valid International Passport</h3>
            <p className="text-xs text-slate-600">Must have at least 2 full years validity remaining before expiry with 4 blank pages.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-[#1B365D]">2. Police Character Clearance</h3>
            <p className="text-xs text-slate-600">Issued by Nigeria Police Force (CID Alagbon/Abuja), authenticated and apostilled by MOFA.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-[#1B365D]">3. Passport Photographs</h3>
            <p className="text-xs text-slate-600">Recent white background biometric photos (35x45mm) matching Schengen/EU specifications.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-[#1B365D]">4. Updated Curriculum Vitae</h3>
            <p className="text-xs text-slate-600">Detailed work history. Horizon Move formats this into compliant Europass layout.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-[#1B365D]">5. Educational / Trade Proof</h3>
            <p className="text-xs text-slate-600">WAEC/Degree/Trade certificates (Welding, Forklift, Masonry, Nursing, Driver’s license if applicable).</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-[#1B365D]">6. Medical Fitness Certificate</h3>
            <p className="text-xs text-slate-600">Standard medical test confirming fitness for overseas physical employment.</p>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="glass-navy p-8 sm:p-12 rounded-3xl border-2 border-[#CFAE70]/40 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif-luxury">
              Start Your European Career Transition Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Limited employer slots open for Serbia, Poland, and Czech Republic. Meet our immigration counselors at our Anthony, Lagos office or via virtual session.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenEligibility('work')}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl cursor-pointer"
            >
              Take Free Eligibility Quiz
            </button>
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I want to speak with a work permit counselor regarding current European job quotas.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Work Permits WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
