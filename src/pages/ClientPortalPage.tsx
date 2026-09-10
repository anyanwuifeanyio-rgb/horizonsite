import React, { useState, useEffect } from 'react';
import { PageType, UserProfile, DispatchedEmail } from '../types';
import { 
  getCurrentUser, 
  loginUser, 
  registerUser, 
  logoutUser, 
  updateUserProfile,
  requestPasswordReset,
  verifyAndResetPassword
} from '../utils/auth';
import { 
  getSubmissions, 
  LeadSubmission 
} from '../utils/submissions';
import { 
  sendFlightItineraryEmail, 
  sendInvoiceEmail,
  sendPaymentReceiptEmail,
  sendAccountWelcomeEmail,
  sendPasswordResetEmail,
  getLocalDispatchedEmails, 
  sendInquiryConfirmationEmail 
} from '../utils/emailService';
import { generateItineraryPDF, generatePaymentReceiptPdf } from '../utils/pdfGenerator';
import { formatFullRoute } from '../data/airportsData';
import { PaystackPaymentModal } from '../components/PaystackPaymentModal';
import { 
  PRIMARY_PHONE, 
  EMAIL_ADDRESS, 
  OFFICE_ADDRESS_FULL 
} from '../utils/whatsapp';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Plane, 
  Download, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Calendar, 
  Copy, 
  LogOut, 
  ShieldCheck, 
  Globe, 
  Compass, 
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
  Inbox,
  Receipt,
  CreditCard,
  KeyRound,
  Check,
  ExternalLink
} from 'lucide-react';

interface ClientPortalPageProps {
  onNavigate: (page: PageType) => void;
  onSuccessToast?: (msg: string) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({
  onNavigate,
  onSuccessToast
}) => {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Auth Form Fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passportInput, setPassportInput] = useState('');
  const [nationalityInput, setNationalityInput] = useState('Nigerian (NG)');
  const [authError, setAuthError] = useState<string | null>(null);

  // Forgot Password state
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  // Portal Tabs
  const [activeTab, setActiveTab] = useState<'flights' | 'inquiries' | 'emails' | 'profile'>('flights');

