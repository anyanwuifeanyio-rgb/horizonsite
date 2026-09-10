import React, { useState } from 'react';
import { PageType } from '../types';
import { 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Globe,
  Lock,
  User,
  BookOpen
} from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE, EMAIL_ADDRESS, ADMISSIONS_EMAIL, WEBSITE_DOMAIN, createWhatsAppUrl, FACEBOOK_URL, INSTAGRAM_URL, RC_NUMBER, OFFICE_ADDRESS_FULL, STUDY_ABROAD_PORTAL_URL } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onOpenConsultation: () => void;
  onOpenUserManual?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation, onOpenUserManual }) => {
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailSub('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#0c182a] text-slate-300 border-t border-[#CFAE70]/25 relative overflow-hidden">
      {/* Subtle Gold Line Pattern Top Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#CFAE70] to-transparent opacity-80" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top Callout Banner in Footer */}
        <div className="glass-navy rounded-2xl p-6 sm:p-8 mb-16 border border-[#CFAE70]/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFAE70]/15 text-[#E4C88E] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#CFAE70]" />
              <span>Registered Travel & Education Agency • RC {RC_NUMBER}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
              Ready to Begin Your Global Journey?
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl">
              Speak with our senior immigration & academic admissions counselors today. Get your documents assessed at our Anthony, Lagos office or via virtual consultation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] hover:text-black font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              Book Free Consultation
            </button>
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I want to discuss my travel and education plans with an advisor.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold px-5 py-3.5 rounded-xl text-sm transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Instant WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Bio (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1B365D] to-[#0c182a] border border-[#CFAE70] flex items-center justify-center shadow">
                <Compass className="w-6 h-6 text-[#CFAE70]" />
              </div>
              <div>
                <span className="font-cinzel text-lg font-bold tracking-wider text-white">
                  HORIZON MOVE LIMITED
                </span>
                <p className="text-[11px] text-[#CFAE70] font-semibold tracking-widest uppercase">
                  Global Education & Travel Consulting
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Nigeria’s premier corporate agency dedicated to connecting students, skilled professionals, and travelers to world-class academic institutions, accredited European work permits, and hassle-free global visas.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="px-3 py-1 rounded-md bg-white/5 border border-slate-700">8+ Years Experience</span>
              <span className="px-3 py-1 rounded-md bg-white/5 border border-slate-700">5,000+ Visas Processed</span>
              <span className="px-3 py-1 rounded-md bg-white/5 border border-slate-700">98.4% Success Rate</span>
            </div>

            {/* Newsletter */}
            <div className="pt-3 space-y-2">
              <label className="block text-xs font-semibold text-[#E4C88E]">
                Subscribe for 2026/2027 Intake & Work Quota Alerts:
              </label>
              {subscribed ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Thank you! You will receive our latest quota alerts.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    className="bg-[#13233c] border border-slate-700 focus:border-[#CFAE70] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 w-full focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#CFAE70] hover:bg-[#E4C88E] text-[#1B365D] px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-[#CFAE70] pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> Home
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('study-abroad'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> Study Abroad Programs
                </button>
              </li>
              <li>
                <a
                  href={STUDY_ABROAD_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F3E5AB] text-[#E4C88E] font-medium transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#CFAE70]" /> Apply to Study Abroad (Portal)
                </a>
              </li>
              <li>
                <button onClick={() => { onNavigate('work-permit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> International Work Permits
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('visa-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> Visit & Business Visas
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('travel-bookings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> Flights & Hotel Bookings
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('client-portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[#F3E5AB] hover:text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> Client Portal & Itineraries
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('about-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> About Horizon Move
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5 text-[#CFAE70]" /> Contact & Office Location
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenUserManual} 
                  className="hover:text-[#F3E5AB] text-[#E4C88E] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#CFAE70]" /> Website User Manual & Docs
                </button>
              </li>
              <li className="pt-1.5">
                <button 
                  onClick={() => { onNavigate('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="text-xs text-slate-400 hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Staff & Management Access"
                >
                  <Lock className="w-3 h-3 text-[#CFAE70]" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Pathways */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-[#CFAE70] pl-2.5">
              Popular Routes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => { onNavigate('study-abroad'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  🇬🇧 UK Masters (No IELTS needed)
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('study-abroad'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  🇨🇦 Canada PGWP & Express Entry
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('work-permit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  🇷🇸 Serbia 2-Yr Work Permits
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('work-permit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  🇵🇱 Poland Voivodeship Permits
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('visa-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  🇨🇳 China Canton Fair / Trade Visa
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('visa-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors flex items-center gap-1.5 text-left cursor-pointer">
                  🇪🇺 Schengen 29-Nation Visit Visa
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-[#CFAE70] pl-2.5">
              Corporate Office
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#CFAE70] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Anthony Office (Lagos HQ):</strong>
                  <span>{OFFICE_ADDRESS_FULL}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#CFAE70] shrink-0" />
                <a href={`tel:${PRIMARY_PHONE}`} className="hover:text-[#E4C88E] transition-colors">{PRIMARY_PHONE}</a>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#CFAE70] shrink-0" />
                <span className="text-[#E4C88E] font-medium">{WEBSITE_DOMAIN}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#CFAE70] shrink-0" />
                <span>{EMAIL_ADDRESS}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#CFAE70] shrink-0" />
                <span>Mon - Fri: 8:30am - 6:00pm | Sat: 10am - 3pm</span>
              </div>

              {/* Official Social Links */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[11px] text-[#CFAE70] font-semibold block">Follow Our Verified Channels:</span>
                <div className="flex items-center gap-3">
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#1877F2]/20 border border-slate-700 hover:border-[#1877F2] text-slate-200 hover:text-white transition-all text-xs"
                    aria-label="Facebook Page"
                  >
                    <span className="font-bold text-[#1877F2]">f</span>
                    <span>Facebook</span>
                  </a>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#E4405F]/20 border border-slate-700 hover:border-[#E4405F] text-slate-200 hover:text-white transition-all text-xs"
                    aria-label="Instagram Profile"
                  >
                    <span className="font-bold text-[#E4405F]">📸</span>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Legal Text */}
        <div className="py-6 border-b border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong className="text-[#E4C88E]">IMPORTANT LEGAL DISCLAIMER:</strong> HORIZON MOVE LIMITED is a registered Nigerian consulting company (RC {RC_NUMBER}). We provide professional advisory, document review, university placements, and work permit administrative assistance. Horizon Move Limited does not issue visas; issuance of visas and entry permits is the sovereign prerogative of respective foreign embassies, high commissions, and immigration authorities. Processing fees apply to all applications. Subject to verified employer and embassy requirements.
          </p>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HORIZON MOVE LIMITED. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => { onNavigate('about-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => { onNavigate('about-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors cursor-pointer">
              Terms of Engagement
            </button>
            <button onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#CFAE70] transition-colors cursor-pointer">
              Office Directions
            </button>
            <button 
              onClick={() => { onNavigate('client-portal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="text-[#F3E5AB] hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
            >
              <User className="w-3 h-3 text-[#CFAE70]" />
              <span>Client Portal</span>
            </button>
            <button 
              onClick={() => { onNavigate('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="text-slate-400 hover:text-[#CFAE70] flex items-center gap-1 cursor-pointer font-medium transition-colors"
              title="Staff & Management Access"
            >
              <Lock className="w-3 h-3 text-[#CFAE70]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
