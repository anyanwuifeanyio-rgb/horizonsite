import React, { useState } from 'react';
import { Currency, VisaServiceCountry } from '../types';
import { VISA_SERVICES_LIST } from '../data/mockData';
import { 
  FileCheck, 
  Building2, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Sparkles, 
  MessageCircle, 
  Plane, 
  MapPin,
  HelpCircle
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface VisaServicesPageProps {
  currency: Currency;
  onOpenConsultation: () => void;
  onSuccessToast: (msg: string) => void;
}

export const VisaServicesPage: React.FC<VisaServicesPageProps> = ({
  currency,
  onOpenConsultation,
  onSuccessToast
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(VISA_SERVICES_LIST[0].id);
  const currentVisa = VISA_SERVICES_LIST.find(v => v.id === selectedCountry) || VISA_SERVICES_LIST[0];

  const handleStartApplication = (visaName: string) => {
    const msg = `*START VISA APPLICATION - HORIZON MOVE LIMITED*
---------------------------------------
*Destination Requested:* ${visaName}
*Service:* Full Visa Application & Documentation Support
---------------------------------------
_I would like to initiate my visa application, book embassy biometrics, and have my financial documents audited._`;

    onSuccessToast(`Initiating ${visaName} Visa application dossier! Opening WhatsApp desk.`);
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0d1b30] text-white py-12 sm:py-24 rounded-2xl sm:rounded-3xl mx-2 sm:mx-8 px-4 sm:px-12 border-2 border-[#CFAE70]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
            alt="International Passports and Visa Stamps"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b30] via-[#0d1b30]/90 to-[#1B365D]/80" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#F3E5AB] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
            <span className="truncate">High-Approval Visa Advisory</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold font-serif-luxury tracking-tight leading-tight">
            Visit and Business Visa Assistance
          </h1>

          <p className="text-base sm:text-2xl text-[#E4C88E] font-medium font-serif-luxury">
            China Trade Delegations, European Schengen & Worldwide Visas
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Eliminate rejection risks. We structure solid financial portfolios, provide authenticated corporate invitation letters, fast-track VFS/TLS biometrics slots, and draft compelling purpose-of-travel dossiers.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => handleStartApplication('China / Schengen / UK Visit Visa')}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Start Your Visa Application</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#CFAE70]" />
              <span>Book Dossier Audit</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CORE VISA SERVICES BREAKDOWN - 4 PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
            OUR FULL-SERVICE METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B365D] font-serif-luxury">
            Everything You Need for a Seamless Visa Approval
          </h2>
          <p className="text-sm text-slate-600">
            We handle the intricate bureaucratic details so you can focus on your business and travel plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-[#CFAE70] transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1B365D]">
              1. Visa Application Support
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flawless completion of complex embassy questionnaires (DS-160, Gov.uk, IRCC Portal, Schengen VIS). Zero inconsistencies in travel history.
            </p>
          </div>

          {/* Service 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-[#CFAE70] transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1B365D]">
              2. Invitation Letters
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official corporate invitations for Canton Fair China, European trade fairs, tech conferences, or host family sponsorships with government seal.
            </p>
          </div>

          {/* Service 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-[#CFAE70] transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1B365D]">
              3. Document Review
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rigorous audit of bank statements, CAC company incorporation documents, tax clearance certificates, and proof of socio-economic ties.
            </p>
          </div>

          {/* Service 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-[#CFAE70] transition-colors space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1B365D]">
              4. Appointment Booking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated monitoring and fast-track booking of hard-to-get biometrics appointment dates at TLScontact, VFS Global, and US Consulates.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DESTINATION DOSSIER EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
            DESTINATION DOSSIERS
          </span>
          <h2 className="text-3xl font-bold text-[#1B365D] font-serif-luxury">
            Select Your Target Country
          </h2>
        </div>

        {/* Buttons List */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {VISA_SERVICES_LIST.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedCountry(v.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCountry === v.id
                  ? 'bg-[#1B365D] text-[#F3E5AB] shadow-lg border border-[#CFAE70]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
              }`}
            >
              <span>{v.flag}</span>
              <span>{v.name}</span>
            </button>
          ))}
        </div>

        {/* Detailed Country View */}
        <div className="glass-white rounded-3xl p-6 sm:p-10 border-2 border-[#CFAE70]/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image & Quick Details */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg h-72 lg:h-full min-h-[300px]">
              <img
                src={currentVisa.image}
                alt={currentVisa.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c182a] via-black/30 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1B365D] text-white px-3 py-1 rounded-full text-xs font-bold border border-[#CFAE70]/30">
                <span>{currentVisa.flag}</span>
                <span>{currentVisa.name}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-[#E4C88E] font-bold block">
                  Processing Window: {currentVisa.processingTime}
                </span>
                <h3 className="text-xl font-bold font-serif-luxury">
                  {currentVisa.name} Visa Assistance
                </h3>
              </div>
            </div>

            {/* Content & Services */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Validity / Stay:</span>
                  <strong className="text-slate-800 font-bold">{currentVisa.validity}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Estimated Consulting Fee:</span>
                  <strong className="text-emerald-700 font-extrabold">{currentVisa.estimatedCost[currency === 'USD' ? 'USD' : 'NGN']}</strong>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-medium block">Ideal For:</span>
                  <span className="text-slate-700 font-semibold">{currentVisa.idealFor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#B8934C]" />
                  <span>Horizon Move Comprehensive Support Services:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {currentVisa.keyServices.map((srv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{srv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => handleStartApplication(currentVisa.name)}
                  className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold py-3.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start {currentVisa.name} Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={createWhatsAppUrl(`Hello Horizon Move Limited, I need assistance with a ${currentVisa.name} Visa.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Direct WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENT VISA CHALLENGES WE RESOLVE */}
      <section className="bg-navy-pattern py-16 sm:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E4C88E]">
              HIGH APPROVAL EXPERTISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury">
              Past Refusal? We Fix Incomplete Dossiers
            </h2>
            <p className="text-sm text-slate-300">
              Over 40% of our clients come to us after prior embassy refusals. We audit past GCMS/TLS notes, address officer concerns, and build an airtight case.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-navy p-6 rounded-2xl border border-[#CFAE70]/30 space-y-2">
              <h3 className="text-base font-bold text-[#F3E5AB]">Proof of Home Ties</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We substantiate your socio-economic roots in Nigeria with verified property deeds, business ownership, family ties, and employment endorsements.
              </p>
            </div>
            <div className="glass-navy p-6 rounded-2xl border border-[#CFAE70]/30 space-y-2">
              <h3 className="text-base font-bold text-[#F3E5AB]">Source of Funds Legitimacy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sudden lump sum deposits trigger instant refusal. We structure your bank narrative with transparent turnover histories and audited financial trails.
              </p>
            </div>
            <div className="glass-navy p-6 rounded-2xl border border-[#CFAE70]/30 space-y-2">
              <h3 className="text-base font-bold text-[#F3E5AB]">Verified Travel Itineraries</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Embassies verify flight PNRs and hotel bookings directly with airlines. We provide 100% active, verifiable bookings that pass consular scrutiny.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="glass-navy p-8 sm:p-12 rounded-3xl border-2 border-[#CFAE70]/40 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif-luxury">
              Ready to Travel Without Visa Delays?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak with our Visa Dossier team at our Anthony, Lagos office or via virtual consultation.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl cursor-pointer"
            >
              Book Visa Consultation
            </button>
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I want to begin my visa application.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Visa Desk WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
