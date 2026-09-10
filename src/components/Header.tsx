import React, { useState } from 'react';
import { PageType, Currency } from '../types';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Compass, 
  Menu, 
  X, 
  ChevronRight, 
  Calendar,
  Sparkles,
  MessageCircle,
  ExternalLink,
  User,
  Plane,
  BookOpen
} from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE, WHATSAPP_NUMBER, createWhatsAppUrl, FACEBOOK_URL, INSTAGRAM_URL, OFFICE_ADDRESS, RC_NUMBER, STUDY_ABROAD_PORTAL_URL } from '../utils/whatsapp';
import { getCurrentUser } from '../utils/auth';
import { UserProfile } from '../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenConsultation: () => void;
  onOpenLeadPopup: () => void;
  onOpenUserManual?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  currency,
  onCurrencyChange,
  onOpenConsultation,
  onOpenLeadPopup,
  onOpenUserManual
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());

  React.useEffect(() => {
    const onAuthChange = (e: any) => {
      setCurrentUser(e.detail || getCurrentUser());
    };
    window.addEventListener('horizon_auth_changed', onAuthChange);
    return () => window.removeEventListener('horizon_auth_changed', onAuthChange);
  }, []);

  const navLinks: { id: PageType; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'travel-bookings', label: 'Flights & Travel', badge: 'Popular' },
    { id: 'study-abroad', label: 'Study Abroad', badge: '2026/27 Intake' },
    { id: 'work-permit', label: 'Work Permit', badge: 'Hot Quotas' },
    { id: 'visa-services', label: 'Visa Services' },
    { id: 'about-us', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#0e1c31] text-[#E4C88E] border-b border-[#CFAE70]/20 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Contact Details & Address */}
          <div className="flex items-center gap-3 sm:gap-5 text-slate-300 min-w-0">
            <a 
              href={`tel:${PRIMARY_PHONE}`} 
              className="flex items-center gap-1.5 hover:text-[#CFAE70] transition-colors shrink-0 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#CFAE70]" />
              <span>{PRIMARY_PHONE}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
              <span className="truncate max-w-[220px] md:max-w-none">{OFFICE_ADDRESS}</span>
            </div>
            <span className="hidden xl:inline text-slate-600">|</span>
            <div className="hidden xl:flex items-center gap-3 text-slate-300">
              <a 
                href={FACEBOOK_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#CFAE70] transition-colors text-[11px] flex items-center gap-1"
                aria-label="Horizon Move Facebook"
              >
                <span>Facebook</span>
              </a>
              <span className="text-slate-600">•</span>
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#CFAE70] transition-colors text-[11px] flex items-center gap-1"
                aria-label="Horizon Move Instagram"
              >
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Intake Banner & Currency / WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href={STUDY_ABROAD_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#1B365D] bg-gradient-to-r from-[#F3E5AB] via-[#E4C88E] to-[#CFAE70] px-3 py-0.5 rounded-full shadow-sm hover:brightness-105 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#A61C1C]" />
              <span>Apply to Study Abroad (2026/27 Intake)</span>
              <ExternalLink className="w-3 h-3 text-[#1B365D]" />
            </a>

            {/* Currency selector */}
            <div className="flex items-center gap-1 bg-[#182a47] rounded-md px-1.5 sm:px-2 py-0.5 border border-[#CFAE70]/30">
              <Globe className="w-3 h-3 text-[#CFAE70]" />
              <select
                aria-label="Select Currency"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="bg-transparent text-[#E4C88E] text-[11px] sm:text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="NGN" className="bg-[#1B365D] text-white">NGN (₦)</option>
                <option value="USD" className="bg-[#1B365D] text-white">USD ($)</option>
                <option value="EUR" className="bg-[#1B365D] text-white">EUR (€)</option>
                <option value="GBP" className="bg-[#1B365D] text-white">GBP (£)</option>
              </select>
            </div>

            {/* Direct Flight Bookings Quick Header */}
            <button
              onClick={() => handleNavClick('travel-bookings')}
              className="flex items-center gap-1 text-[#F3E5AB] hover:text-white font-bold transition-colors cursor-pointer px-2 py-0.5 rounded border border-[#CFAE70]/60 bg-[#CFAE70]/20 hover:bg-[#CFAE70]/30 shadow-2xs"
              title="Search and book flights with live GDS inventory"
            >
              <Plane className="w-3 h-3 text-[#CFAE70]" />
              <span>Book Flights</span>
            </button>

            {/* Direct WhatsApp Quick Header */}
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I would like to make an inquiry regarding your services.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Client Portal Link */}
            <button
              onClick={() => handleNavClick('client-portal')}
              className="inline-flex items-center gap-1 text-[11px] text-[#F3E5AB] hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded border border-[#CFAE70]/40 hover:border-[#CFAE70] bg-[#CFAE70]/10"
              title="View my flight bookings and downloaded itineraries"
            >
              <User className="w-2.5 h-2.5 text-[#CFAE70]" />
              <span>{currentUser ? `Portal (${currentUser.fullName.split(' ')[0]})` : 'Client Portal'}</span>
            </button>

            {/* Website User Manual & Documentation Modal Trigger */}
            <button
              onClick={onOpenUserManual}
              className="inline-flex items-center gap-1 text-[11px] text-[#F3E5AB] hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded border border-[#CFAE70]/50 hover:border-[#CFAE70] bg-[#CFAE70]/15"
              title="Open Website User Manual & Documentation Guide"
            >
              <BookOpen className="w-2.5 h-2.5 text-[#CFAE70]" />
              <span>User Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <nav className="glass-navy border-b border-[#CFAE70]/25 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none min-w-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#1B365D] via-[#244675] to-[#0d1c33] border-2 border-[#CFAE70] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(#CFAE70_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-[#CFAE70] animate-spin-slow group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-cinzel text-base sm:text-xl font-bold tracking-wider text-white group-hover:text-[#CFAE70] transition-colors leading-tight truncate">
                  HORIZON MOVE
                </span>
                <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-[#CFAE70] font-sans truncate">
                  LIMITED • RC {RC_NUMBER}
                </span>
                <span className="text-[9px] text-slate-300 italic hidden md:block truncate">
                  Your Path to Global Opportunities
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                const isStudyAbroad = link.id === 'study-abroad';

                if (isStudyAbroad) {
                  return (
                    <div key={link.id} className="relative group">
                      <button
                        onClick={() => handleNavClick(link.id)}
                        className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'text-[#F3E5AB] bg-white/10 shadow-inner border-b-2 border-[#CFAE70]'
                            : 'text-slate-200 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#A61C1C] text-white animate-pulse">
                            {link.badge}
                          </span>
                        )}
                      </button>

                      {/* Dropdown Menu under Study Abroad 2026/27 Intake */}
                      <div className="absolute top-full left-0 pt-2 w-72 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                        <div className="bg-[#0f1f38] border border-[#CFAE70]/50 rounded-2xl p-3 shadow-2xl space-y-2 backdrop-blur-md text-left">
                          <div className="px-2 py-1 border-b border-slate-700/60">
                            <span className="text-[10px] font-bold text-[#E4C88E] uppercase tracking-wider block">2026/27 Academic Intake</span>
                            <span className="text-xs text-slate-300">September 2026 & January 2027 Admissions</span>
                          </div>

                          <a
                            href={STUDY_ABROAD_PORTAL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold text-xs shadow-md hover:brightness-105 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#1B365D]" />
                              <span>Apply to Study Abroad</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-[#1B365D]" />
                          </a>
                          <p className="text-[10px] text-slate-400 px-2 leading-relaxed">
                            Official student platform where applications for universities worldwide are processed.
                          </p>

                          <button
                            onClick={() => handleNavClick('study-abroad')}
                            className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <span>Explore Universities & Requirements</span>
                            <ChevronRight className="w-3 h-3 text-[#CFAE70]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-[#F3E5AB] bg-white/10 shadow-inner border-b-2 border-[#CFAE70]'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#A61C1C] text-white animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2.5">
              <button
                onClick={() => handleNavClick('client-portal')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  currentPage === 'client-portal'
                    ? 'bg-[#CFAE70] text-[#1B365D] border-[#F3E5AB]'
                    : currentUser
                    ? 'bg-[#142642] text-[#F3E5AB] border-[#CFAE70]/50 hover:bg-[#1e3962]'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                title="Client Account, Bookings & Itinerary Box"
              >
                <User className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span>{currentUser ? currentUser.fullName.split(' ')[0] : 'Sign In / Account'}</span>
              </button>

              <button
                onClick={onOpenConsultation}
                className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] hover:text-[#0f1c30] px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg hover:shadow-[#CFAE70]/30 transition-all duration-300 flex items-center gap-1.5 cursor-pointer border border-[#F3E5AB]/40 hover:scale-[1.02] active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#1B365D]" />
                <span>Book Consultation</span>
              </button>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                onClick={onOpenConsultation}
                className="sm:flex hidden items-center gap-1.5 bg-[#CFAE70] text-[#1B365D] px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none border border-[#CFAE70]/30"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#CFAE70]" /> : <Menu className="w-6 h-6 text-[#CFAE70]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#132644] border-b border-[#CFAE70]/30 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <React.Fragment key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg text-left transition-colors ${
                        isActive
                          ? 'text-[#F3E5AB] bg-white/15 border-l-4 border-[#CFAE70]'
                          : 'text-slate-200 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#A61C1C] text-white">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#CFAE70]" />
                    </button>

                    {link.id === 'study-abroad' && (
                      <div className="mx-2 mb-2 p-3 rounded-xl bg-[#0d1b30] border border-[#CFAE70]/50 shadow-inner space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-[#E4C88E]">2026/27 Intake Application</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#A61C1C] text-white">PORTAL</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          This is where we process your university applications:
                        </p>
                        <a
                          href={STUDY_ABROAD_PORTAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold text-xs shadow hover:brightness-105 transition-all"
                        >
                          <span>Apply to Study Abroad Now</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#CFAE70]/20 space-y-3">
              <button
                onClick={() => handleNavClick('client-portal')}
                className="w-full bg-[#1B365D] text-[#F3E5AB] border border-[#CFAE70]/50 py-2.5 rounded-lg text-xs font-bold shadow flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#CFAE70]" />
                <span>{currentUser ? `My Account (${currentUser.fullName})` : 'Client Portal & Flight Itineraries'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] py-3 rounded-lg text-sm font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#1B365D]" />
                <span>Book 1-on-1 Consultation</span>
              </button>

              <a
                href={createWhatsAppUrl('Hello Horizon Move Limited, I want to inquire about your Study Abroad and Work Permit services.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-sm font-bold shadow flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({PRIMARY_PHONE})</span>
              </a>

              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-[#E4C88E]">
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Facebook
                </a>
                <span className="text-slate-500">•</span>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
