import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PageType, Currency } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Plane, 
  Hotel, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award, 
  Users, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone,
  MessageCircle,
  FileCheck,
  Calendar,
  ExternalLink,
  Luggage,
  Ticket
} from 'lucide-react';
import { 
  TESTIMONIALS, 
  PARTNER_AIRLINES, 
  PARTNER_UNIVERSITIES, 
  RECENT_APPROVALS,
  STUDY_COUNTRIES,
  WORK_PERMIT_COUNTRIES
} from '../data/mockData';
import { createWhatsAppUrl, RC_NUMBER, STUDY_ABROAD_PORTAL_URL } from '../utils/whatsapp';
import { AirlineLogo } from '../components/AirlineLogo';
import { UniversityLogo } from '../components/UniversityLogo';
import { HomepageFlightEngine } from '../components/HomepageFlightEngine';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  currency: Currency;
  onOpenConsultation: () => void;
  onOpenEligibility: (type: 'work' | 'study') => void;
  onOpenLeadPopup: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  currency,
  onOpenConsultation,
  onOpenEligibility,
  onOpenLeadPopup,
  onSuccessToast
}) => {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [quickPathway, setQuickPathway] = useState<'study' | 'work' | 'visa' | 'travel'>('study');
  
  // Dynamic Live Recent Approvals rotation state
  const [approvalIdx, setApprovalIdx] = useState(0);
  const [isApprovalPaused, setIsApprovalPaused] = useState(false);
  const [approvalCategory, setApprovalCategory] = useState<'All' | 'Flight' | 'Study' | 'Work' | 'Visa'>('All');

  const filteredApprovals = approvalCategory === 'All'
    ? RECENT_APPROVALS
    : RECENT_APPROVALS.filter((a) => a.category === approvalCategory);

  // Automatically rotate approvals every 3.5 seconds
  useEffect(() => {
    if (isApprovalPaused || filteredApprovals.length === 0) return;
    const interval = setInterval(() => {
      setApprovalIdx((prev) => (prev + 1) % filteredApprovals.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isApprovalPaused, filteredApprovals.length]);

  const currentApproval = filteredApprovals[approvalIdx % (filteredApprovals.length || 1)] || RECENT_APPROVALS[0];

  const handleNextApproval = () => {
    setApprovalIdx((prev) => (prev + 1) % filteredApprovals.length);
  };

  const handlePrevApproval = () => {
    setApprovalIdx((prev) => (prev - 1 + filteredApprovals.length) % filteredApprovals.length);
  };

  const nextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const currentTestimonial = TESTIMONIALS[activeTestimonialIdx];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0d1b30] text-white pt-6 pb-14 sm:pt-10 sm:pb-20">
        {/* Rich Background with layered images and luxury dark navy & gold overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85"
            alt="International Travel & Global Opportunities"
            className="w-full h-full object-cover object-center opacity-25 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b30] via-[#0d1b30]/90 to-[#1B365D]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(#CFAE70_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-8">
          {/* Top Pill */}
          <div className="inline-flex max-w-[95%] sm:max-w-full items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 border border-[#CFAE70]/40 backdrop-blur-md text-[#F3E5AB] text-[10px] sm:text-xs font-semibold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
            <span className="truncate">NIGERIA'S TRUSTED FLIGHT TICKETING & IMMIGRATION CONSULTANCY • RC {RC_NUMBER}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          </div>

          {/* Main Headline */}
          <div className="space-y-2.5 sm:space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-serif-luxury leading-[1.15]">
              Your Path to <br />
              <span className="gold-gradient-text">Global Opportunities</span>
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-slate-200 font-light max-w-3xl mx-auto tracking-wide">
              Verified Flights, Global Work Permits & Study Admissions
            </p>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
              We empower ambitious Nigerians with instant verifiable airline tickets, accredited European work permits, university admissions with WAEC English waivers, and fast-track visas.
            </p>
          </div>

          {/* Primary CTA Buttons (Flights #1 Priority) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-1 max-w-md sm:max-w-none mx-auto w-full">
            <button
              onClick={() => {
                const el = document.getElementById('flight-booking-engine');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate('travel-bookings');
                }
              }}
              className="gold-shimmer-btn w-full sm:w-auto bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] hover:text-[#0a1525] font-extrabold px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-[#F3E5AB]/40"
            >
              <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B365D]" />
              <span>Book Flights (Live GDS)</span>
              <ArrowRight className="w-4 h-4 text-[#1B365D]" />
            </button>

            <button
              onClick={() => onNavigate('study-abroad')}
              className="w-full sm:w-auto bg-[#1B365D]/90 hover:bg-[#1B365D] text-white font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base shadow-xl border-2 border-[#CFAE70]/50 hover:border-[#CFAE70] backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFAE70]" />
              <span>Explore Programs</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base shadow-xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFAE70]" />
              <span>Book Consultation</span>
            </button>

            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I would like to book a flight / make an inquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span>WhatsApp Desk</span>
            </a>
          </div>

          {/* Dynamic Live Recent Approvals Ticker (Rotates constantly + Interactive) */}
          <div 
            className="pt-3 sm:pt-6 max-w-4xl mx-auto w-full"
            onMouseEnter={() => setIsApprovalPaused(true)}
            onMouseLeave={() => setIsApprovalPaused(false)}
          >
            <div className="glass-navy px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-[#CFAE70]/40 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
                {/* Left Tag & Category filter pills */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A61C1C] text-white font-bold uppercase tracking-wider text-[9px] sm:text-[10px] shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    LIVE APPROVALS
                  </span>
                  
                  {/* Category filter tabs */}
                  <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px]">
                    {(['All', 'Flight', 'Study', 'Work', 'Visa'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setApprovalCategory(cat);
                          setApprovalIdx(0);
                        }}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                          approvalCategory === cat 
                            ? 'bg-[#CFAE70] text-[#1B365D] font-bold shadow-xs' 
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Rotating Approval Item */}
                <div className="flex-1 min-w-0 overflow-hidden w-full text-center md:text-left py-0.5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentApproval.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-2 text-xs text-slate-200"
                    >
                      <span className="text-base leading-none" role="img" aria-label="country flag">
                        {currentApproval.flag}
                      </span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {currentApproval.name}
                      </span>
                      <span className="text-slate-400 text-[11px]">({currentApproval.origin})</span>
                      <span className="hidden sm:inline text-slate-500">•</span>
                      <span className="text-[#F3E5AB] font-medium truncate max-w-[260px] sm:max-w-none">
                        {currentApproval.type}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30 shrink-0">
                        {currentApproval.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 hidden lg:inline">
                        ({currentApproval.time})
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation arrows & count */}
                <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline mr-1">
                    {(approvalIdx % (filteredApprovals.length || 1)) + 1}/{filteredApprovals.length}
                  </span>
                  <button
                    type="button"
                    onClick={handlePrevApproval}
                    className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-slate-300"
                    aria-label="Previous Approval"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextApproval}
                    className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-slate-300"
                    aria-label="Next Approval"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="glass-white rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#CFAE70]/40 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center shrink-0 shadow-md">
              <Globe2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1B365D] font-serif-luxury">
                10+ Countries
              </h3>
              <p className="text-xs text-slate-600">UK, Canada, Europe, USA, Asia & Africa</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1B365D] font-serif-luxury">
                Fast Processing
              </h3>
              <p className="text-xs text-slate-600">Direct CAS, permits & expedited slots</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1B365D] font-serif-luxury">
                Full Support
              </h3>
              <p className="text-xs text-slate-600">SOP, document audit, mocks & ticketing</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1B365D] font-serif-luxury">
                98.4% Success Rate
              </h3>
              <p className="text-xs text-slate-600">Over 5,000+ happy Nigerian applicants</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 PROMINENT FLIGHT SEARCH & GDS TICKETING ENGINE (FLAGSHIP SERVICE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <HomepageFlightEngine
          currency={currency}
          onNavigate={onNavigate}
          onSuccessToast={onSuccessToast}
        />
      </section>

      {/* 3. INTERACTIVE PATHWAY EVALUATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1B365D] via-[#152a4a] to-[#0c182b] p-8 sm:p-12 text-white border-2 border-[#CFAE70]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFAE70]/20 text-[#E4C88E] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Find Your Best Route in 30 Seconds
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury leading-tight">
                Not sure which country or permit suits your profile best?
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                Take our quick eligibility assessment. Our algorithmic matching system evaluates your age, highest qualification, and budget to pinpoint the highest approval pathway.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onOpenEligibility('work')}
                  className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Check Work Permit Eligibility</span>
                </button>
                <button
                  onClick={() => onOpenEligibility('study')}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#CFAE70]" />
                  <span>Check Study Abroad Match</span>
                </button>
              </div>
            </div>

            {/* Quick Feature Stat Card */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-[#CFAE70]/30 space-y-4">
              <h3 className="text-base font-bold text-[#E4C88E] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Why Nigerians Choose Horizon Move:
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-[#CFAE70] font-bold">✓</span>
                  <span>100% Genuine, verifiable employer contracts & Ministry approvals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CFAE70] font-bold">✓</span>
                  <span>Direct university partnerships with WAEC/NECO English waiver</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CFAE70] font-bold">✓</span>
                  <span>Physical corporate consultation lounge at 4, Ayanbole Street, Anthony, Lagos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#CFAE70] font-bold">✓</span>
                  <span>Milestone-based service payments for complete peace of mind</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICE OVERVIEW CARDS (4 CARDS WITH IMAGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
            OUR CORE EXPERTISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B365D] font-serif-luxury">
            Comprehensive Education & Travel Solutions
          </h2>
          <p className="text-sm text-slate-600">
            From world-class degree admissions to legal European work authorizations and luxury vacations, explore our four flagship divisions.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1: Flights & Airline Ticketing (Flagship #1 Service) */}
          <div className="group rounded-2xl bg-white border-2 border-[#CFAE70] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative ring-1 ring-[#CFAE70]/40">
            <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#A61C1C] to-red-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md animate-pulse">
              Most Used Service
            </div>
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80"
                alt="International Flights & Airline Ticketing"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3 bg-[#1B365D] text-[#E4C88E] text-[11px] font-bold px-3 py-1 rounded-full border border-[#CFAE70]/40">
                Live GDS • Verifiable PNR
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                <Plane className="w-5 h-5 text-[#CFAE70]" />
                <span className="font-bold text-sm">Flights & Airline Ticketing</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] group-hover:text-[#A98745] transition-colors">
                  International & Domestic Flights
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct IATA GDS seat inventory across Qatar Airways, Emirates, British Airways, and Air Peace. Verifiable visa itineraries & student 46kg luggage quotas.
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant e-Ticket & PNR Confirmation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student extra 2x 23kg luggage quotas</span>
                </li>
              </ul>

              <button
                onClick={() => onNavigate('travel-bookings')}
                className="w-full gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] hover:text-[#0a1525] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-md"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Search & Book Flights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Study Abroad */}
          <div className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#CFAE70] transition-all duration-300 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=700&q=80"
                alt="Study Abroad Programs"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-[#1B365D] text-[#E4C88E] text-[11px] font-bold px-3 py-1 rounded-full border border-[#CFAE70]/40">
                UK • Canada • Europe • USA
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                <GraduationCap className="w-5 h-5 text-[#CFAE70]" />
                <span className="font-bold text-sm">Study Abroad</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] group-hover:text-[#A98745] transition-colors">
                  International Academic Programs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bachelor's, Master's, and PGD admissions with tuition discounts, WAEC English waivers, and Post-Study Work Visas (PGWP/Graduate Route).
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>September 2026 & Jan 2027 Intakes</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SOP & Visa Mock Interview prep</span>
                </li>
              </ul>

              <div className="space-y-2 mt-2">
                <a
                  href={STUDY_ABROAD_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] hover:brightness-105 text-[#1B365D] py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1B365D]" />
                  <span>Apply to Study Abroad (2026/27 Intake)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onNavigate('study-abroad')}
                  className="w-full bg-[#1B365D] hover:bg-[#12243f] text-[#F3E5AB] py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Universities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Work Abroad */}
          <div className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#CFAE70] transition-all duration-300 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80"
                alt="Work Abroad and Work Permits"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-[#A61C1C] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                Serbia • Poland • Czech • Germany
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                <Briefcase className="w-5 h-5 text-[#CFAE70]" />
                <span className="font-bold text-sm">Work Permits</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] group-hover:text-[#A98745] transition-colors">
                  International Work Opportunities
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Legal work permits for skilled & general workers in logistics, construction, healthcare, hospitality, and manufacturing with free housing.
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Earn €800 - €2,200 monthly in Euro</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1 to 2 Years Renewable TRC Permit</span>
                </li>
              </ul>

              <button
                onClick={() => onNavigate('work-permit')}
                className="w-full bg-[#1B365D] hover:bg-[#12243f] text-[#F3E5AB] py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>View Job Quotas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Visa Services */}
          <div className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#CFAE70] transition-all duration-300 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80"
                alt="Visa Services"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-[#1B365D] text-[#E4C88E] text-[11px] font-bold px-3 py-1 rounded-full border border-[#CFAE70]/40">
                China • Schengen • UK • UAE
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                <FileCheck className="w-5 h-5 text-[#CFAE70]" />
                <span className="font-bold text-sm">Visa Services</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] group-hover:text-[#A98745] transition-colors">
                  Visit & Business Visa Assistance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verified invitation letters, Canton Fair registration, Schengen appointment booking, and full financial dossier audits for high approval.
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fast-Track China Business Visas</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Schengen & UK Visitor Dossier Prep</span>
                </li>
              </ul>

              <button
                onClick={() => onNavigate('visa-services')}
                className="w-full bg-[#1B365D] hover:bg-[#12243f] text-[#F3E5AB] py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Apply for Visa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4.5 OFFICIAL AIRLINE PARTNERS & FLIGHT ADVANTAGES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0c182b] via-[#142642] to-[#0e1d35] p-6 sm:p-10 text-white border-2 border-[#CFAE70]/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#CFAE70]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFAE70]/20 text-[#E4C88E] text-xs font-bold uppercase tracking-wider">
                  <Plane className="w-3.5 h-3.5 text-[#CFAE70]" />
                  <span>OFFICIAL AIRLINE PARTNERS & FLIGHT DESK</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-luxury text-white">
                  Why Book Your Flights with Horizon Move Limited?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Direct connection with 500+ global airlines. Transparent fares, visa embassy itineraries, student extra luggage allowances, and seamless local payments.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    const el = document.getElementById('flight-booking-engine');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('travel-bookings');
                  }}
                  className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plane className="w-4 h-4 text-[#1B365D]" />
                  <span>Search Flights</span>
                </button>
                <a
                  href={createWhatsAppUrl('Hello Horizon Move Limited, I want to book a flight with student baggage / discounted fare.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Flight Desk</span>
                </a>
              </div>
            </div>

            {/* 4 Flight Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CFAE70]/50 transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#CFAE70]/20 text-[#E4C88E] flex items-center justify-center font-bold">
                  <Luggage className="w-5 h-5 text-[#CFAE70]" />
                </div>
                <h4 className="font-bold text-sm text-white font-serif-luxury">Student 46kg Luggage</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Guaranteed 2 x 23kg check-in bags for international students heading to UK, Canada, and Europe via Qatar Airways, Virgin & British Airways.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CFAE70]/50 transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-bold text-sm text-white font-serif-luxury">Visa Flight Itineraries</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Verifiable airline reservation codes (PNRs) valid for Embassy interviews without purchasing full non-refundable tickets upfront.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CFAE70]/50 transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                  <Plane className="w-5 h-5 text-[#CFAE70]" />
                </div>
                <h4 className="font-bold text-sm text-white font-serif-luxury">Official IATA GDS Fares</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct Amadeus & NDC airline inventory. Real-time availability, zero middlemen markup, and instant confirmed e-ticket dispatch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CFAE70]/50 transition-all space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5 text-[#CFAE70]" />
                </div>
                <h4 className="font-bold text-sm text-white font-serif-luxury">24/7 Flight Support Desk</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Physical office in Anthony, Lagos with dedicated ticketing agents on standby for date modifications, terminal transfers, and check-in assistance.
                </p>
              </div>
            </div>

            {/* Partner Airlines Strip */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Direct Ticketing Partner Airlines:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { name: 'Qatar Airways', id: 'qr', note: 'Doha Hub • Student Deals' },
                  { name: 'Emirates', id: 'ek', note: 'Dubai Hub • Luxury & Leisure' },
                  { name: 'British Airways', id: 'ba', note: 'London Direct • UK Entry' },
                  { name: 'Air Peace', id: 'p4', note: 'Flag Carrier • Gatwick & Regional' },
                  { name: 'Virgin Atlantic', id: 'vs', note: 'London & USA Connections' },
                ].map((airline) => (
                  <div
                    key={airline.id}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#CFAE70]/40 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AirlineLogo airlineId={airline.id} className="h-6" />
                      <span className="font-bold text-xs text-white truncate">{airline.name}</span>
                    </div>
                    <span className="text-[10px] text-[#E4C88E] font-medium">{airline.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE HORIZON MOVE LIMITED */}
      <section className="bg-navy-pattern py-16 sm:py-24 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E4C88E]">
              OUR DIFFERENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury">
              Why Hundreds of Nigerians Trust Horizon Move
            </h2>
            <p className="text-sm text-slate-300">
              We stand apart in Nigeria's consulting landscape with total transparency, accredited legal frameworks, and exceptional client advocacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-navy p-8 rounded-2xl border border-[#CFAE70]/30 space-y-4 hover:border-[#CFAE70] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#CFAE70]/20 text-[#CFAE70] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#F3E5AB] font-serif-luxury">
                100% Genuine & Verified Portals
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We do not deal in fake invitations or backchannel shortcuts. Every work contract is legally lodged with European Ministries of Labor, and university admissions come directly via official university partner channels.
              </p>
            </div>

            <div className="glass-navy p-8 rounded-2xl border border-[#CFAE70]/30 space-y-4 hover:border-[#CFAE70] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#CFAE70]/20 text-[#CFAE70] flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#F3E5AB] font-serif-luxury">
                Milestone-Based Transparent Fees
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Clear contract agreements with structured milestone payments. You only pay as each stage of your application is successfully unlocked, eliminating financial anxiety.
              </p>
            </div>

            <div className="glass-navy p-8 rounded-2xl border border-[#CFAE70]/30 space-y-4 hover:border-[#CFAE70] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#CFAE70]/20 text-[#CFAE70] flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#F3E5AB] font-serif-luxury">
                End-to-End Handholding
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                From drafting your Statement of Purpose (SOP) and CV tailoring to booking embassy biometrics, conducting mock consular interviews, and flight bookings, we walk with you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
              SUCCESS STORIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B365D] font-serif-luxury">
              Real Nigerians Living Their Global Dreams
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full border border-[#1B365D]/20 text-[#1B365D] hover:bg-[#1B365D] hover:text-white transition-colors cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full border border-[#1B365D]/20 text-[#1B365D] hover:bg-[#1B365D] hover:text-white transition-colors cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Testimonial Card */}
        <div className="glass-white rounded-3xl p-8 sm:p-12 border-2 border-[#CFAE70]/30 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
              <div className="relative">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#CFAE70] shadow-md"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                  Verified Visa
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1B365D] font-serif-luxury">
                  {currentTestimonial.name}
                </h3>
                <p className="text-xs text-slate-500">{currentTestimonial.role}</p>
                <p className="text-xs text-[#B8934C] font-semibold mt-1">
                  📍 {currentTestimonial.city}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-[#1B365D]/10 text-[#1B365D] text-xs font-bold">
                Category: {currentTestimonial.type} ({currentTestimonial.destination})
              </div>

              <blockquote className="text-base sm:text-lg text-slate-700 italic leading-relaxed">
                "{currentTestimonial.content}"
              </blockquote>

              <p className="text-xs text-slate-400 pt-2">
                Visa Approval Record: {currentTestimonial.visaApprovedDate} • Verified Client of Horizon Move Limited
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PARTNER UNIVERSITIES & AIRLINES TICKER */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
              OFFICIAL GLOBAL TICKETING & ADMISSION DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] font-serif-luxury">
              Our Global Accreditations & Airline Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We partner directly with world-class airlines to secure exclusive corporate airfares, flexible student baggage allowances, and guaranteed visa-verifiable reservations.
            </p>
          </div>

          {/* Actual Airline Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {PARTNER_AIRLINES.map((airline) => (
              <div
                key={airline.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#CFAE70] transition-all duration-300 flex flex-col items-center justify-center gap-2 group min-h-[90px]"
              >
                <AirlineLogo airlineId={airline.id} className="h-7" showText={false} />
                <div className="text-center">
                  <span className="font-bold text-xs text-[#1B365D] block leading-tight group-hover:text-[#A98745] transition-colors">
                    {airline.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    IATA: {airline.iata} • {airline.country}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Partner Universities Section with Actual Logos */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B365D] block">
                PARTNER UNIVERSITY CONSORTIUM (UK, CANADA, EUROPE, USA, AUSTRALIA)
              </span>
              <p className="text-xs text-slate-500">
                Official representation agreements guaranteeing fast-track Offer Letters, CAS/I-20 issuance, and scholarship considerations.
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
        </div>
      </section>

      {/* 8. URGENT INTAKE CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1B365D] via-[#224574] to-[#1B365D] p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl border-2 border-[#CFAE70]/40 overflow-hidden">
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-[#A61C1C] text-white text-xs font-bold uppercase tracking-wider animate-pulse">
              URGENT INTAKE ADMISSION NOTICE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury">
              Secure Your Admission & Work Quotas for 2026/2027
            </h2>
            <p className="text-sm text-slate-200">
              Slots for January 2027 UK/Canada intakes and European work permit quotas are filling rapidly. Schedule your 1-on-1 profile evaluation now.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={STUDY_ABROAD_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold px-8 py-4 rounded-xl text-sm sm:text-base shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5 text-[#1B365D]" />
              <span>Apply to Study Abroad (CourseFinder Portal)</span>
              <ExternalLink className="w-5 h-5 text-[#1B365D]" />
            </a>
            <button
              onClick={onOpenConsultation}
              className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-7 py-4 rounded-xl text-sm sm:text-base shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Priority Consultation</span>
            </button>
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I want to secure my admission/work permit quota for upcoming intakes.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-4 rounded-xl text-sm sm:text-base shadow-xl flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Chat Directly on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