  // Data
  const [submissions, setSubmissions] = useState<LeadSubmission[]>([]);
  const [dispatchedEmails, setDispatchedEmails] = useState<DispatchedEmail[]>([]);
  const [selectedEmailPreview, setSelectedEmailPreview] = useState<DispatchedEmail | null>(null);
  const [selectedTicketSlip, setSelectedTicketSlip] = useState<LeadSubmission | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);
  const [selectedBookingForPaystack, setSelectedBookingForPaystack] = useState<LeadSubmission | null>(null);
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);

  // Edit Profile fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassport, setEditPassport] = useState('');
  const [editNationality, setEditNationality] = useState('');

  // Load user data
  useEffect(() => {
    const loadData = () => {
      const u = getCurrentUser();
      setUser(u);
      if (u) {
        setEditName(u.fullName);
        setEditPhone(u.phone);
        setEditPassport(u.passportNumber || '');
        setEditNationality(u.nationality || 'Nigerian (NG)');
      }

      const allSubs = getSubmissions();
      setSubmissions(allSubs);

      const localEmails = getLocalDispatchedEmails();
      setDispatchedEmails(localEmails);
    };

    loadData();

    const handleAuthChange = (e: any) => {
      setUser(e.detail);
      loadData();
    };

    const handleEmailDispatched = () => {
      setDispatchedEmails(getLocalDispatchedEmails());
    };

    window.addEventListener('horizon_auth_changed', handleAuthChange);
    window.addEventListener('horizon_email_dispatched', handleEmailDispatched);
    return () => {
      window.removeEventListener('horizon_auth_changed', handleAuthChange);
      window.removeEventListener('horizon_email_dispatched', handleEmailDispatched);
    };
  }, []);

  // Fetch server emails for this user if available
  useEffect(() => {
    if (!user) return;
    fetch(`/api/emails?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.emails && Array.isArray(data.emails)) {
          // Merge with local emails
          const local = getLocalDispatchedEmails();
          const combined = [...data.emails, ...local.filter(l => !data.emails.some((s: any) => s.id === l.id))];
          setDispatchedEmails(combined);
        }
      })
      .catch(() => {
        // Fallback to local
      });
  }, [user]);

  // Auth Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput || !passwordInput) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    const res = loginUser(emailInput, passwordInput);
    if (res.success && res.user) {
      setUser(res.user);
      onSuccessToast?.(`Welcome back, ${res.user.fullName}!`);
    } else {
      setAuthError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!fullNameInput || !emailInput || !phoneInput || !passwordInput) {
      setAuthError('Please fill in all required fields (Name, Email, Phone, Password).');
      return;
    }

    const res = registerUser({
      fullName: fullNameInput,
      email: emailInput,
      phone: phoneInput,
      password: passwordInput,
      passportNumber: passportInput,
      nationality: nationalityInput
    });

    if (res.success && res.user) {
      setUser(res.user);
      onSuccessToast?.(`Account created successfully! Welcome, ${res.user.fullName}.`);
    } else {
      setAuthError(res.message || 'Registration failed.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    onSuccessToast?.('You have been signed out.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile({
      fullName: editName,
      phone: editPhone,
      passportNumber: editPassport,
      nationality: editNationality
    });
    if (updated) {
      setUser(updated);
      onSuccessToast?.('Profile updated successfully.');
    }
  };

  // Filter submissions belonging to this user (by email or phone)
  const userBookings = submissions.filter(s => {
    if (!user) return false;
    const emailMatch = s.email?.toLowerCase().trim() === user.email.toLowerCase().trim();
    const phoneMatch = s.phone?.replace(/[^0-9]/g, '') === user.phone?.replace(/[^0-9]/g, '');
    const isFlight = s.type === 'flight_booking' || s.service?.toLowerCase().includes('flight') || s.details?.pnr;
    return (emailMatch || phoneMatch) && isFlight;
  });

  const userInquiries = submissions.filter(s => {
    if (!user) return false;
    const emailMatch = s.email?.toLowerCase().trim() === user.email.toLowerCase().trim();
    const phoneMatch = s.phone?.replace(/[^0-9]/g, '') === user.phone?.replace(/[^0-9]/g, '');
    const isFlight = s.type === 'flight_booking' || s.service?.toLowerCase().includes('flight') || s.details?.pnr;
    return (emailMatch || phoneMatch) && !isFlight;
  });

  const userEmails = dispatchedEmails.filter(e => {
    if (!user) return false;
    return e.to.toLowerCase().trim() === user.email.toLowerCase().trim();
  });

  // Action: Copy PNR
  const handleCopyPnr = (pnr: string) => {
    navigator.clipboard.writeText(pnr);
    setCopiedPnr(pnr);
    setTimeout(() => setCopiedPnr(null), 2500);
    onSuccessToast?.(`Airline PNR "${pnr}" copied to clipboard.`);
  };

  // Action: Download PDF Ticket
  const handleDownloadPdf = (flight: LeadSubmission) => {
    const d = flight.details || {};
    const pnr = d.pnr || 'PNR-ACTIVE';
    generateItineraryPDF({
      pnr,
      bookingReference: d.booking_reference || `HORIZON-${pnr}`,
      carrier: d.carrier,
      airlineName: d.airline || 'Scheduled Carrier',
      flightNo: d.flight_no || 'TBA',
      from: d.from || 'Origin',
      to: d.to || flight.destination || 'Destination',
      departureTime: d.departDate || d.departure_time || 'Schedule Confirmed',
      arrivalTime: d.arrivalTime || d.arrival_time || 'Arrival Confirmed',
      fare: d.fare || 'Standard Tariff',
      ticketDeadline: d.ticket_deadline || '24-48 Hours',
      passengerName: flight.fullName,
      phone: flight.phone,
      email: flight.email,
      passportNumber: d.passport_number || user?.passportNumber || 'On File',
      nationality: d.nationality || user?.nationality || 'Nigerian (NG)',
      cabinClass: d.cabinClass || 'Economy Class'
    });
    onSuccessToast?.(`PDF Itinerary downloaded for PNR ${pnr}.`);
  };

  // Action: Email Itinerary
  const handleEmailItinerary = async (flight: LeadSubmission) => {
    if (!user) return;
    const d = flight.details || {};
    const pnr = d.pnr || 'PNR-ACTIVE';
    setSendingEmailId(flight.id);

    try {
      const result = await sendFlightItineraryEmail({
        to: user.email,
        passengerName: flight.fullName || user.fullName,
        pnr,
        bookingReference: d.booking_reference || `HORIZON-${pnr}`,
        airlineName: d.airline || 'Commercial Airline',
        flightNo: d.flight_no || 'TBA',
        from: d.from || 'Origin Airport',
        toCode: d.to || flight.destination || 'Destination Airport',
        departureTime: d.departDate || d.departure_time || 'Flight Departure',
        arrivalTime: d.arrivalTime || d.arrival_time || 'Flight Arrival',
        fare: d.fare || 'Fare on File',
        ticketDeadline: d.ticket_deadline || '24-48 Hours from Reservation',
        phone: flight.phone || user.phone,
        passportNumber: d.passport_number || user.passportNumber,
        nationality: d.nationality || user.nationality,
        cabinClass: d.cabinClass || 'Economy Class'
      });

      onSuccessToast?.(`Itinerary for PNR ${pnr} emailed to ${user.email}!`);
      // Switch to emails tab or update count
      setDispatchedEmails(getLocalDispatchedEmails());
    } catch (err) {
      console.error(err);
      onSuccessToast?.('Could not send email. Please check internet connection.');
    } finally {
      setSendingEmailId(null);
    }
  };

  // Action: Email Commercial Invoice
  const handleEmailInvoice = async (flight: LeadSubmission) => {
    if (!user) return;
    const d = flight.details || {};
    const pnr = d.pnr || 'HZ9201';
    const fare = d.fare || '₦1,850,000';
    const airline = d.airline || 'Commercial Airline';
    const route = formatFullRoute(d.from || 'LOS', d.to || flight.destination || 'LHR');
    setSendingEmailId(`inv-${flight.id}`);

    try {
      await sendInvoiceEmail({
        to: user.email,
        clientName: flight.fullName || user.fullName,
        invoiceNumber: `INV-${new Date().getFullYear()}-${pnr}`,
        issueDate: new Date().toLocaleDateString('en-GB'),
        dueDate: 'Within 24 Hours',
        totalAmount: fare,
        items: [
          { description: `Guaranteed Airfare (${airline} Route: ${route})`, amount: fare },
          { description: 'Aviation Taxes, Fuel Surcharges & Passenger Security Fees', amount: 'Included' },
          { description: 'Standard Baggage (2 x 23kg Checked Bags + 7kg Cabin)', amount: 'Included' }
        ],
        pnr
      });
      onSuccessToast?.(`Commercial Invoice dispatched to ${user.email}!`);
      setDispatchedEmails(getLocalDispatchedEmails());
    } catch (err) {
      console.error('Invoice dispatch error:', err);
      onSuccessToast?.('Could not dispatch invoice email.');
    } finally {
      setSendingEmailId(null);
    }
  };

  // Action: Email Official Payment Receipt
  const handleEmailReceipt = async (flight: LeadSubmission) => {
    if (!user) return;
    const d = flight.details || {};
    const pnr = d.pnr || 'HZ9201';
    const fare = d.fare || '₦1,850,000';
    const airline = d.airline || 'Commercial Airline';
    setSendingEmailId(`rec-${flight.id}`);

    try {
      await sendPaymentReceiptEmail({
        to: user.email,
        clientName: flight.fullName || user.fullName,
        receiptNumber: `RCT-${new Date().getFullYear()}-${pnr}`,
        amountPaid: fare,
        paymentMethod: 'Direct Bank Settlement (Zenith / Stanbic IBTC)',
        paymentDate: new Date().toLocaleDateString('en-GB'),
        serviceDescription: `Confirmed Electronic Ticket Issuance (${airline}, PNR: ${pnr})`,
        transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}-${pnr}`,
        pnr
      });
      onSuccessToast?.(`Official Payment Receipt dispatched to ${user.email}!`);
      setDispatchedEmails(getLocalDispatchedEmails());
    } catch (err) {
      console.error('Receipt dispatch error:', err);
      onSuccessToast?.('Could not dispatch receipt email.');
    } finally {
      setSendingEmailId(null);
    }
  };

  // Password reset handlers
  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!forgotEmail) {
      setAuthError('Please enter your account email address.');
      return;
    }
    setIsResetSubmitting(true);
    const res = requestPasswordReset(forgotEmail);
    setIsResetSubmitting(false);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      setForgotStep('verify');
      setResetMessage(res.message);
      onSuccessToast?.('Password reset code dispatched to your email!');
    }
  };

  const handleVerifyReset = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!resetCodeInput || !newPasswordInput) {
      setAuthError('Please enter the 6-digit verification code and new password.');
      return;
    }
    setIsResetSubmitting(true);
    const res = verifyAndResetPassword(forgotEmail, resetCodeInput, newPasswordInput);
    setIsResetSubmitting(false);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      onSuccessToast?.('Password updated! You can now sign in.');
      setAuthMode('login');
      setEmailInput(forgotEmail);
      setPasswordInput('');
      setForgotStep('request');
      setResetMessage(null);
      setResetCodeInput('');
      setNewPasswordInput('');
    }
  };

  // Dispatch sample test emails for Resend template verification
  const handleSendSampleWelcome = async () => {
    if (!user) return;
    setSendingEmailId('test-welcome');
    await sendAccountWelcomeEmail({
      email: user.email,
      fullName: user.fullName,
      accountId: user.id,
      memberTier: user.memberTier || 'Standard Traveler',
      phone: user.phone
    });
    setSendingEmailId(null);
    setDispatchedEmails(getLocalDispatchedEmails());
    onSuccessToast?.(`Welcome email dispatched to ${user.email}!`);
    setActiveTab('emails');
  };

  const handleSendSampleInvoice = async () => {
    if (!user) return;
    setSendingEmailId('test-invoice');
    await sendInvoiceEmail({
      to: user.email,
      clientName: user.fullName,
      invoiceNumber: `INV-${new Date().getFullYear()}-SAMPLE`,
      issueDate: new Date().toLocaleDateString('en-GB'),
      dueDate: 'Within 24 Hours',
      totalAmount: '₦1,850,000',
      items: [
        { description: 'Qatar Airways Economy Classic Airfare (LOS ➔ LHR)', amount: '₦1,650,000' },
        { description: 'NCAA Passenger Service Charge & Aviation Security Fees', amount: '₦120,000' },
        { description: 'Express Electronic Ticket Issuance & PNR Hold', amount: '₦80,000' }
      ],
      pnr: 'SAMPLE-INV'
    });
    setSendingEmailId(null);
    setDispatchedEmails(getLocalDispatchedEmails());
    onSuccessToast?.(`Commercial Invoice dispatched to ${user.email}!`);
    setActiveTab('emails');
  };

  const handleSendSampleReceipt = async () => {
    if (!user) return;
    setSendingEmailId('test-receipt');
    await sendPaymentReceiptEmail({
      to: user.email,
      clientName: user.fullName,
      receiptNumber: `RCT-${new Date().getFullYear()}-SAMPLE`,
      amountPaid: '₦1,850,000',
      paymentMethod: 'Direct Bank Settlement (Zenith Bank PLC)',
      paymentDate: new Date().toLocaleDateString('en-GB'),
      serviceDescription: 'Payment Cleared — Confirmed Electronic Ticket Issued',
      transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}-VERIFIED`,
      pnr: 'SAMPLE-RCT'
    });
    setSendingEmailId(null);
    setDispatchedEmails(getLocalDispatchedEmails());
    onSuccessToast?.(`Payment Receipt dispatched to ${user.email}!`);
    setActiveTab('emails');
  };

  const handleSendSampleReset = async () => {
    if (!user) return;
    setSendingEmailId('test-reset');
    await sendPasswordResetEmail({
      email: user.email,
      fullName: user.fullName,
      resetCode: '748291',
      expiryMinutes: 30
    });
    setSendingEmailId(null);
    setDispatchedEmails(getLocalDispatchedEmails());
    onSuccessToast?.(`Password Reset test email dispatched to ${user.email}!`);
    setActiveTab('emails');
  };

  // Send a test sample itinerary to email
  const handleSendTestItinerary = async () => {
    if (!user) return;
    setSendingEmailId('test');
    const testPnr = `HZ${Math.floor(1000 + Math.random() * 9000)}`;

    await sendFlightItineraryEmail({
      to: user.email,
      passengerName: user.fullName,
      pnr: testPnr,
      bookingReference: `HORIZON-${testPnr}`,
      airlineName: 'Qatar Airways',
      flightNo: 'QR 1408',
      from: 'Lagos (LOS)',
      toCode: 'London Heathrow (LHR)',
      departureTime: '14:30 (Scheduled)',
      arrivalTime: '21:15 (Scheduled)',
      fare: '₦1,850,000',
      ticketDeadline: '24 Hours from now',
      phone: user.phone,
      passportNumber: user.passportNumber || 'A12948201',
      nationality: user.nationality || 'Nigerian (NG)',
      cabinClass: 'Economy Classic'
    });

    setSendingEmailId(null);
    setDispatchedEmails(getLocalDispatchedEmails());
    onSuccessToast?.(`Sample Itinerary sent to ${user.email}! Check the "Received Emails" tab below.`);
    setActiveTab('emails');
  };

  // =========================================================================
  // VIEW 1: AUTH SCREEN (LOGIN / REGISTER / FORGOT)
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#142642] via-[#1B365D] to-[#0d1b2a] flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#CFAE70]/20 border border-[#CFAE70]/40 px-3.5 py-1 rounded-full text-xs font-bold text-[#F3E5AB] tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CFAE70]" />
              Client Portal & Itinerary Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury tracking-tight">
              Manage Your Travels & Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Access your flight bookings, download official PDF tickets, and receive your live itineraries in your email.
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#CFAE70]/30 space-y-5">
            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); setResetMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#1B365D] text-[#F3E5AB] shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(null); setResetMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#1B365D] text-[#F3E5AB] shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('forgot'); setAuthError(null); setResetMessage(null); setForgotEmail(emailInput || ''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  authMode === 'forgot'
                    ? 'bg-[#1B365D] text-[#F3E5AB] shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reset
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{authError}</span>
              </div>
            )}

            {resetMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{resetMessage}</span>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. anyanwuifeanyio@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setForgotEmail(emailInput || '');
                        setAuthError(null);
                        setResetMessage(null);
                      }}
                      className="text-[11px] text-[#1B365D] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#1B365D] to-[#142642] hover:brightness-110 text-[#F3E5AB] font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#CFAE70]/40"
                >
                  <Lock className="w-4 h-4 text-[#CFAE70]" />
                  <span>Sign In & View My Bookings</span>
                </button>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Legal Name (as in Passport) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      placeholder="e.g. Chukwuemeka Okafor"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Phone <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+234 80 000 0000"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Passport Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={passportInput}
                      onChange={(e) => setPassportInput(e.target.value)}
                      placeholder="e.g. A12984920"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={nationalityInput}
                      onChange={(e) => setNationalityInput(e.target.value)}
                      placeholder="Nigerian (NG)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold rounded-xl text-xs sm:text-sm shadow-md hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Send Welcome Email</span>
                </button>
              </form>
            )}

            {/* 3. FORGOT / RESET PASSWORD FORM */}
            {authMode === 'forgot' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {forgotStep === 'request' ? 'Reset Account Password' : 'Enter 6-Digit Code'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {forgotStep === 'request'
                      ? 'Enter your registered email address and we will dispatch a secure 6-digit verification code via Resend.'
                      : `We sent a code to ${forgotEmail}. Enter it below with your new password.`}
                  </p>
                </div>

                {forgotStep === 'request' ? (
                  <form onSubmit={handleRequestReset} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registered Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isResetSubmitting}
                      className="w-full py-2.5 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] font-bold rounded-xl text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5 text-[#CFAE70]" />
                      <span>{isResetSubmitting ? 'Dispatching Code...' : 'Send Verification Code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="w-full py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyReset} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        6-Digit Verification Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={resetCodeInput}
                        onChange={(e) => setResetCodeInput(e.target.value)}
                        placeholder="e.g. 748291"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-center tracking-widest font-mono text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        New Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isResetSubmitting}
                      className="w-full py-2.5 bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold rounded-xl text-xs shadow hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isResetSubmitting ? 'Updating...' : 'Set New Password & Log In'}</span>
                    </button>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => setForgotStep('request')}
                        className="text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Resend code
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-[#1B365D] font-semibold hover:underline cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-400">
            Need urgent assistance? Call our desk at <strong className="text-[#E4C88E]">{PRIMARY_PHONE}</strong>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED IN CLIENT PORTAL
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Banner & User Greeting */}
      <div className="bg-gradient-to-r from-[#142642] via-[#1B365D] to-[#0c182b] text-white border-b border-[#CFAE70]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CFAE70] to-[#A98745] text-[#1B365D] flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-white/20 shrink-0">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-tight text-white">
                    {user.fullName}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-[#CFAE70]/20 text-[#E4C88E] border border-[#CFAE70]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    <ShieldCheck className="w-3 h-3 text-[#CFAE70]" />
                    {user.memberTier || 'Verified Traveler'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                  <span>✉️ {user.email}</span>
                  <span>📞 {user.phone}</span>
                  {user.passportNumber && <span>🛂 {user.passportNumber}</span>}
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('travel-bookings')}
                className="bg-[#CFAE70] hover:bg-[#E4C88E] text-[#1B365D] font-bold px-4 py-2 rounded-xl text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Book New Flight</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestItinerary}
                disabled={sendingEmailId === 'test'}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                title="Send a sample official itinerary to your email inbox"
              >
                <Send className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span>{sendingEmailId === 'test' ? 'Sending...' : 'Test Itinerary Email'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 pt-6 mt-6 border-t border-white/10 no-scrollbar">
            <button
              onClick={() => setActiveTab('flights')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'flights'
                  ? 'bg-white text-[#1B365D] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>My Flight Bookings & E-Tickets ({userBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'emails'
                  ? 'bg-white text-[#1B365D] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Received Emails & Outbox ({userEmails.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-white text-[#1B365D] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Applications & Consultations ({userInquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-white text-[#1B365D] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Travel Documents</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: FLIGHT BOOKINGS */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-[#1B365D] font-serif-luxury">
                  Your Flight Reservations & Itineraries
                </h2>
                <p className="text-xs text-slate-500">
                  Every booking contains a verifiable airline PNR. You can download the PDF itinerary slip or have it emailed to your inbox.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('travel-bookings')}
                className="inline-flex items-center gap-2 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Search & Book Another Flight</span>
              </button>
            </div>

            {userBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Plane className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">No flight bookings found for this account</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Bookings made with your email (<strong>{user.email}</strong>) or phone number will automatically appear here with verified PNR codes.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('travel-bookings')}
                    className="bg-[#1B365D] text-[#F3E5AB] font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow cursor-pointer"
                  >
                    Go to Flight Booking Desk
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTestItinerary}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer border border-slate-200"
                  >
                    Generate Sample Flight Ticket
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {userBookings.map((flight) => {
                  const d = flight.details || {};
                  const pnr = d.pnr || 'PNR-ACTIVE';
                  const airline = d.airline || 'Commercial Airline';
                  const flightNo = d.flight_no || 'TBA';
                  const from = d.from || 'Origin';
                  const to = d.to || flight.destination || 'Destination';
                  const departDate = d.departDate || d.departure_time || 'Confirmed Schedule';
                  const arrivalTime = d.arrivalTime || d.arrival_time || 'Confirmed Arrival';
                  const fare = d.fare || 'Fare on File';
                  const cabin = d.cabinClass || 'Economy Class';
                  const deadline = d.ticket_deadline || '24-48 Hours';
                  const isPaid = d.payment_status === 'paid' || flight.status === 'enrolled' || flight.status === 'completed';

                  return (
                    <div 
                      key={flight.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Card Header Strip */}
                      <div className="bg-gradient-to-r from-[#142642] to-[#1B365D] text-white px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#CFAE70]/20 border border-[#CFAE70]/40 flex items-center justify-center text-[#E4C88E] font-bold">
                            <Plane className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-300">
                              {airline} • Flight {flightNo}
                            </div>
                            <div className="text-sm font-bold text-white font-serif-luxury">
                              {formatFullRoute(from, to)}
                            </div>
                          </div>
                        </div>

                        {/* PNR Box */}
                        <div className="flex items-center gap-2 bg-black/40 border border-[#CFAE70]/50 px-3 py-1.5 rounded-xl">
                          <div className="text-[10px] text-[#CFAE70] uppercase font-bold tracking-wider">
                            PNR:
                          </div>
                          <div className="text-sm font-mono font-extrabold text-[#F3E5AB] tracking-wider">
                            {pnr}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyPnr(pnr)}
                            className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Copy PNR Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedPnr === pnr && (
                            <span className="text-[10px] text-emerald-300 font-bold">Copied!</span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-100">
                          <div>
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Passenger Name</div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{flight.fullName}</div>
                          </div>

                          <div>
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Departure Schedule</div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{departDate}</div>
                          </div>

                          <div>
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Cabin Class</div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{cabin}</div>
                          </div>

                          <div>
                            <div className="text-[11px] text-slate-400 font-semibold uppercase">Quoted Fare</div>
                            <div className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-0.5">{fare}</div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {isPaid ? (
                              <>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Paid in Full • Ticket Issued</span>
                                </span>
                                {d.payment_reference && (
                                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                    Paystack Ref: {d.payment_reference}
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Payment Pending</span>
                                </span>
                                <span className="text-xs text-slate-500">
                                  Pay Before: <strong className="text-rose-600">{deadline}</strong>
                                </span>
                              </>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Pay with Paystack (if pending) */}
                            {!isPaid && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBookingForPaystack(flight);
                                  setIsPaystackModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 bg-[#00C3F7] hover:bg-[#00B0DE] text-[#081326] font-black px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer active:scale-95"
                                title="Pay securely online with Paystack"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Pay with Paystack</span>
                              </button>
                            )}

                            {/* Download Receipt (if paid) */}
                            {isPaid && (
                              <button
                                type="button"
                                onClick={() => {
                                  generatePaymentReceiptPdf({
                                    receiptNumber: `RCP-${flight.id.slice(-6)}`,
                                    transactionRef: d.payment_reference || `PSTK-${flight.id.slice(-6)}`,
                                    clientName: flight.fullName,
                                    email: user.email,
                                    phone: flight.phone,
                                    serviceDescription: `Airfare: ${airline} (${flightNo}) ${formatFullRoute(from, to)} (PNR: ${pnr})`,
                                    amountPaid: fare,
                                    paymentMethod: d.payment_channel ? `Paystack (${d.payment_channel})` : 'Paystack Online',
                                    paymentDate: d.paid_at ? new Date(d.paid_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString(),
                                    pnr: pnr
                                  });
                                  if (onSuccessToast) onSuccessToast('Payment receipt downloaded!');
                                }}
                                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
                                title="Download official payment receipt PDF"
                              >
                                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Payment Receipt</span>
                              </button>
                            )}

                            {/* 1. Download PDF Itinerary */}
                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(flight)}
                              className="inline-flex items-center gap-1.5 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                              title="Download official PDF itinerary slip"
                            >
                              <Download className="w-3.5 h-3.5 text-[#CFAE70]" />
                              <span>Download PDF</span>
                            </button>

                            {/* 2. Email Itinerary */}
                            <button
                              type="button"
                              onClick={() => handleEmailItinerary(flight)}
                              disabled={sendingEmailId === flight.id}
                              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border border-slate-200"
                              title="Send official HTML itinerary to your email address"
                            >
                              <Send className="w-3.5 h-3.5 text-slate-600" />
                              <span>
                                {sendingEmailId === flight.id ? 'Sending...' : 'Email Itinerary'}
                              </span>
                            </button>

                            {/* 3. Email Invoice */}
                            <button
                              type="button"
                              onClick={() => handleEmailInvoice(flight)}
                              disabled={sendingEmailId === `inv-${flight.id}`}
                              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border border-slate-200"
                              title="Send formal Commercial Invoice to your email"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>
                                {sendingEmailId === `inv-${flight.id}` ? 'Sending...' : 'Email Invoice'}
                              </span>
                            </button>

                            {/* 4. View In-App Slip */}
                            <button
                              type="button"
                              onClick={() => setSelectedTicketSlip(flight)}
                              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer border border-slate-200"
                              title="Preview itinerary slip on screen"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Slip</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECEIVED EMAILS & OUTBOX */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            {/* Resend Service Status & Test Trigger Bar */}
            <div className="bg-gradient-to-r from-[#1B365D] via-[#142642] to-[#0d1b2a] text-white p-5 rounded-3xl border border-[#CFAE70]/40 shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider text-[#F3E5AB] uppercase">
                      Resend Transactional Email Engine
                    </span>
                    <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Domain: ticketing@horizonmove.org
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-white font-serif-luxury">
                    Live Dispatched Emails for {user.fullName}
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xl">
                    All notifications are delivered via our Resend API service from our verified domain. Click any message to view the exact HTML email content delivered to <strong>{user.email}</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendTestItinerary}
                    disabled={sendingEmailId === 'test'}
                    className="bg-gradient-to-r from-[#CFAE70] to-[#A98745] hover:brightness-105 text-[#1B365D] font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingEmailId === 'test' ? 'Sending...' : 'Test Itinerary Email'}</span>
                  </button>
                </div>
              </div>

              {/* Sample Dispatch Triggers for Resend Service Verification */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-300 font-semibold mr-1">
                  Send Sample Email to My Inbox:
                </span>

                <button
                  type="button"
                  onClick={handleSendSampleWelcome}
                  disabled={sendingEmailId === 'test-welcome'}
                  className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/20 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#CFAE70]" />
                  <span>{sendingEmailId === 'test-welcome' ? 'Sending...' : '1. Welcome'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendSampleInvoice}
                  disabled={sendingEmailId === 'test-invoice'}
                  className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/20 cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-blue-300" />
                  <span>{sendingEmailId === 'test-invoice' ? 'Sending...' : '2. Invoice'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendSampleReceipt}
                  disabled={sendingEmailId === 'test-receipt'}
                  className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/20 cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>{sendingEmailId === 'test-receipt' ? 'Sending...' : '3. Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendSampleReset}
                  disabled={sendingEmailId === 'test-reset'}
                  className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/20 cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3 text-amber-300" />
                  <span>{sendingEmailId === 'test-reset' ? 'Sending...' : '4. Password Reset'}</span>
                </button>
              </div>
            </div>

            {userEmails.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">No emails dispatched yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    When you book a flight, create an account, or request an invoice, a copy is delivered via Resend to <strong>{user.email}</strong> and saved here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSendTestItinerary}
                  className="bg-[#1B365D] text-[#F3E5AB] font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow cursor-pointer"
                >
                  Send Sample Itinerary to My Inbox
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {userEmails.map((eml) => (
                  <div 
                    key={eml.id}
                    onClick={() => setSelectedEmailPreview(eml)}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {eml.subject}
                          </h4>
                          {eml.type && (
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                              {eml.type.replace('_', ' ')}
                            </span>
                          )}
                          {eml.pnr && (
                            <span className="bg-[#CFAE70]/20 text-[#1B365D] border border-[#CFAE70]/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                              PNR: {eml.pnr}
                            </span>
                          )}
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            {eml.deliveredVia === 'resend' ? 'Resend Live API' : 'Delivered'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          From: <strong>{eml.from || 'ticketing@horizonmove.org'}</strong> ➔ To: <strong>{eml.to}</strong> • {new Date(eml.sentAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmailPreview(eml);
                        }}
                        className="text-xs font-bold text-[#1B365D] hover:text-[#254877] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Email</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPLICATIONS & INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-[#1B365D] font-serif-luxury">
                  Your Applications & Profile Assessments
                </h2>
                <p className="text-xs text-slate-500">
                  Track your Study Abroad, European Work Permit, and Visa application dossiers submitted to our Anthony, Lagos office.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('study-abroad')}
                className="inline-flex items-center gap-2 bg-[#1B365D] text-[#F3E5AB] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Compass className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span>Explore Study Programs</span>
              </button>
            </div>

            {userInquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">No applications or inquiries yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Any consultation forms or eligibility evaluations you submit will automatically sync to your dashboard here.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('study-abroad')}
                    className="bg-[#1B365D] text-[#F3E5AB] font-bold px-4 py-2 rounded-xl text-xs shadow cursor-pointer"
                  >
                    Study Abroad Programs
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('work-permit')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 cursor-pointer"
                  >
                    European Work Permits
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userInquiries.map((inq) => (
                  <div 
                    key={inq.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#CFAE70]" />
                        <h3 className="text-sm sm:text-base font-bold text-[#1B365D]">
                          {inq.service}
                        </h3>
                        {inq.destination && (
                          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-lg font-semibold">
                            {inq.destination}
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {inq.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                      {inq.notes || 'Application dossier received. Counselor review in progress.'}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Submitted: {new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="text-slate-600 font-medium">Assigned Office: Anthony, Lagos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE & TRAVEL DOCUMENTS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1B365D] font-serif-luxury">
                Traveler Profile & Saved Documents
              </h2>
              <p className="text-xs text-slate-500">
                Keep your passport number and legal details up to date so your future flight bookings and visa applications are pre-filled automatically.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name (as printed on International Passport)
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    International Passport Number
                  </label>
                  <input
                    type="text"
                    value={editPassport}
                    onChange={(e) => setEditPassport(e.target.value)}
                    placeholder="e.g. A12948201"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={editNationality}
                    onChange={(e) => setEditNationality(e.target.value)}
                    placeholder="Nigerian (NG)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] font-bold px-6 py-2.5 rounded-xl text-xs shadow transition-all cursor-pointer"
                >
                  Save Profile Updates
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW EXACT DISPATCHED EMAIL PREVIEW */}
      {selectedEmailPreview && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedEmailPreview(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#142642] text-white px-6 py-4 flex items-center justify-between border-b border-[#CFAE70]/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#CFAE70]/20 text-[#E4C88E] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedEmailPreview.subject}</span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    From: <span className="text-[#F3E5AB] font-mono">{selectedEmailPreview.from || 'ticketing@horizonmove.org'}</span> ➔ Recipient: <span className="font-semibold text-white">{selectedEmailPreview.to}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  {selectedEmailPreview.deliveredVia === 'resend' ? 'Resend Live API' : 'Delivered'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEmailPreview(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Email Render Frame */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100">
              <div 
                className="bg-white rounded-xl shadow-xs p-2 overflow-x-auto text-xs"
                dangerouslySetInnerHTML={{ __html: selectedEmailPreview.previewHtml }}
              />
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Sent: {new Date(selectedEmailPreview.sentAt).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setSelectedEmailPreview(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IN-APP ITINERARY SLIP PREVIEW */}
      {selectedTicketSlip && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedTicketSlip(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1B365D] font-serif-luxury">
                  Official Flight Itinerary Slip
                </h3>
                <p className="text-xs text-slate-500">
                  PNR: <strong>{selectedTicketSlip.details?.pnr || 'PNR-ACTIVE'}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicketSlip(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Passenger:</span>
                <strong className="text-slate-900">{selectedTicketSlip.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Airline / Flight:</span>
                <strong className="text-slate-900">{selectedTicketSlip.details?.airline || 'Airline'} ({selectedTicketSlip.details?.flight_no || 'TBA'})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Route:</span>
                <strong className="text-slate-900">{selectedTicketSlip.details?.from} ➔ {selectedTicketSlip.details?.to || selectedTicketSlip.destination}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Departure Time:</span>
                <strong className="text-slate-900">{selectedTicketSlip.details?.departDate || selectedTicketSlip.details?.departure_time}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quoted Fare:</span>
                <strong className="text-emerald-700 font-extrabold">{selectedTicketSlip.details?.fare}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ticketing Deadline:</span>
                <strong className="text-rose-600 font-bold">{selectedTicketSlip.details?.ticket_deadline || '24-48 Hours'}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = selectedTicketSlip;
                  setSelectedTicketSlip(null);
                  handleDownloadPdf(target);
                }}
                className="bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Slip</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = selectedTicketSlip;
                  setSelectedTicketSlip(null);
                  handleEmailItinerary(target);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Email Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paystack Payment Modal */}
      {selectedBookingForPaystack && (
        <PaystackPaymentModal
          isOpen={isPaystackModalOpen}
          onClose={() => {
            setIsPaystackModalOpen(false);
            setSelectedBookingForPaystack(null);
          }}
          bookingDetails={{
            bookingId: selectedBookingForPaystack.id,
            pnr: selectedBookingForPaystack.details?.pnr || 'HM-TKT',
            airline: selectedBookingForPaystack.details?.airline || 'Airline Partner',
            flightNo: selectedBookingForPaystack.details?.flight_no || 'TBA',
            from: selectedBookingForPaystack.details?.from || 'LOS',
            to: selectedBookingForPaystack.details?.to || selectedBookingForPaystack.destination || 'Destination',
            fareAmount: (() => {
              const raw = selectedBookingForPaystack.details?.fare;
              if (typeof raw === 'number') return raw;
              if (typeof raw === 'string') {
                const parsed = parseFloat(raw.replace(/[^0-9.]/g, ''));
                if (!isNaN(parsed) && parsed > 0) return parsed;
              }
              return 1450000;
            })(),
            currency: 'NGN',
            passengerName: selectedBookingForPaystack.fullName,
            passengerEmail: user?.email || selectedBookingForPaystack.email,
            passengerPhone: selectedBookingForPaystack.phone
          }}
          onPaymentSuccess={(data) => {
            if (onSuccessToast) {
              onSuccessToast(`Payment of ${data.amount} verified! Booking marked as Paid in Full.`);
            }
            setSubmissions(getSubmissions());
            setIsPaystackModalOpen(false);
            setSelectedBookingForPaystack(null);
          }}
        />
      )}
    </div>
  );
};
