import React, { useState } from 'react';
import { 
  LeadSubmission, 
  LeadStatus, 
  updateSubmissionStatus, 
  updateSubmissionNotes, 
  deleteSubmission 
} from '../../utils/submissions';
import { 
  PRIMARY_PHONE, 
  EMAIL_ADDRESS, 
  OFFICE_ADDRESS_FULL, 
  RC_NUMBER,
  createWhatsAppUrl 
} from '../../utils/whatsapp';
import { generateItineraryPDF } from '../../utils/pdfGenerator';
import { AirlineLogo } from '../AirlineLogo';
import { 
  Plane, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Printer, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  MessageCircle, 
  Copy, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Calendar, 
  Luggage, 
  Ticket,
  ShieldCheck,
  Building2,
  X,
  PlusCircle,
  FileCode,
  Share2
} from 'lucide-react';

interface FlightsDashboardProps {
  submissions: LeadSubmission[];
  onRefresh: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const FlightsDashboard: React.FC<FlightsDashboardProps> = ({ 
  submissions, 
  onRefresh,
  onSuccessToast 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pnr_confirmed' | 'inquiries'>('all');
  
  // Active modal preview for printable E-Ticket
  const [previewFlight, setPreviewFlight] = useState<LeadSubmission | null>(null);
  
  // Note editing state
  const [editingFlight, setEditingFlight] = useState<LeadSubmission | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Delete confirmation modal state
  const [flightToDelete, setFlightToDelete] = useState<{ id: string; name: string; pnr?: string } | null>(null);

  // Filter only flight-related submissions
  const flightSubmissions = submissions.filter((sub) => {
    return sub.type === 'flight_booking' || 
           (sub.service || '').toLowerCase().includes('flight') || 
           (sub.service || '').toLowerCase().includes('ticket') ||
           sub.details?.pnr ||
           sub.details?.flight_no;
  });

  const filteredFlights = flightSubmissions.filter((flight) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (flight.fullName || '').toLowerCase().includes(q) ||
      (flight.phone || '').toLowerCase().includes(q) ||
      (flight.email || '').toLowerCase().includes(q) ||
      (flight.destination || '').toLowerCase().includes(q) ||
      (flight.summary || '').toLowerCase().includes(q) ||
      (flight.details?.pnr || '').toLowerCase().includes(q) ||
      (flight.details?.airline || '').toLowerCase().includes(q) ||
      (flight.details?.passport_number || '').toLowerCase().includes(q) ||
      (flight.details?.from || '').toLowerCase().includes(q) ||
      (flight.details?.to || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || flight.status === statusFilter;
    
    const isPnrConfirmed = Boolean(flight.details?.pnr);
    const matchesType = 
      typeFilter === 'all' ? true :
      typeFilter === 'pnr_confirmed' ? isPnrConfirmed :
      !isPnrConfirmed;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Analytics Metrics
  const totalFlights = flightSubmissions.length;
  const pnrConfirmedCount = flightSubmissions.filter(f => f.details?.pnr).length;
  const newRequestsCount = flightSubmissions.filter(f => f.status === 'new').length;
  const ticketedCount = flightSubmissions.filter(f => f.status === 'enrolled').length;

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateSubmissionStatus(id, status);
    onRefresh();
    if (onSuccessToast) {
      onSuccessToast(`Flight booking status updated to ${status}.`);
    }
  };

  const handleSaveNotes = () => {
    if (!editingFlight) return;
    updateSubmissionNotes(editingFlight.id, noteInput);
    onRefresh();
    setEditingFlight(null);
    if (onSuccessToast) {
      onSuccessToast('Staff notes saved successfully.');
    }
  };

  const initiateDelete = (id: string, name: string, pnr?: string) => {
    setFlightToDelete({ id, name, pnr });
  };

  const confirmDeleteFlight = () => {
    if (!flightToDelete) return;
    deleteSubmission(flightToDelete.id);
    onRefresh();
    if (previewFlight?.id === flightToDelete.id) setPreviewFlight(null);
    if (editingFlight?.id === flightToDelete.id) setEditingFlight(null);
    if (onSuccessToast) {
      onSuccessToast(`Flight booking for ${flightToDelete.name} removed successfully.`);
    }
    setFlightToDelete(null);
  };

  // 1. Download customer flight itinerary as a standalone formatted PDF file
  const downloadCustomerTicketPdf = (flight: LeadSubmission) => {
    const details = flight.details || {};
    const pnr = details.pnr || 'PENDING';
    const airline = details.airline || 'Scheduled Airline';
    const flightNo = details.flight_no || 'TBA';
    const origin = details.from || 'Origin';
    const dest = details.to || flight.destination || 'Destination';
    const departDate = details.departDate || details.departure_time || 'Confirmed Schedule';
    const arrivalTime = details.arrivalTime || details.arrival_time || 'Confirmed Arrival';
    const cabin = details.cabinClass || 'Economy Class';
    const fare = details.fare || 'Fare On Request';
    const deadline = details.ticket_deadline || '24-48 Hours from Reservation';
    const passport = details.passport_number || 'On File with Horizon Move';
    const nationality = details.nationality || 'Nigerian (NG)';

    try {
      generateItineraryPDF({
        pnr,
        bookingReference: details.booking_reference || `HORIZON-${pnr}`,
        carrier: details.carrier,
        airlineName: airline,
        flightNo,
        from: origin,
        to: dest,
        departureTime: departDate,
        arrivalTime,
        fare,
        ticketDeadline: deadline,
        passengerName: flight.fullName,
        passportNumber: passport,
        nationality,
        phone: flight.phone,
        email: flight.email,
        cabinClass: `${cabin} • Confirmed PNR`,
        baggage: '2 x 23kg Checked Bags + 7kg Cabin',
        status: flight.status === 'enrolled' ? 'TICKET ISSUED (E-TICKET)' : 'CONFIRMED (SEATS HELD)'
      });

      if (onSuccessToast) {
        onSuccessToast(`Official PDF itinerary for ${flight.fullName} (PNR ${pnr}) downloaded!`);
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      if (onSuccessToast) {
        onSuccessToast('Failed to generate PDF document.');
      }
    }
  };

  // 2. Download customer manifest as a formatted TXT document
  const downloadCustomerManifestTxt = (flight: LeadSubmission) => {
    const details = flight.details || {};
    const pnr = details.pnr || 'NOT_ISSUED';
    const txt = `===============================================================
HORIZON MOVE LIMITED - OFFICIAL PASSENGER FLIGHT MANIFEST
Corporate Headquarters: ${OFFICE_ADDRESS_FULL}
RC: ${RC_NUMBER} | Ticketing Desk: ${PRIMARY_PHONE} | Email: ${EMAIL_ADDRESS}
===============================================================

BOOKING REFERENCE (PNR): ${pnr}
BOOKING STATUS:          ${flight.status.toUpperCase()}
BOOKING DATE:            ${new Date(flight.submittedAt).toLocaleString()}
TICKETING DEADLINE:      ${details.ticket_deadline || '24-48 Hours'}

PASSENGER DETAILS:
---------------------------------------------------------------
Full Legal Name:         ${flight.fullName}
Primary Phone:           ${flight.phone}
Email Address:           ${flight.email || 'N/A'}
Passport Number:         ${details.passport_number || 'N/A'}
Nationality:             ${details.nationality || 'Nigerian (NG)'}
Number of Passengers:    ${details.passengers || 1}

FLIGHT ITINERARY:
---------------------------------------------------------------
Airline:                 ${details.airline || 'Scheduled Carrier'}
Flight Number:           ${details.flight_no || 'TBA'}
Departure Airport:       ${details.from || 'Origin'}
Destination Airport:     ${details.to || flight.destination || 'Destination'}
Departure Date/Time:     ${details.departure_time || details.departDate || 'N/A'}
Arrival/Return:          ${details.arrival_time || details.returnDate || 'N/A'}
Cabin Class:             ${details.cabinClass || 'Economy'}
Quoted Total Fare:       ${details.fare || 'TBA'}
Baggage Allowance:       2 x 23kg Checked Bags + 7kg Carry-on

COUNSELOR & DISPATCH NOTES:
---------------------------------------------------------------
${flight.notes || 'No administrative notes recorded.'}

===============================================================
Horizon Move Limited - Certified Educational & Travel Consultant
===============================================================`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Passenger_Manifest_${pnr}_${flight.fullName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onSuccessToast) {
      onSuccessToast(`Passenger manifest for ${flight.fullName} downloaded.`);
    }
  };

  // 3. Download single customer JSON
  const downloadCustomerJson = (flight: LeadSubmission) => {
    const jsonStr = JSON.stringify(flight, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Flight_Record_${flight.details?.pnr || flight.id}_${flight.fullName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onSuccessToast) {
      onSuccessToast(`JSON flight record downloaded for ${flight.fullName}.`);
    }
  };

  // 4. Export ALL flights to CSV spreadsheet
  const exportAllFlightsCSV = () => {
    if (filteredFlights.length === 0) {
      if (onSuccessToast) {
        onSuccessToast('No flights match the current filter to export.');
      }
      return;
    }

    const headers = [
      'Booking ID',
      'Submission Date',
      'Passenger Full Name',
      'Phone Number',
      'Email Address',
      'Passport Number',
      'Nationality',
      'Airline Carrier',
      'Flight Number',
      'Origin (From)',
      'Destination (To)',
      'Departure Date',
      'Return Date',
      'Cabin Class',
      'Passengers Count',
      'GDS PNR Reference',
      'Ticketing Deadline',
      'Quoted Fare',
      'Booking Status',
      'Staff Notes'
    ];

    const rows = filteredFlights.map((f) => {
      const d = f.details || {};
      return [
        `"${f.id}"`,
        `"${new Date(f.submittedAt).toISOString()}"`,
        `"${(f.fullName || '').replace(/"/g, '""')}"`,
        `"${(f.phone || '').replace(/"/g, '""')}"`,
        `"${(f.email || '').replace(/"/g, '""')}"`,
        `"${(d.passport_number || '').replace(/"/g, '""')}"`,
        `"${(d.nationality || '').replace(/"/g, '""')}"`,
        `"${(d.airline || '').replace(/"/g, '""')}"`,
        `"${(d.flight_no || '').replace(/"/g, '""')}"`,
        `"${(d.from || '').replace(/"/g, '""')}"`,
        `"${(d.to || f.destination || '').replace(/"/g, '""')}"`,
        `"${(d.departDate || d.departure_time || '').replace(/"/g, '""')}"`,
        `"${(d.returnDate || '').replace(/"/g, '""')}"`,
        `"${(d.cabinClass || '').replace(/"/g, '""')}"`,
        `"${d.passengers || 1}"`,
        `"${(d.pnr || '').replace(/"/g, '""')}"`,
        `"${(d.ticket_deadline || '').replace(/"/g, '""')}"`,
        `"${(d.fare || '').replace(/"/g, '""')}"`,
        `"${f.status}"`,
        `"${(f.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HorizonMove_Flight_Bookings_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onSuccessToast) {
      onSuccessToast(`Exported ${filteredFlights.length} flight records to CSV.`);
    }
  };

  // 5. Direct browser print trigger
  const handleDirectPrint = (flight: LeadSubmission) => {
    setPreviewFlight(flight);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Flight Desk Hero & Action Toolbar */}
      <div className="bg-gradient-to-r from-[#142642] via-[#0f1f38] to-[#0a1628] border-2 border-[#CFAE70]/50 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CFAE70]/20 border border-[#CFAE70] flex items-center justify-center text-[#E4C88E] shadow-inner">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold font-serif-luxury text-white">
                  Customer Flight Bookings & PNR Desk
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CFAE70]/20 text-[#E4C88E] border border-[#CFAE70]/40 uppercase tracking-wider">
                  Amadeus · Verteil NDC · GDS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Dedicated flight management desk with instant passenger manifest & printable e-ticket downloads.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={exportAllFlightsCSV}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] border border-[#CFAE70]/50 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
            title="Download CSV spreadsheet for all customer flight records"
          >
            <Download className="w-4 h-4 text-[#CFAE70]" />
            <span>Export Flights CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Total Flight Bookings</span>
            <Plane className="w-4 h-4 text-[#1B365D]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1B365D]">{totalFlights}</div>
          <p className="text-[10px] text-slate-500">Inquiries & confirmed seats</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-300 shadow-sm space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Live PNRs Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{pnrConfirmedCount}</div>
          <p className="text-[10px] text-emerald-700/80">Active airline booking codes</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">New / Awaiting Action</span>
            <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{newRequestsCount}</div>
          <p className="text-[10px] text-amber-700/80">Pending payment or call</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Tickets Issued</span>
            <Ticket className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">{ticketedCount}</div>
          <p className="text-[10px] text-purple-700/80">Enrolled & travel ready</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passenger name, PNR, passport number, airline, phone, route..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#CFAE70] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  typeFilter === 'all' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                All Flights ({flightSubmissions.length})
              </button>
              <button
                onClick={() => setTypeFilter('pnr_confirmed')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  typeFilter === 'pnr_confirmed' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Confirmed PNRs ({pnrConfirmedCount})
              </button>
              <button
                onClick={() => setTypeFilter('inquiries')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  typeFilter === 'inquiries' ? 'bg-[#1B365D] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                General Inquiries ({flightSubmissions.length - pnrConfirmedCount})
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">🔴 New / Uncontacted</option>
              <option value="contacted">🟡 Contacted</option>
              <option value="in_progress">🔵 In Progress</option>
              <option value="enrolled">🟢 Ticket Issued</option>
              <option value="closed">⚪ Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredFlights.length}</strong> of {totalFlights} customer flight bookings</span>
          <span className="text-[11px] text-slate-400">All customer itinerary files are downloadable in 1 click (PDF / .txt / .json)</span>
        </div>
      </div>

      {/* Flight Submissions List */}
      {filteredFlights.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Plane className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No flight bookings found matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or status filter, or test reserving a flight from the public booking desk.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFlights.map((flight) => {
            const details = flight.details || {};
            const pnr = details.pnr;
            const hasPnr = Boolean(pnr);
            const airlineName = details.airline || 'Scheduled Carrier';
            const flightNo = details.flight_no || 'TBA';
            const fromCode = details.from || 'Origin';
            const toCode = details.to || flight.destination || 'Destination';
            const fare = details.fare || 'Fare On Request';
            const deadline = details.ticket_deadline;

            const dateStr = new Date(flight.submittedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Status Badge
            const statusBadge = {
              new: { bg: 'bg-rose-100 text-rose-800 border-rose-300', label: 'New Lead' },
              contacted: { bg: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Contacted' },
              in_progress: { bg: 'bg-blue-100 text-blue-800 border-blue-300', label: 'In Progress' },
              enrolled: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: 'Ticket Issued' },
              closed: { bg: 'bg-slate-100 text-slate-700 border-slate-300', label: 'Closed' }
            }[flight.status] || { bg: 'bg-slate-100 text-slate-700 border-slate-300', label: flight.status };

            // WhatsApp link
            const cleanPhone = flight.phone.replace(/[^0-9]/g, '');
            const waTarget = cleanPhone.startsWith('234') ? cleanPhone : cleanPhone.startsWith('0') ? `234${cleanPhone.substring(1)}` : cleanPhone;
            const waHref = `https://wa.me/${waTarget}?text=${encodeURIComponent(
              `Hello ${flight.fullName}, this is Horizon Move Limited Ticketing Desk regarding your flight booking (${fromCode} ➔ ${toCode}${pnr ? `, PNR: ${pnr}` : ''}). We have your itinerary ready.`
            )}`;

            return (
              <div 
                key={flight.id}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
              >
                {/* PNR Top Color Bar */}
                {hasPnr && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745]" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1B365D]/10 border border-[#1B365D]/20 text-[#1B365D] font-bold flex items-center justify-center text-sm shrink-0">
                      <Plane className="w-5 h-5 text-[#1B365D]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">
                          {flight.fullName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                        {hasPnr && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#142642] text-[#E4C88E] border border-[#CFAE70]/40">
                            PNR: {pnr}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#B8934C] font-semibold">
                        {airlineName} {flightNo ? `• ${flightNo}` : ''} • {fromCode} ➔ {toCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Passenger & Flight Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact & Passenger</span>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-[#B8934C]" />
                      <span>{flight.phone}</span>
                    </div>
                    {flight.email && (
                      <div className="text-slate-600 flex items-center gap-1.5 mt-0.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{flight.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Route & Cabin</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {fromCode} ➔ {toCode}
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      {details.cabinClass || 'Economy'} • {details.passengers || 1} Passenger(s)
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fare & Quoted Amount</span>
                    <div className="font-bold text-emerald-700 text-sm mt-0.5">
                      {fare}
                    </div>
                    {deadline && (
                      <div className="text-[11px] text-rose-600 font-medium mt-0.5 truncate">
                        Deadline: {deadline}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passport & Identity</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {details.passport_number ? `Passport: ${details.passport_number}` : 'Passport: Pending Entry'}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {details.nationality ? `Nat: ${details.nationality}` : 'Nigeria (NG)'}
                    </div>
                  </div>
                </div>

                {/* Counselor Notes */}
                {flight.notes && (
                  <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl">
                    <span className="font-bold">Staff Notes:</span> {flight.notes}
                  </div>
                )}

                {/* Action Toolbar with Dedicated Downloads for EVERY Customer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={flight.status}
                      onChange={(e) => handleStatusChange(flight.id, e.target.value as LeadStatus)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="new">🔴 New Lead</option>
                      <option value="contacted">🟡 Contacted</option>
                      <option value="in_progress">🔵 In Progress</option>
                      <option value="enrolled">🟢 Ticket Issued</option>
                      <option value="closed">⚪ Closed</option>
                    </select>
                  </div>

                  {/* Customer Download Actions & Tools */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {/* 1. Download Official E-Ticket / Itinerary Slip (PDF) */}
                    <button
                      type="button"
                      onClick={() => downloadCustomerTicketPdf(flight)}
                      className="inline-flex items-center gap-1.5 bg-[#142642] hover:bg-[#1B365D] text-[#E4C88E] border border-[#CFAE70]/50 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm cursor-pointer"
                      title="Download official printable PDF itinerary slip (.pdf)"
                    >
                      <Download className="w-3.5 h-3.5 text-[#CFAE70]" />
                      <span>Download PDF Itinerary</span>
                    </button>

                    {/* 2. Download Text Passenger Manifest */}
                    <button
                      type="button"
                      onClick={() => downloadCustomerManifestTxt(flight)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                      title="Download passenger manifest (.txt)"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Manifest .TXT</span>
                    </button>

                    {/* 3. Preview & Print E-Ticket Slip */}
                    <button
                      type="button"
                      onClick={() => setPreviewFlight(flight)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                      title="Preview printable ticket on screen"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Print / View</span>
                    </button>

                    {/* 4. WhatsApp Client */}
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
                      title="Send WhatsApp confirmation to passenger"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>

                    {/* 5. Call Passenger */}
                    <a
                      href={`tel:${flight.phone}`}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold p-1.5 rounded-lg text-xs transition-all"
                      title="Call passenger"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* 6. Edit Notes */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFlight(flight);
                        setNoteInput(flight.notes || '');
                      }}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                      title="Add or update counselor notes"
                    >
                      <span>Notes</span>
                    </button>

                    {/* 7. Delete Record */}
                    <button
                      type="button"
                      onClick={() => initiateDelete(flight.id, flight.fullName, flight.details?.pnr)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete flight record"
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

      {/* MODAL 1: PREVIEW & PRINTABLE E-TICKET ITINERARY SLIP */}
      {previewFlight && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setPreviewFlight(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#CFAE70]" />
                <h3 className="text-lg font-bold text-[#1B365D] font-serif-luxury">
                  Customer E-Ticket & Itinerary Slip
                </h3>
              </div>
              <button 
                onClick={() => setPreviewFlight(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Itinerary Preview Body */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-5 bg-slate-50/50">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-extrabold text-[#142642] text-base">HORIZON MOVE LIMITED</h4>
                  <p className="text-xs text-slate-500">RC: {RC_NUMBER} • {OFFICE_ADDRESS_FULL}</p>
                  <p className="text-xs text-slate-500">Tel: {PRIMARY_PHONE} • {EMAIL_ADDRESS}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Airline PNR</span>
                  <span className="text-xl font-extrabold font-mono text-[#1B365D]">
                    {previewFlight.details?.pnr || 'NOT_ISSUED'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Passenger Full Name</span>
                  <span className="text-sm font-bold text-slate-900">{previewFlight.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Passport Number</span>
                  <span className="text-sm font-bold text-slate-900">{previewFlight.details?.passport_number || 'On File'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Contact Phone</span>
                  <span className="font-semibold text-slate-800">{previewFlight.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Contact Email</span>
                  <span className="font-semibold text-slate-800">{previewFlight.email || 'N/A'}</span>
                </div>
              </div>

              {/* Route */}
              <div className="bg-[#142642] text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-[#E4C88E]">{previewFlight.details?.from || 'LOS'}</div>
                  <div className="text-[11px] text-slate-300">Departure Schedule</div>
                  <div className="text-xs font-semibold mt-1">{previewFlight.details?.departure_time || previewFlight.details?.departDate || 'Confirmed'}</div>
                </div>
                <div className="text-center px-4">
                  <Plane className="w-6 h-6 text-[#CFAE70] mx-auto rotate-90" />
                  <div className="text-[10px] text-slate-300 mt-1">{previewFlight.details?.airline || 'Scheduled Flight'}</div>
                  <div className="text-[10px] font-mono text-[#E4C88E]">{previewFlight.details?.flight_no || 'TBA'}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#E4C88E]">{previewFlight.details?.to || previewFlight.destination || 'LHR'}</div>
                  <div className="text-[11px] text-slate-300">Destination Arrival</div>
                  <div className="text-xs font-semibold mt-1">{previewFlight.details?.returnDate || 'Direct Schedule'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Quoted Fare</span>
                  <span className="text-base font-bold text-emerald-700">{previewFlight.details?.fare || 'On File'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Baggage Allowance</span>
                  <span className="text-sm font-semibold text-slate-800">2 Pieces x 23kg Checked Bags</span>
                </div>
              </div>

              {previewFlight.notes && (
                <div className="text-xs p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <strong>Booking Notes:</strong> {previewFlight.notes}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadCustomerTicketPdf(previewFlight)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  title="Download official PDF itinerary slip (.pdf)"
                >
                  <Download className="w-4 h-4 text-[#CFAE70]" />
                  <span>Download PDF Itinerary</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadCustomerManifestTxt(previewFlight)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Manifest .TXT</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = previewFlight;
                    setPreviewFlight(null);
                    initiateDelete(target.id, target.fullName, target.details?.pnr);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  title="Delete this flight booking"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewFlight(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STAFF NOTES */}
      {editingFlight && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setEditingFlight(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-bold text-base text-[#1B365D]">
                Ticketing Notes - {editingFlight.fullName}
              </h4>
              <button 
                onClick={() => setEditingFlight(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">
                Record Payment Confirmation, 13-Digit E-Ticket Number, or Flight Adjustments:
              </label>
              <textarea
                rows={4}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="e.g. Payment of ₦1,850,000 received into GTBank. Ticket issued: 125-9482910482 on British Airways."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingFlight(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1B365D] text-[#F3E5AB] hover:bg-[#254877] shadow cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE FLIGHT RECORD CONFIRMATION */}
      {flightToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFlightToDelete(null)}
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
                Delete Flight Booking?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                Are you sure you want to permanently remove the flight booking for <strong>{flightToDelete.name}</strong>
                {flightToDelete.pnr ? ` (PNR: ${flightToDelete.pnr})` : ''}? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setFlightToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteFlight}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm cursor-pointer text-center"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
