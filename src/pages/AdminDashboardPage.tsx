import React, { useState, useEffect } from 'react';
import { 
  LeadSubmission, 
  LeadStatus, 
  LeadType, 
  getSubmissions, 
  updateSubmissionStatus, 
  updateSubmissionNotes, 
  deleteSubmission, 
  clearAllSubmissions, 
  resetSampleSubmissions, 
  exportSubmissionsCSV, 
  saveSubmission,
  ADMIN_SESSION_KEY,
  verifyAdminPin,
  setCustomAdminPin,
  getStoredAdminPin
} from '../utils/submissions';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key,
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  PlusCircle, 
  RefreshCw, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Calendar,
  GraduationCap,
  Briefcase,
  Plane,
  X
} from 'lucide-react';
import { PageType } from '../types';
import { FlightsDashboard } from '../components/dashboard/FlightsDashboard';

interface AdminDashboardPageProps {
  onNavigate: (page: PageType) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [activeMainTab, setActiveMainTab] = useState<'all_leads' | 'flights'>('all_leads');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Change PIN modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [submissions, setSubmissions] = useState<LeadSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal for viewing full submission details
  const [activeLead, setActiveLead] = useState<LeadSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; isAll?: boolean } | null>(null);

  const loadLeads = () => {
    setSubmissions(getSubmissions());
  };

  useEffect(() => {
    loadLeads();

    const handleUpdate = () => {
      loadLeads();
    };

    window.addEventListener('horizon_lead_updated', handleUpdate);
    return () => {
      window.removeEventListener('horizon_lead_updated', handleUpdate);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(enteredPin)) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect security PIN. Access denied.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setEnteredPin('');
  };

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateSubmissionStatus(id, status);
    if (activeLead && activeLead.id === id) {
      setActiveLead({ ...activeLead, status });
    }
  };

  const handleSaveNotes = () => {
    if (!activeLead) return;
    updateSubmissionNotes(activeLead.id, editingNotes);
    setActiveLead({ ...activeLead, notes: editingNotes });
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name, isAll: false });
  };

  const handleClearAllClick = () => {
    setDeleteTarget({ id: 'all', name: 'All Submissions', isAll: true });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.isAll) {
      clearAllSubmissions();
      loadLeads();
      setActiveLead(null);
      showToast('All lead submissions have been cleared.');
    } else {
      deleteSubmission(deleteTarget.id);
      loadLeads();
      if (activeLead?.id === deleteTarget.id) {
        setActiveLead(null);
      }
      showToast(`Removed submission from "${deleteTarget.name}".`);
    }
    setDeleteTarget(null);
  };

  const handleAddDemoLead = () => {
    saveSubmission({
      type: 'consultation',
      fullName: 'Blessing Adeleke',
      phone: '+2348055566778',
      email: 'blessing.adeleke@gmail.com',
      service: 'Study Abroad (United Kingdom)',
      destination: 'United Kingdom',
      summary: 'MSc Public Health • September 2026 Intake • In-Person Office Session',
      details: {
        targetDegree: 'Master of Science (MSc)',
        preferredIntake: 'September 2026',
        counselingMode: 'In-person at Anthony Lagos Office',
        notes: 'Has WAEC B3 in English, inquiring about tuition deposit installment options.'
      },
      notes: 'New walk-in evaluation booked.'
    });
  };

  // Filtered list
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = 
      (sub.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.service || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.summary || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || sub.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // KPIs
  const totalCount = submissions.length;
  const newCount = submissions.filter(s => s.status === 'new').length;
  const studyCount = submissions.filter(s => (s.service || '').toLowerCase().includes('study') || s.type === 'program_inquiry').length;
  const workCount = submissions.filter(s => (s.service || '').toLowerCase().includes('work') || (s.service || '').toLowerCase().includes('permit')).length;
  const visaBookingCount = submissions.filter(s => s.type === 'flight_booking' || s.type === 'hotel_booking' || (s.service || '').toLowerCase().includes('visa')).length;
  const flightCount = submissions.filter(s => 
    s.type === 'flight_booking' || 
    (s.service || '').toLowerCase().includes('flight') || 
    (s.service || '').toLowerCase().includes('ticket') ||
    s.details?.pnr ||
    s.details?.flight_no
  ).length;

  // 1. If not authenticated, render login PIN screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-gradient-to-b from-[#142642] to-[#0c182b] border-2 border-[#CFAE70] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-white text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#CFAE70]/20 border border-[#CFAE70] flex items-center justify-center text-[#E4C88E] shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#E4C88E] text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CFAE70]" />
              <span>Horizon Move Internal Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              Staff & Admin Access
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Access all website form submissions, consultation requests, and client leads.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E4C88E] mb-1.5">
                Admin Master PIN
              </label>
              <input
                type="password"
                required
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError('');
                }}
                placeholder="Enter confidential security PIN"
                className="w-full bg-[#0a1424] border border-slate-600 focus:border-[#CFAE70] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none tracking-wider"
              />
            </div>

            {pinError && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/60">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold py-3.5 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Leads Portal</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/60 space-y-2">
            <p className="text-[11px] text-slate-400">
              Restricted to authorized Horizon Move admissions & operations personnel only.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Leads View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-[#142642] via-[#0f1f38] to-[#0a1628] border-2 border-[#CFAE70]/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CFAE70]/20 border border-[#CFAE70] flex items-center justify-center text-[#E4C88E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-extrabold font-serif-luxury text-white">
                  Lead Submissions Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Live Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#E4C88E]">
                Centralized dashboard capturing all website inquiries, consultations & evaluations
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              if (filteredSubmissions.length === 0) {
                showToast('No submissions match your search/filter to export.');
                return;
              }
              exportSubmissionsCSV(filteredSubmissions);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] border border-[#CFAE70]/50 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
            title="Download CSV for Excel or Google Sheets"
          >
            <Download className="w-4 h-4 text-[#CFAE70]" />
            <span>Export to Excel / CSV</span>
          </button>

          <button
            onClick={() => {
              setNewPinInput('');
              setConfirmPinInput('');
              setPinChangeMsg(null);
              setShowPinModal(true);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#0a1628] hover:bg-[#142642] text-slate-200 border border-slate-600 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="Update Master Security PIN"
          >
            <Key className="w-4 h-4 text-[#CFAE70]" />
            <span>Change PIN</span>
          </button>

          <button
            onClick={handleAddDemoLead}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="Inject test lead to verify notifications"
          >
            <PlusCircle className="w-4 h-4 text-[#CFAE70]" />
            <span>Add Test Lead</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142642] text-[#E4C88E] border border-[#CFAE70] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Primary Dashboard View Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/90 rounded-2xl max-w-lg shadow-inner">
        <button
          type="button"
          onClick={() => setActiveMainTab('all_leads')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeMainTab === 'all_leads'
              ? 'bg-[#1B365D] text-[#F3E5AB] shadow-md border border-[#CFAE70]/40'
              : 'text-slate-700 hover:text-black hover:bg-slate-300/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Client Leads ({totalCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('flights')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeMainTab === 'flights'
              ? 'bg-[#1B365D] text-[#F3E5AB] shadow-md border border-[#CFAE70]/40'
              : 'text-slate-700 hover:text-black hover:bg-slate-300/60'
          }`}
        >
          <Plane className="w-4 h-4 text-[#CFAE70]" />
          <span>Flights & PNR Desk ({flightCount})</span>
        </button>
      </div>

      {activeMainTab === 'flights' ? (
        <FlightsDashboard
          submissions={submissions}
          onRefresh={loadLeads}
          onSuccessToast={showToast}
        />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Total Submissions</span>
                <FileText className="w-4 h-4 text-[#1B365D]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1B365D]">{totalCount}</div>
              <p className="text-[10px] text-slate-500">All captured forms</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-300 shadow-sm space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">New / Uncontacted</span>
                <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{newCount}</div>
              <p className="text-[10px] text-amber-700/80">Require immediate response</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Study Abroad</span>
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{studyCount}</div>
              <p className="text-[10px] text-slate-500">2026/27 Academic leads</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Work Permits</span>
                <Briefcase className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{workCount}</div>
              <p className="text-[10px] text-slate-500">Europe employment quotas</p>
            </div>

            <div 
              onClick={() => setActiveMainTab('flights')}
              className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 sm:p-5 border border-purple-300 shadow-sm space-y-1 cursor-pointer hover:border-purple-400 hover:shadow transition-all"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Visas & Flights</span>
                <Plane className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{visaBookingCount}</div>
              <p className="text-[10px] text-purple-600 font-semibold">Click to open Flights Desk ➔</p>
            </div>
          </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, country, course..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#CFAE70] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedType === 'all' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                All Forms
              </button>
              <button
                onClick={() => setSelectedType('consultation')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedType === 'consultation' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Consultations
              </button>
              <button
                onClick={() => setSelectedType('eligibility_assessment')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedType === 'eligibility_assessment' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Eligibility
              </button>
              <button
                onClick={() => setSelectedType('free_evaluation')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedType === 'free_evaluation' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Intake Leads
              </button>
              <button
                onClick={() => setSelectedType('contact_message')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedType === 'contact_message' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Contact
              </button>
              <button
                onClick={() => setSelectedType('flight_booking')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedType === 'flight_booking' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Flights
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New / Uncontacted</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="enrolled">Enrolled / Approved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredSubmissions.length}</strong> of {totalCount} total submissions</span>
          <div className="flex items-center gap-3">
            <button
              onClick={resetSampleSubmissions}
              className="text-slate-500 hover:text-[#1B365D] flex items-center gap-1 cursor-pointer"
              title="Reset initial sample inquiries"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Samples</span>
            </button>
            <button
              onClick={handleClearAllClick}
              className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              title="Clear all recorded submissions"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submissions List / Table */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No submissions matching current filters</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your search query or status filter to view all customer inquiries.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((lead) => {
            const dateStr = new Date(lead.submittedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Status colors
            const statusConfig = {
              new: { bg: 'bg-rose-100 text-rose-800 border-rose-300', label: 'New Lead' },
              contacted: { bg: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Contacted' },
              in_progress: { bg: 'bg-blue-100 text-blue-800 border-blue-300', label: 'In Progress' },
              enrolled: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: 'Enrolled' },
              closed: { bg: 'bg-slate-100 text-slate-700 border-slate-300', label: 'Closed' }
            }[lead.status];

            // WhatsApp link generator
            const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
            const waTarget = cleanPhone.startsWith('234') ? cleanPhone : cleanPhone.startsWith('0') ? `234${cleanPhone.substring(1)}` : cleanPhone;
            const waHref = `https://wa.me/${waTarget}?text=${encodeURIComponent(
              `Hello ${lead.fullName}, thank you for contacting Horizon Move Limited regarding your ${lead.service} inquiry. This is our admissions desk following up with you.`
            )}`;

            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1B365D]/10 border border-[#1B365D]/20 text-[#1B365D] font-bold flex items-center justify-center text-sm shrink-0">
                      {lead.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {lead.fullName}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConfig.bg}`}>
                          {statusConfig.label}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase font-semibold">
                          {lead.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#B8934C] font-semibold">
                        {lead.service} {lead.destination ? `• ${lead.destination}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Summary & Details */}
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-800">{lead.summary}</p>
                    {lead.notes && (
                      <p className="text-slate-500 italic">
                        <strong>Counselor Note:</strong> {lead.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Phone className="w-3.5 h-3.5 text-[#B8934C]" />
                      {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="hidden sm:flex items-center gap-1 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {lead.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="new">🔴 New Lead</option>
                      <option value="contacted">🟡 Contacted</option>
                      <option value="in_progress">🔵 In Progress</option>
                      <option value="enrolled">🟢 Enrolled</option>
                      <option value="closed">⚪ Closed</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
                      title="Open WhatsApp chat with client"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all"
                      title="Call candidate"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Call</span>
                    </a>

                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}?subject=Horizon Move Limited - Inquiry Follow-up`}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all"
                        title="Send email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Email</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setActiveLead(lead);
                        setEditingNotes(lead.notes || '');
                      }}
                      className="inline-flex items-center gap-1 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                      title="View all form answers and edit notes"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Details</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClick(lead.id, lead.fullName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {activeLead && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setActiveLead(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl border-2 border-[#CFAE70] shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#142642] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold text-[#E4C88E] uppercase tracking-wider block">
                  Lead Submission Details • ID: {activeLead.id}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-white">
                  {activeLead.fullName}
                </h3>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
              {/* Applicant Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Phone / WhatsApp:</span>
                  <strong className="text-sm text-[#1B365D]">{activeLead.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Address:</span>
                  <strong className="text-sm text-slate-800">{activeLead.email || 'Not provided'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Service Requested:</span>
                  <strong className="text-slate-800">{activeLead.service}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Date Submitted:</span>
                  <strong className="text-slate-800">{new Date(activeLead.submittedAt).toLocaleString()}</strong>
                </div>
              </div>

              {/* Form Specific Answers */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Form Answers & Criteria Submitted:
                </h4>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                  {Object.entries(activeLead.details || {}).length === 0 ? (
                    <p className="text-slate-500 italic">No additional custom fields recorded.</p>
                  ) : (
                    Object.entries(activeLead.details).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-200 last:border-0 gap-1">
                        <span className="font-semibold text-slate-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:
                        </span>
                        <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Counselor Internal Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Counselor Follow-up Notes:
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record outcome of phone call, document checklist status, admission portal ID, etc..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Current Status: <strong className="uppercase">{activeLead.status}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = activeLead;
                    setActiveLead(null);
                    handleDeleteClick(target.id, target.fullName);
                  }}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  title="Delete this submission"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* 2. CHANGE PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#142642] border-2 border-[#CFAE70] rounded-3xl w-full max-w-md p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#CFAE70]/20 border border-[#CFAE70] flex items-center justify-center text-[#E4C88E]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-serif-luxury text-white">Update Admin Master PIN</h3>
                  <p className="text-xs text-slate-300">Set a private, confidential PIN for the leads dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPinInput.trim()) {
                  setPinChangeMsg({ type: 'error', text: 'PIN cannot be empty.' });
                  return;
                }
                if (newPinInput.trim().length < 6) {
                  setPinChangeMsg({ type: 'error', text: 'PIN must be at least 6 characters long.' });
                  return;
                }
                if (newPinInput !== confirmPinInput) {
                  setPinChangeMsg({ type: 'error', text: 'New PIN and confirm PIN do not match.' });
                  return;
                }
                setCustomAdminPin(newPinInput.trim());
                setPinChangeMsg({ type: 'success', text: 'Security PIN updated successfully!' });
                setTimeout(() => {
                  setShowPinModal(false);
                  setPinChangeMsg(null);
                }, 1400);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E4C88E] mb-1">
                  New Private PIN
                </label>
                <input
                  type="password"
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#0a1424] border border-slate-600 focus:border-[#CFAE70] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E4C88E] mb-1">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  required
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Repeat new PIN"
                  className="w-full bg-[#0a1424] border border-slate-600 focus:border-[#CFAE70] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {pinChangeMsg && (
                <div className={`flex items-center gap-2 text-xs p-3 rounded-xl border ${
                  pinChangeMsg.type === 'success'
                    ? 'text-emerald-300 bg-emerald-950/40 border-emerald-700/60'
                    : 'text-rose-300 bg-rose-950/40 border-rose-700/60'
                }`}>
                  {pinChangeMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{pinChangeMsg.text}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg hover:brightness-105 transition-all cursor-pointer"
                >
                  Save New PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL (Replaces blocked window.confirm) */}
      {deleteTarget && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteTarget(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border-2 border-rose-200 text-slate-800 relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 font-serif-luxury">
                {deleteTarget.isAll ? 'Clear All Submissions?' : 'Delete Submission Record?'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                {deleteTarget.isAll ? (
                  'Are you sure you want to permanently clear ALL captured lead submissions and flight bookings? This action cannot be undone.'
                ) : (
                  <>
                    Are you sure you want to remove the submission from <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer text-center"
              >
                {deleteTarget.isAll ? 'Yes, Clear All' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
