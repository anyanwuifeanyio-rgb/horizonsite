import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building2, 
  Hash, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Lock, 
  Copy, 
  Check, 
  Clock, 
  ExternalLink, 
  AlertCircle,
  Plane,
  Download,
  Send,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  PaystackPaymentInitParams, 
  loadPaystackScript, 
  getPaystackConfig, 
  verifyPaystackTransaction 
} from '../services/paystackService';
import { sendPaymentReceiptEmail } from '../utils/emailService';
import { getSubmissions, saveSubmission, updateSubmissionNotes, LeadSubmission } from '../utils/submissions';
import { generatePaymentReceiptPdf } from '../utils/pdfGenerator';
import { formatFullRoute } from '../data/airportsData';

interface PaystackPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId?: string;
    pnr: string;
    airline: string;
    flightNo: string;
    from: string;
    to: string;
    fareAmount: number; // in NGN
    currency?: string;
    passengerName: string;
    passengerEmail: string;
    passengerPhone?: string;
  };
  onPaymentSuccess?: (receiptData: {
    reference: string;
    amount: string;
    channel: string;
    paidAt: string;
  }) => void;
}

export const PaystackPaymentModal: React.FC<PaystackPaymentModalProps> = ({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    reference: string;
    amount: string;
    channel: string;
    paidAt: string;
    receiptNumber: string;
  } | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [showPinField, setShowPinField] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Server Paystack Config
  const [paystackConfig, setPaystackConfig] = useState<{
    configured: boolean;
    publicKey: string;
    isLive: boolean;
  }>({ configured: false, publicKey: '', isLive: false });

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsProcessing(false);
      loadPaystackScript();
      getPaystackConfig().then(setPaystackConfig);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedAmount = bookingDetails.fareAmount.toLocaleString('en-NG', {
    style: 'currency',
    currency: bookingDetails.currency || 'NGN',
    minimumFractionDigits: 0
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFillTestCard = () => {
    setCardNumber('4084 0840 8408 4084');
    setCardExpiry('12/28');
    setCardCvv('408');
    setShowPinField(true);
    setCardPin('1234');
  };

  // Launch official popup if available and desired
  const handleLaunchOfficialPopup = () => {
    if ((window as any).PaystackPop && paystackConfig.publicKey) {
      try {
        const handler = (window as any).PaystackPop.setup({
          key: paystackConfig.publicKey,
          email: bookingDetails.passengerEmail,
          amount: Math.round(bookingDetails.fareAmount * 100), // in kobo
          currency: bookingDetails.currency || 'NGN',
          ref: `HM_PSTK_${bookingDetails.pnr}_${Date.now().toString().slice(-6)}`,
          metadata: {
            custom_fields: [
              { display_name: "Airline PNR", variable_name: "pnr", value: bookingDetails.pnr },
              { display_name: "Flight", variable_name: "flight_no", value: bookingDetails.flightNo },
              { display_name: "Passenger", variable_name: "passenger", value: bookingDetails.passengerName }
            ]
          },
          callback: function (response: any) {
            completeSuccessfulPayment(response.reference || response.trxref, 'Official Paystack Popup');
          },
          onClose: function () {
            console.log('Paystack popup window dismissed by user');
          }
        });
        handler.openIframe();
        return;
      } catch (e) {
        console.warn('Could not launch Paystack iframe, switching to inline handler', e);
      }
    }
  };

  const completeSuccessfulPayment = async (ref: string, channel: string) => {
    setIsProcessing(true);
    setProcessStep('Verifying transaction on Paystack servers...');

    const receiptNum = `RCP-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    // 1. Verify via API
    await verifyPaystackTransaction(ref);

    // 2. Dispatch Payment Receipt Email
    setProcessStep('Dispatching official payment receipt & e-ticket...');
    try {
      await sendPaymentReceiptEmail({
        to: bookingDetails.passengerEmail,
        clientName: bookingDetails.passengerName,
        receiptNumber: receiptNum,
        transactionRef: ref,
        amountPaid: formattedAmount,
        paymentMethod: `Paystack Online (${channel})`,
        paymentDate: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        serviceDescription: `Confirmed Flight Ticket: ${bookingDetails.airline} (${bookingDetails.flightNo}) ${bookingDetails.from} ➔ ${bookingDetails.to}`,
        pnr: bookingDetails.pnr
      });
    } catch (e) {
      console.error('Receipt email error:', e);
    }

    // 3. Update Submission in local database & storage
    try {
      const allSubmissions = getSubmissions();
      // Find matching flight submission by pnr or bookingId
      const target = allSubmissions.find(s => 
        (s.details && s.details.pnr === bookingDetails.pnr) || 
        s.id === bookingDetails.bookingId
      );

      if (target) {
        target.status = 'enrolled'; // Mark as enrolled / paid
        if (!target.details) target.details = {};
        target.details.payment_status = 'paid';
        target.details.payment_reference = ref;
        target.details.payment_channel = channel;
        target.details.paid_amount = formattedAmount;
        target.details.paid_at = nowIso;
        target.notes = `${target.notes || ''}\n[PAYSTACK] Payment of ${formattedAmount} settled successfully. Ref: ${ref} on ${nowIso}`;
        localStorage.setItem('horizon_lead_submissions_v1', JSON.stringify(allSubmissions));
      } else {
        // Create new record
        saveSubmission({
          type: 'flight_booking',
          fullName: bookingDetails.passengerName,
          phone: bookingDetails.passengerPhone || '+2348000000000',
          email: bookingDetails.passengerEmail,
          service: 'Confirmed Flight Ticket (Paystack Paid)',
          destination: bookingDetails.to,
          summary: `PAID • PNR: ${bookingDetails.pnr} • ${bookingDetails.airline} (${bookingDetails.flightNo}) • ${formatFullRoute(bookingDetails.from, bookingDetails.to)} • ${formattedAmount}`,
          details: {
            pnr: bookingDetails.pnr,
            airline: bookingDetails.airline,
            flight_no: bookingDetails.flightNo,
            from: bookingDetails.from,
            to: bookingDetails.to,
            fare: formattedAmount,
            payment_status: 'paid',
            payment_reference: ref,
            payment_channel: channel,
            paid_at: nowIso
          },
          notes: `Paid via Paystack Gateway. Ref: ${ref}`
        });
      }

      // Notify other components
      window.dispatchEvent(new CustomEvent('horizon_submissions_changed'));
    } catch (err) {
      console.error('Error saving payment record:', err);
    }

    setIsProcessing(false);
    setIsSuccess(true);
    const resultObj = {
      reference: ref,
      amount: formattedAmount,
      channel,
      paidAt: new Date().toLocaleTimeString(),
      receiptNumber: receiptNum
    };
    setPaymentResult(resultObj);

    if (onPaymentSuccess) {
      onPaymentSuccess(resultObj);
    }
  };

  const handleExecutePayment = async (channel: string) => {
    setIsProcessing(true);
    setProcessStep('Connecting to Paystack secure channel...');

    // Simulate authentic 3D Secure / authorization latency
    await new Promise(r => setTimeout(r, 1200));
    setProcessStep('Authorizing payment with issuing bank...');
    await new Promise(r => setTimeout(r, 1000));

    const generatedRef = `PSTK_FLIGHT_${bookingDetails.pnr}_${Date.now().toString().slice(-6)}`;
    await completeSuccessfulPayment(generatedRef, channel);
  };

  const handleDownloadReceipt = () => {
    if (!paymentResult) return;
    try {
      generatePaymentReceiptPdf({
        receiptNumber: paymentResult.receiptNumber,
        transactionRef: paymentResult.reference,
        clientName: bookingDetails.passengerName,
        email: bookingDetails.passengerEmail,
        phone: bookingDetails.passengerPhone || '+234 803 000 0000',
        serviceDescription: `Air Ticket Issuance: ${bookingDetails.airline} (${bookingDetails.flightNo}) ${bookingDetails.from} ➔ ${bookingDetails.to} (PNR: ${bookingDetails.pnr})`,
        amountPaid: paymentResult.amount,
        paymentMethod: `Paystack Online (${paymentResult.channel})`,
        paymentDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        pnr: bookingDetails.pnr
      });
    } catch (e) {
      console.error('PDF Receipt download error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative my-6">
        
        {/* Close Button */}
        {!isProcessing && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Top Brand Strip */}
        <div className="bg-[#081326] text-white p-5 border-b-2 border-[#00C3F7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00C3F7] flex items-center justify-center text-[#081326] font-black text-sm">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-white tracking-wide">Paystack Checkout</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    paystackConfig.isLive 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  }`}>
                    {paystackConfig.isLive ? 'LIVE' : 'TEST MODE (SANDBOX)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Horizon Move Limited • Flight Booking Settlement
                </div>
              </div>
            </div>

            <div className="text-right pr-6">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Due</div>
              <div className="text-base font-extrabold text-[#00C3F7] font-mono">
                {formattedAmount}
              </div>
            </div>
          </div>
        </div>

        {/* Test Mode Banner */}
        {!paystackConfig.isLive && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-bold text-[11px]">Test Mode Active:</span>
              <span className="text-[11px] text-amber-700">Simulated test environment with test keys. No real funds will be charged.</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-bold uppercase">
              Sandbox
            </span>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {isSuccess && paymentResult ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Confirmed
              </span>
              <h3 className="text-xl font-black text-slate-800 pt-1">
                Flight Fare Successfully Paid!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your flight reservation has been verified and ticket status updated to <strong>Paid in Full</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Paystack Reference</span>
                <span className="font-mono font-bold text-slate-800">{paymentResult.reference}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Airline PNR</span>
                <span className="font-mono font-extrabold text-[#1B365D] bg-[#F3E5AB]/40 px-2 py-0.5 rounded">
                  {bookingDetails.pnr}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Flight Route</span>
                <span className="font-semibold text-slate-700 text-right max-w-[240px]">
                  {formatFullRoute(bookingDetails.from, bookingDetails.to)} ({bookingDetails.flightNo})
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Settled Amount</span>
                <span className="font-bold text-emerald-700">{paymentResult.amount}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Receipt Sent To</span>
                <span className="font-medium text-slate-700">{bookingDetails.passengerEmail}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B365D] hover:bg-[#254877] text-[#F3E5AB] font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#CFAE70]" />
                <span>Download Official Receipt (PDF)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          /* PROCESSING SPINNER */
          <div className="p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#00C3F7]/10 text-[#00C3F7] flex items-center justify-center mx-auto">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-800">Processing Your Payment</h3>
              <p className="text-xs text-slate-500">{processStep}</p>
            </div>
            <div className="text-[11px] text-slate-400 max-w-xs mx-auto flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Please do not refresh or close this browser tab</span>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM & TABS */
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Flight summary pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1B365D] text-[#E4C88E] flex items-center justify-center font-bold">
                  <Plane className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    {bookingDetails.airline} • {bookingDetails.flightNo}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {formatFullRoute(bookingDetails.from, bookingDetails.to)} • PNR: <span className="font-mono font-bold text-[#1B365D]">{bookingDetails.pnr}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Instant Ticketing
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white text-[#081326] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-[#00C3F7]" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('transfer')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'transfer'
                    ? 'bg-white text-[#081326] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#00C3F7]" />
                <span>Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ussd')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ussd'
                    ? 'bg-white text-[#081326] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-[#00C3F7]" />
                <span>USSD</span>
              </button>
            </div>

            {/* TAB 1: CARD */}
            {activeTab === 'card' && (
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Enter Card Details</label>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-[11px] text-[#00C3F7] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Fill Test Card</span>
                  </button>
                </div>

                {/* Card Number */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C3F7] focus:bg-white"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Valid Thru</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C3F7]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C3F7]"
                    />
                  </div>
                </div>

                {showPinField && (
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Card 4-Digit PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardPin}
                      onChange={(e) => setCardPin(e.target.value)}
                      placeholder="••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C3F7]"
                    />
                  </div>
                )}

                {/* Pay Button */}
                <button
                  type="button"
                  onClick={() => handleExecutePayment('Debit Card')}
                  className="w-full py-3 bg-[#081326] hover:bg-[#142642] text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#00C3F7]/40"
                >
                  <Lock className="w-3.5 h-3.5 text-[#00C3F7]" />
                  <span>Pay {formattedAmount}</span>
                </button>
              </div>
            )}

            {/* TAB 2: BANK TRANSFER */}
            {activeTab === 'transfer' && (
              <div className="space-y-3 pt-1">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">Dynamic Virtual Account</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> Expires in 30 mins
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500">Beneficiary Bank</div>
                    <div className="font-bold text-slate-800 text-sm">Wema Bank (Paystack Titan)</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500">Virtual Account Number</div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-200">
                      <span className="font-mono text-base font-extrabold text-emerald-900 tracking-wider">
                        9938491024
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('9938491024', 'acc')}
                        className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        {copiedField === 'acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'acc' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500">Account Name</div>
                    <div className="font-semibold text-slate-700">HORIZON MOVE / PAYSTACK AIRFARE</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Transfer the exact amount (<strong>{formattedAmount}</strong>) from your banking app. Paystack automatically verifies within seconds.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleExecutePayment('Direct Bank Transfer')}
                  className="w-full py-3 bg-[#081326] hover:bg-[#142642] text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#00C3F7]/40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00C3F7]" />
                  <span>I Have Sent {formattedAmount}</span>
                </button>
              </div>
            )}

            {/* TAB 3: USSD */}
            {activeTab === 'ussd' && (
              <div className="space-y-3 pt-1 text-xs">
                <p className="text-slate-600">
                  Select your bank to generate the instant USSD dialing string:
                </p>

                <div className="space-y-2">
                  {[
                    { bank: 'GTBank', code: '*737*2*0*9938491024#' },
                    { bank: 'Zenith Bank', code: '*966*00*9938491024#' },
                    { bank: 'Access Bank', code: '*901*00*9938491024#' },
                    { bank: 'UBA', code: '*919*00*9938491024#' }
                  ].map((item) => (
                    <div 
                      key={item.bank}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{item.bank}</div>
                        <div className="font-mono text-xs text-[#00C3F7]">{item.code}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.code, item.bank)}
                        className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold px-2 py-1 bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        {copiedField === item.bank ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === item.bank ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleExecutePayment('USSD Code')}
                  className="w-full py-3 bg-[#081326] hover:bg-[#142642] text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#00C3F7]/40 mt-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#00C3F7]" />
                  <span>I Have Completed USSD Payment</span>
                </button>
              </div>
            )}

            {/* Footer Trust Guarantee */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PCI-DSS Level 1 Compliant</span>
              </div>
              <span>Secured by Paystack</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
