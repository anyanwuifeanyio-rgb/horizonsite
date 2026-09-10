import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Target, 
  Eye, 
  Award, 
  Users, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  MessageCircle,
  FileCheck
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';
import { createWhatsAppUrl, PRIMARY_PHONE, EMAIL_ADDRESS, OFFICE_ADDRESS_FULL, RC_NUMBER, FACEBOOK_URL, INSTAGRAM_URL } from '../utils/whatsapp';
import lagosOfficeImg from '../assets/images/lagos_office_lounge_1788942538396.jpg';

interface AboutPageProps {
  onOpenConsultation: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0d1b30] text-white py-12 sm:py-24 rounded-2xl sm:rounded-3xl mx-2 sm:mx-8 px-4 sm:px-12 border-2 border-[#CFAE70]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
            alt="Corporate Headquarters & Modern Architecture"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b30] via-[#0d1b30]/90 to-[#1B365D]/80" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#F3E5AB] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
            <span className="truncate">ABOUT HORIZON MOVE • RC {RC_NUMBER}</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold font-serif-luxury tracking-tight leading-tight">
            Connecting Nigerians to <br />
            <span className="gold-gradient-text">World-Class Horizons</span>
          </h1>

          <p className="text-base sm:text-2xl text-[#E4C88E] font-medium font-serif-luxury">
            8+ Years of Integrity in Education & Travel Consulting
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            HORIZON MOVE LIMITED was established with a singular, resolute mandate: to provide transparent, legally sound, and premium cross-border consulting services that eliminate false promises and empower Nigerians with authentic global mobility.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onOpenConsultation}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Meet Our Advisory Board</span>
            </button>

            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I want to learn more about your company credentials and services.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Direct WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. MISSION, VISION & CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="glass-white rounded-3xl p-8 sm:p-10 border-2 border-[#CFAE70]/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center shadow-md">
              <Target className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-[#B8934C] uppercase tracking-widest block">
              OUR MISSION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] font-serif-luxury">
              "To connect Nigerians to global opportunities"
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We bridge ambitious students, skilled artisans, medical practitioners, tech innovators, and business leaders to legitimate academic institutions, European labor markets, and global trade corridors with unmatched professional rigor.
            </p>
          </div>

          {/* Vision Card */}
          <div className="glass-white rounded-3xl p-8 sm:p-10 border-2 border-[#CFAE70]/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center shadow-md">
              <Eye className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-[#B8934C] uppercase tracking-widest block">
              OUR VISION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] font-serif-luxury">
              "To be West Africa's most trusted mobility gateway"
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To redefine the travel and education consulting sector in Africa through ethical practices, verified employer partnerships, 100% genuine documentation, and compassionate client advocacy.
            </p>
          </div>
        </div>

        {/* 4 Core Values */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
              OUR PILLARS OF EXCELLENCE
            </span>
            <h2 className="text-3xl font-bold text-[#1B365D] font-serif-luxury">
              Core Values That Guide Every File
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-[#CFAE70] transition-colors">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <h3 className="font-bold text-base text-[#1B365D]">1. Absolute Integrity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero fake invitations or forged documentation. We tell you the honest reality of your profile and never make empty promises.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-[#CFAE70] transition-colors">
              <FileCheck className="w-8 h-8 text-[#B8934C]" />
              <h3 className="font-bold text-base text-[#1B365D]">2. Transparent Process</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Milestone contracts, clear government fees, and complete access to your application tracking numbers at all times.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-[#CFAE70] transition-colors">
              <Award className="w-8 h-8 text-[#1B365D]" />
              <h3 className="font-bold text-base text-[#1B365D]">3. Unmatched Excellence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Immaculate SOPs, deep consular insight, and meticulous document auditing yielding a 98.4% visa approval track record.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-[#CFAE70] transition-colors">
              <Users className="w-8 h-8 text-[#A61C1C]" />
              <h3 className="font-bold text-base text-[#1B365D]">4. Client-First Handholding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are never just a file number. We guide you from initial counseling to airport pickup and overseas accommodation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXECUTIVE TEAM SHOWCASE */}
      <section className="bg-navy-pattern py-16 sm:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E4C88E]">
              LEADERSHIP & ADVISORY DESK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury">
              Meet Our Senior Counselors & Legal Experts
            </h2>
            <p className="text-sm text-slate-300">
              Seasoned educational consultants, certified European immigration lawyers, and IATA travel professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="glass-navy rounded-3xl overflow-hidden border border-[#CFAE70]/30 shadow-xl flex flex-col justify-between hover:border-[#CFAE70] transition-all duration-300"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c182a] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-[#1B365D]/90 text-[#F3E5AB] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#CFAE70]/40">
                      {member.experience}
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-white font-serif-luxury">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#E4C88E] font-semibold">{member.role}</p>
                    <p className="text-xs text-slate-300 leading-relaxed pt-2">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={createWhatsAppUrl(`Hello ${member.name}, I would like to request a consultation regarding my application.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/10 hover:bg-[#CFAE70] hover:text-[#1B365D] text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Consult on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PHYSICAL OFFICES & CORPORATE ACCREDITATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
            VISIT OUR LAGOS CONSULTATION LOUNGE
          </span>
          <h2 className="text-3xl font-bold text-[#1B365D] font-serif-luxury">
            State-of-the-Art Consultation Facilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            We welcome you to visit our secure, comfortable corporate headquarters in Anthony, Lagos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Anthony Corporate HQ */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 hover:border-[#CFAE70] transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={lagosOfficeImg}
                  alt="Horizon Move Executive Consultation Lounge, Lagos"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c182a]/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-white text-xs font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#CFAE70]" />
                  <span>Executive Consultation Suites • Anthony, Lagos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#B8934C]">Corporate Headquarters</span>
                  <h3 className="text-xl font-bold text-[#1B365D]">Anthony, Lagos</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {OFFICE_ADDRESS_FULL}. Dedicated private lounges for university admissions, executive work permit processing, visa dossier audits, and consular interview coaching.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1B365D] border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B8934C]" /> 4, Ayanbole Street, Anthony
              </span>
              <a href={`tel:${PRIMARY_PHONE}`} className="flex items-center gap-1.5 hover:text-[#B8934C] transition-colors">
                📞 {PRIMARY_PHONE}
              </a>
            </div>
          </div>

          {/* Official Channels & Virtual Access */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 hover:border-[#CFAE70] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-[#B8934C]">Verified Online Presence</span>
                <h3 className="text-xl font-bold text-[#1B365D]">Follow Our Official Channels</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Stay updated on real-time visa intake deadlines, Embassy quota releases, and scholarship announcements across our verified social handles.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <a 
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
              >
                <span>Facebook: @horizonmove</span>
              </a>
              <a 
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all"
              >
                <span>Instagram: @horizonmoveltd</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="glass-navy p-8 sm:p-12 rounded-3xl border-2 border-[#CFAE70]/40 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif-luxury">
              Partner with Nigeria's Most Trusted Advisory Firm
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Schedule your confidential consultation with Horizon Move Limited today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl cursor-pointer"
            >
              Book In-Person or Virtual Session
            </button>
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I would like to book a meeting at your Lagos office.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
