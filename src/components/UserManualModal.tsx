import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Plane, 
  GraduationCap, 
  Briefcase, 
  FileCheck, 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Luggage,
  Calendar,
  CreditCard
} from 'lucide-react';
import { RC_NUMBER } from '../utils/whatsapp';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: any) => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'flights' | 'study' | 'work' | 'visa' | 'portal' | 'overview'>('flights');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border-2 border-[#CFAE70] my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B365D] via-[#142642] to-[#0c182b] p-6 text-white relative flex items-center justify-between border-b border-[#CFAE70]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CFAE70]/20 text-[#E4C88E] flex items-center justify-center border border-[#CFAE70]/40">
              <BookOpen className="w-6 h-6 text-[#CFAE70]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CFAE70]/20 text-[#E4C88E] text-[10px] font-bold uppercase tracking-wider mb-1">
                Official User Manual • RC {RC_NUMBER}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-serif-luxury text-white">
                Website Documentation & User Guide
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close user manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'flights', label: '1. Flight Engine', icon: Plane, badge: 'Popular' },
            { id: 'study', label: '2. Study Abroad', icon: GraduationCap },
            { id: 'work', label: '3. Work Permits', icon: Briefcase },
            { id: 'visa', label: '4. Visa Solutions', icon: FileCheck },
            { id: 'portal', label: '5. Client Portal & Tracking', icon: ShieldCheck },
            { id: 'overview', label: '6. Company & Helpdesk', icon: Phone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#1B365D] text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#CFAE70]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-[#A61C1C] text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {activeTab === 'flights' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Plane className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong className="block font-bold mb-0.5">Most Used Service on Horizon Move</strong>
                  Our flight engine connects directly to airline global distribution systems. Search international and domestic flights with verifiable PNRs and student luggage allocations.
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#CFAE70]" />
                  Step 1: Searching for Flights
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                  <li><strong>Select Trip Type:</strong> Choose One Way, Round Trip, or Multi-City.</li>
                  <li><strong>Set Departure & Destination:</strong> Default departure is Lagos (LOS). Click any popular destination pill (London LHR, Manchester MAN, Toronto YYZ, Dubai DXB, New York JFK) or enter your desired airport.</li>
                  <li><strong>Choose Departure & Return Dates:</strong> Select dates from the calendar pickers.</li>
                  <li><strong>Configure Passengers & Luggage:</strong> Select passenger count and toggle <em>Student 46kg Luggage Allowance</em> if traveling for academic purposes.</li>
                  <li>Click <strong>"Search Live GDS Flights"</strong> to retrieve live airline schedules.</li>
                </ol>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#CFAE70]" />
                  Step 2: Reserving & Booking
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Live Ticket Purchase:</strong> Pay via Nigerian Debit/Credit cards or direct Zenith/Stanbic Bank transfers. Instant e-ticket issued to your email.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Visa Embassy Flight Itinerary:</strong> Valid 6-character PNR flight reservation code for visa interview requirements without purchasing a non-refundable ticket.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('travel-bookings');
                  }}
                  className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plane className="w-4 h-4" />
                  <span>Go to Flight Engine Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'study' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury">
                  Study Abroad Admission & Visa Guide
                </h3>
                <p className="text-sm text-slate-600">
                  We process Bachelor’s, Master’s, and PGD admissions across the UK, Canada, USA, and Europe for the 2026/2027 academic intakes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-sm text-[#1B365D]">WAEC/NECO English Waivers</h4>
                  <p className="text-xs text-slate-600">
                    Students with C6 or better in WAEC/NECO English do not need to write IELTS or TOEFL for majority of our partner universities in the UK.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-sm text-[#1B365D]">Post-Study Work Permits</h4>
                  <p className="text-xs text-slate-600">
                    Graduates qualify for 2-year Graduate Route visas in the UK, up to 3-year PGWP in Canada, and 18-month job seeker permits in Germany.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('study-abroad');
                  }}
                  className="bg-[#1B365D] text-[#F3E5AB] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#CFAE70]" />
                  <span>View Study Abroad Programs</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury">
                  European Work Permit Application Guide
                </h3>
                <p className="text-sm text-slate-600">
                  Government-sanctioned employment quotas in Poland, Czech Republic, Serbia, Albania, and Lithuania.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1B365D] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div className="text-xs">
                    <strong className="block font-bold text-[#1B365D]">Profile & CV Evaluation</strong>
                    Submit your CV, international passport copy, and police clearance certificate for preliminary verification.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1B365D] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div className="text-xs">
                    <strong className="block font-bold text-[#1B365D]">Ministry of Labor Quota Approval</strong>
                    Employer files for foreign worker authorization with the respective Ministry. Processing takes 60 to 90 days.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1B365D] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div className="text-xs">
                    <strong className="block font-bold text-[#1B365D]">Embassy Submission & Work Visa</strong>
                    Our consultants book your biometrics slot, prepare the interview file, and arrange your departure flight.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('work-permit');
                  }}
                  className="bg-[#1B365D] text-[#F3E5AB] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#CFAE70]" />
                  <span>View Open Work Quotas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'visa' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury">
                  Visa Services & Dossier Preparation
                </h3>
                <p className="text-sm text-slate-600">
                  Comprehensive assistance for China Business Visas (Canton Fair), UK Visitor Visas, Canadian Tourist Visas, and Schengen entry.
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#1B365D] block mb-1">China Business Visas:</strong>
                  Official invitation letters (TE/PU letters), Canton Fair registration, and fast-track processing in Lagos/Abuja.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#1B365D] block mb-1">Schengen & UK Visitor Visas:</strong>
                  Detailed itinerary planning, bank statement stress testing, proof of ties to Nigeria, and hotel reservations.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portal' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury">
                  Client Self-Service Portal
                </h3>
                <p className="text-sm text-slate-600">
                  Track your ongoing visa submissions, review pending flight reservations, and download verified e-tickets.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <p><strong>How to track your file:</strong></p>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                  <li>Click <strong>Client Portal</strong> in the top menu or footer.</li>
                  <li>Enter your Application ID or Flight PNR code.</li>
                  <li>View your current milestone: Document Verification → Ministry Submission → Biometrics Slot → Visa Issued.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury">
                  Corporate Contacts & Physical Head Office
                </h3>
                <p className="text-sm text-slate-600">
                  Horizon Move Limited is a registered corporate consulting agency under the Corporate Affairs Commission of Nigeria (RC 7998967).
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <MapPin className="w-5 h-5 text-[#CFAE70] shrink-0" />
                  <span><strong>Head Office:</strong> 4, Ayanbole Street, Anthony, Lagos State, Nigeria</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Phone className="w-5 h-5 text-[#CFAE70] shrink-0" />
                  <span><strong>Hotline & Ticketing Desk:</strong> +234 810 599 0739</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Calendar className="w-5 h-5 text-[#CFAE70] shrink-0" />
                  <span><strong>Office Hours:</strong> Monday – Friday: 8:30 AM – 5:30 PM | Saturday: 10:00 AM – 3:00 PM</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <span>Horizon Move Limited • RC {RC_NUMBER}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1B365D] text-white font-bold hover:bg-[#142642] transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
