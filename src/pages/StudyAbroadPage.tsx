import React, { useState } from 'react';
import { Currency, StudyCountry } from '../types';
import { STUDY_COUNTRIES, PARTNER_UNIVERSITIES } from '../data/mockData';
import { UniversityLogo } from '../components/UniversityLogo';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Plane, 
  Building2, 
  Sparkles, 
  Download, 
  Clock, 
  DollarSign, 
  MessageCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { createWhatsAppUrl, STUDY_ABROAD_PORTAL_URL } from '../utils/whatsapp';

interface StudyAbroadPageProps {
  currency: Currency;
  onRequestDetails: (country: StudyCountry) => void;
  onOpenConsultation: () => void;
  onOpenEligibility: (type: 'study') => void;
}

export const StudyAbroadPage: React.FC<StudyAbroadPageProps> = ({
  currency,
  onRequestDetails,
  onOpenConsultation,
  onOpenEligibility
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'uk' | 'canada' | 'europe' | 'australia' | 'usa'>('all');

  const filteredCountries = selectedFilter === 'all' 
    ? STUDY_COUNTRIES 
    : STUDY_COUNTRIES.filter(c => c.id === selectedFilter);

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0d1c33] text-white py-12 sm:py-24 rounded-2xl sm:rounded-3xl mx-2 sm:mx-8 px-4 sm:px-12 border-2 border-[#CFAE70]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
            alt="International University Campus"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1c33] via-[#0d1c33]/90 to-[#1B365D]/75" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#F3E5AB] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
            <span className="truncate">Study Abroad 2026/27 Intake Open</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold font-serif-luxury tracking-tight leading-tight">
            International Academic Programs
          </h1>

          <p className="text-base sm:text-2xl text-[#E4C88E] font-medium font-serif-luxury">
            Bachelor and Master Degree Opportunities Worldwide
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Gain globally recognized credentials from prestigious universities in the United Kingdom, Canada, Europe, Australia, and the USA. Enjoy Post-Study Work Visas, WAEC English exemptions, and guaranteed CAS/I-20 issuance support.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <a
              href={STUDY_ABROAD_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-4 h-4 text-[#1B365D]" />
              <span>Apply to Study Abroad (2026/27 Portal)</span>
              <ExternalLink className="w-4 h-4 text-[#1B365D]" />
            </a>

            <button
              onClick={onOpenConsultation}
              className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Admissions Counseling</span>
            </button>

            <button
              onClick={() => onOpenEligibility('study')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 font-medium px-5 py-3.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Check Eligibility</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2026/27 INTAKE OFFICIAL APPLICATION PORTAL CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-12 relative z-20">
        <div className="bg-gradient-to-r from-[#1B365D] via-[#162a48] to-[#0e1c31] border-2 border-[#CFAE70] rounded-2xl p-6 sm:p-8 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A61C1C] text-white text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Study Abroad 2026/27 Intake • Official Application Desk</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
              Apply to Study Abroad for 2026/27 Intake
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              This is where we process all student applications: select your target degree, submit academic transcripts & WAEC results, and track your university offers via our accredited CourseFinder student platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={STUDY_ABROAD_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer-btn w-full sm:w-auto bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <span>Apply to Study Abroad Now</span>
              <ExternalLink className="w-4 h-4 text-[#1B365D]" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. COUNTRY FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#1B365D] text-[#F3E5AB] shadow-lg border border-[#CFAE70]'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
            }`}
          >
            🌍 All Study Destinations ({STUDY_COUNTRIES.length})
          </button>
          {STUDY_COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedFilter(c.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === c.id
                  ? 'bg-[#1B365D] text-[#F3E5AB] shadow-lg border border-[#CFAE70]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* 3. COUNTRY GRID WITH RICH CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredCountries.map((country) => (
            <div
              key={country.id}
              className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#CFAE70] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Flag Header */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={country.heroImage}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c182a] via-black/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1B365D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#CFAE70]/40 text-white shadow-lg">
                    <span className="text-xl">{country.flag}</span>
                    <span className="font-bold text-xs uppercase tracking-wider">{country.name}</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-700/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                    ⏱️ Processing: {country.processingTime}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg sm:text-xl font-bold font-serif-luxury leading-tight">
                      {country.headline}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Quick Highlight Metrics */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Average Tuition:</span>
                      <strong className="text-[#1B365D] font-bold">
                        {country.averageTuition[currency]}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Post-Study Work:</span>
                      <strong className="text-emerald-700 font-bold">
                        {country.postStudyWork}
                      </strong>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200">
                      <span className="text-slate-400 font-medium block">Work While Studying:</span>
                      <span className="text-slate-700 font-semibold">{country.workWhileStudying}</span>
                    </div>
                  </div>

                  {/* Popular Programs */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#B8934C]" />
                      <span>Popular Academic Programs:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {country.popularPrograms.map((prog, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <span className="text-[#CFAE70] font-black">•</span>
                          <span>{prog}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#B8934C]" />
                      <span>Key Strategic Benefits for Nigerians:</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {country.keyBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Intake Windows & Universities */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B8934C]" />
                      <span><strong>Intakes:</strong> {country.intakes.join(' | ')}</span>
                    </div>
                    <a
                      href={STUDY_ABROAD_PORTAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#1B365D] hover:text-[#A98745] text-xs transition-colors underline underline-offset-2"
                    >
                      <span>Apply for 2026/27 Intake</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onRequestDetails(country)}
                  className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Request Program Details</span>
                </button>

                <a
                  href={createWhatsAppUrl(`Hello Horizon Move Admissions Desk, I want to inquire about studying in ${country.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Admissions WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY STUDY ABROAD WITH US - 3 CORE PILLARS */}
      <section className="bg-navy-pattern py-16 sm:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E4C88E]">
              THE HORIZON ADMISSIONS ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury">
              Why Study Abroad With Us
            </h2>
            <p className="text-sm text-slate-300">
              We eliminate admission delays, visa refusals, and bureaucratic roadblocks with our comprehensive 3-pillar support system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="glass-navy p-8 rounded-3xl border border-[#CFAE70]/30 space-y-4 hover:border-[#CFAE70] transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#CFAE70]/20 text-[#CFAE70] flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#E4C88E] uppercase tracking-wider">Pillar 1</span>
                  <h3 className="text-xl font-bold text-white font-serif-luxury">
                    University Placement
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Direct official agreements with world-ranked institutions across UK, Canada, Poland, Germany, and USA. We secure your direct offer letters, tuition deposit waivers, and generous merit-based scholarships up to £5,000 / $8,000.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WAEC/NECO English waiver processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unconditional Offer within 5-14 days</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="glass-navy p-8 rounded-3xl border border-[#CFAE70]/30 space-y-4 hover:border-[#CFAE70] transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#CFAE70]/20 text-[#CFAE70] flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#E4C88E] uppercase tracking-wider">Pillar 2</span>
                  <h3 className="text-xl font-bold text-white font-serif-luxury">
                    Documentation Support
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our professional academic writers craft flawless Statements of Purpose (SOP), academic CVs, and reference letters. We meticulously review bank statements to ensure 100% compliance with strict embassy Proof of Funds (POF) guidelines.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customized, plagiarism-free SOP crafting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Proof of Funds & TB test guidance</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="glass-navy p-8 rounded-3xl border border-[#CFAE70]/30 space-y-4 hover:border-[#CFAE70] transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#CFAE70]/20 text-[#CFAE70] flex items-center justify-center">
                  <Plane className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#E4C88E] uppercase tracking-wider">Pillar 3</span>
                  <h3 className="text-xl font-bold text-white font-serif-luxury">
                    Pre-Departure Guidance
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We don’t stop at visa stamping. We conduct realistic mock visa interviews with former consular officers, assist with student flight discounts, arrange university airport pick-ups, and help secure campus accommodation before departure.
                </p>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1-on-1 Visa Mock Interview prep</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student baggage allowance flight booking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STEP-BY-STEP ADMISSION ROADMAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
            STREAMLINED WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B365D] font-serif-luxury">
            Your 4-Step Academic Pathway
          </h2>
          <p className="text-sm text-slate-600">
            How we guide you from your initial profile audit to your first day in class abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Profile Audit & Course Matching',
              desc: 'Our counselor analyzes your WAEC/Degree transcripts and career goals to select top partner institutions.'
            },
            {
              step: '02',
              title: 'Application & Offer Letter',
              desc: 'We draft your SOP, assemble academic dossier, and secure conditional/unconditional admission offers.'
            },
            {
              step: '03',
              title: 'Tuition Deposit & CAS/I-20',
              desc: 'Guidance on CBN Form A / tuition transfers, and securing official CAS or I-20 certificate.'
            },
            {
              step: '04',
              title: 'Visa Stamping & Departure',
              desc: 'Biometrics scheduling, mock interview prep, visa approval, student flight tickets, and airport reception.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md relative space-y-3">
              <span className="text-3xl font-black font-serif-luxury text-[#CFAE70]">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-[#1B365D]">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PARTNER UNIVERSITY CONSORTIUM WITH LOGOS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
              OFFICIAL ACADEMIC REPRESENTATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] font-serif-luxury">
              Global University Consortium & Partner Campuses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct application routing with zero agent markups, tuition deposit waivers, and expedited CAS/I-20 turnaround.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {PARTNER_UNIVERSITIES.map((uni) => (
              <div
                key={uni.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#CFAE70] transition-all duration-300 flex flex-col items-center justify-between gap-2 group min-h-[110px]"
              >
                <UniversityLogo universityId={uni.id} className="h-7" showText={false} />
                <div className="text-center w-full">
                  <span className="font-bold text-xs text-[#1B365D] block leading-tight group-hover:text-[#A98745] transition-colors truncate" title={uni.name}>
                    {uni.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {uni.flag} {uni.country}
                  </span>
                  {uni.ranking && (
                    <span className="inline-block mt-1 text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 truncate max-w-full">
                      {uni.ranking}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="glass-navy p-8 sm:p-12 rounded-3xl border-2 border-[#CFAE70]/40 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif-luxury">
              Ready to Secure Your September 2026 / January 2027 Admission?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak with our senior academic counselors at our Anthony, Lagos office or via virtual session today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={STUDY_ABROAD_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-[#1B365D]" />
              <span>Apply to Study Abroad (CourseFinder Portal)</span>
              <ExternalLink className="w-4 h-4 text-[#1B365D]" />
            </a>
            <button
              onClick={onOpenConsultation}
              className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-md transition-colors cursor-pointer"
            >
              Book 1-on-1 Academic Session
            </button>
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I want to apply for study abroad admission immediately.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Admissions WhatsApp Hotline</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
