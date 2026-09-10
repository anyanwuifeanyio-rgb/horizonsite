import { DispatchedEmail } from '../types';
import { 
  PRIMARY_PHONE, 
  EMAIL_ADDRESS, 
  RC_NUMBER, 
  OFFICE_ADDRESS_FULL 
} from './whatsapp';
import { formatFullRoute, formatFullCityAirport } from '../data/airportsData';

const LOCAL_EMAILS_KEY = 'horizon_client_sent_emails';

// ----------------------------------------------------------------------
// LOCAL PERSISTENCE & BROADCASTING
// ----------------------------------------------------------------------

export function getLocalDispatchedEmails(): DispatchedEmail[] {
  try {
    const raw = localStorage.getItem(LOCAL_EMAILS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalDispatchedEmail(email: DispatchedEmail): void {
  try {
    const current = getLocalDispatchedEmails();
    const updated = [email, ...current.filter(e => e.id !== email.id)].slice(0, 100);
    localStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('horizon_email_dispatched', { detail: email }));
  } catch (err) {
    console.error('Failed to save email to local outbox:', err);
  }
}

// ----------------------------------------------------------------------
// REUSABLE DISPATCH WRAPPER (RESEND SERVER PROXY)
// ----------------------------------------------------------------------

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  deliveredVia?: 'resend' | 'simulated' | 'failed';
  sender?: string;
  message: string;
  error?: string;
}

/**
 * Core dispatch function. Sends email payload to backend Express server
 * which communicates with Resend API using server-side RESEND_API_KEY.
 * Guaranteed to NEVER throw: failures return safe result objects so calling code
 * (bookings, payments, registrations) will always proceed safely.
 */
async function dispatchToResendApi(payload: {
  to: string;
  subject: string;
  type: string;
  html: string;
  text?: string;
  pnr?: string;
  passengerName?: string;
  invoiceNumber?: string;
  receiptNumber?: string;
  totalAmount?: string;
  replyTo?: string;
  customSender?: string;
}): Promise<EmailDispatchResult> {
  const localRecord: DispatchedEmail = {
    id: `eml-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    to: payload.to,
    subject: payload.subject,
    type: payload.type,
    sentAt: new Date().toISOString(),
    status: 'sent',
    deliveredVia: 'simulated',
    previewHtml: payload.html,
    pnr: payload.pnr,
    passengerName: payload.passengerName,
    invoiceNumber: payload.invoiceNumber,
    receiptNumber: payload.receiptNumber,
    totalAmount: payload.totalAmount
  };

  // 1. Immediately cache in client outbox for instant UI feedback
  saveLocalDispatchedEmail(localRecord);

  // 2. Transmit to server Resend route
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        type: payload.type,
        html: payload.html,
        text: payload.text || 'Horizon Move Limited Transactional Notification',
        pnr: payload.pnr,
        passengerName: payload.passengerName,
        customSender: payload.customSender || 'Horizon Move Limited <ticketing@horizonmove.ng>',
        replyTo: payload.replyTo || 'ticketing@horizonmove.ng'
      })
    });

    if (response.ok) {
      const data = await response.json();
      const finalResult: EmailDispatchResult = {
        success: data.success !== false,
        messageId: data.messageId || localRecord.id,
        deliveredVia: data.deliveredVia || 'simulated',
        sender: data.sender,
        message: data.message || `Email successfully dispatched to ${payload.to}`,
        error: data.warning
      };

      // Update cached record with server delivery details
      localRecord.resendId = data.messageId;
      localRecord.deliveredVia = data.deliveredVia;
      localRecord.status = data.deliveredVia === 'failed' ? 'failed' : 'sent';
      localRecord.errorMessage = data.warning;
      saveLocalDispatchedEmail(localRecord);

      return finalResult;
    } else {
      const errJson = await response.json().catch(() => ({}));
      console.warn('Resend server proxy returned non-200 status:', errJson);
      return {
        success: false,
        deliveredVia: 'failed',
        message: `Delivery attempted for ${payload.to}`,
        error: errJson.error || 'HTTP Error'
      };
    }
  } catch (netErr: any) {
    // Network or offline preview mode fallback
    console.warn('Note: Could not reach Resend server proxy (running in offline/sandbox preview mode):', netErr);
    return {
      success: true,
      messageId: localRecord.id,
      deliveredVia: 'simulated',
      message: `Transactional email recorded in client outbox for ${payload.to}`
    };
  }
}

// ----------------------------------------------------------------------
// 1. ACCOUNT CREATION CONFIRMATION
// ----------------------------------------------------------------------

export interface AccountWelcomePayload {
  email: string;
  fullName: string;
  accountId: string;
  memberTier?: string;
  phone?: string;
}

export function generateAccountWelcomeEmailHtml(data: AccountWelcomePayload): string {
  const tier = data.memberTier || 'Standard Traveler';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Horizon Move Limited Client Portal</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 25px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color:#142642;padding:28px 32px;border-bottom:4px solid #CFAE70;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#E4C88E;letter-spacing:0.5px;">HORIZON MOVE LIMITED</h1>
              <p style="margin:4px 0 0 0;font-size:11px;color:#94a3b8;">RC: ${RC_NUMBER} • Certified Global Travel & Educational Consulting</p>
            </td>
            <td align="right">
              <span style="display:inline-block;background:rgba(207,174,112,0.18);color:#E4C88E;border:1px solid #CFAE70;font-size:10px;padding:4px 10px;border-radius:20px;font-weight:bold;text-transform:uppercase;">
                Account Confirmed
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Welcome Headline -->
    <tr>
      <td style="padding:28px 32px 16px;">
        <h2 style="margin:0 0 10px 0;font-size:19px;color:#0f172a;font-weight:700;">
          Welcome to Your Travel & Study Abroad Portal
        </h2>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
          Dear <strong>${data.fullName}</strong>,<br>
          Your Horizon Move client account has been successfully created. You can now manage your airline reservations, track visa applications, download verified flight itinerary slips, and view transactional invoices anytime.
        </p>
      </td>
    </tr>

    <!-- Account Details Card -->
    <tr>
      <td style="padding:0 32px 24px;">
        <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;">
          <table width="100%" border="0" cellspacing="6" cellpadding="0">
            <tr>
              <td width="50%">
                <div style="font-size:10px;text-transform:uppercase;color:#64748b;font-weight:bold;">Primary Email</div>
                <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:2px;">${data.email}</div>
              </td>
              <td width="50%">
                <div style="font-size:10px;text-transform:uppercase;color:#64748b;font-weight:bold;">Client Account ID</div>
                <div style="font-size:13px;font-weight:700;color:#1B365D;font-family:monospace;margin-top:2px;">${data.accountId}</div>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding-top:10px;">
                <div style="font-size:10px;text-transform:uppercase;color:#64748b;font-weight:bold;">Membership Tier</div>
                <div style="font-size:13px;font-weight:700;color:#B8934C;margin-top:2px;">${tier}</div>
              </td>
              <td width="50%" style="padding-top:10px;">
                <div style="font-size:10px;text-transform:uppercase;color:#64748b;font-weight:bold;">Registration Status</div>
                <div style="font-size:13px;font-weight:700;color:#15803d;margin-top:2px;">Active & Verified</div>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- Key Portal Features -->
    <tr>
      <td style="padding:0 32px 24px;">
        <div style="border-top:1px solid #e2e8f0;padding-top:18px;">
          <div style="font-size:12px;font-weight:bold;color:#1B365D;text-transform:uppercase;margin-bottom:8px;">
            What You Can Do Next:
          </div>
          <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.7;color:#475569;">
            <li><strong>Book Flight Tickets:</strong> Real-time NDC offers across 60+ partner airlines with instant PNR issuance.</li>
            <li><strong>Download Itinerary Slips:</strong> Official embassy-compliant PDF tickets ready for visa submissions.</li>
            <li><strong>Study Abroad Tracking:</strong> View university admissions in the UK, Canada, USA, Europe & Australia.</li>
            <li><strong>Dedicated Counselor Support:</strong> Direct priority WhatsApp assistance with our senior travel desk.</li>
          </ul>
        </div>
      </td>
    </tr>

    <!-- Security Note -->
    <tr>
      <td style="padding:0 32px 28px;">
        <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:12px 16px;font-size:12px;color:#1e40af;line-height:1.5;">
          🔒 <strong>Security Tip:</strong> Horizon Move Limited will never ask for your password or debit card PIN via email or phone. If you did not create this account, please contact us immediately.
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;line-height:1.5;">
        <strong>HORIZON MOVE LIMITED</strong> • Certified RC: ${RC_NUMBER}<br>
        ${OFFICE_ADDRESS_FULL}<br>
        Direct Desk: <strong>${PRIMARY_PHONE}</strong> | Official Inquiries: <strong>${EMAIL_ADDRESS}</strong>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendAccountWelcomeEmail(data: AccountWelcomePayload): Promise<EmailDispatchResult> {
  const subject = `Welcome to Horizon Move Limited - Account Confirmation (${data.fullName})`;
  const html = generateAccountWelcomeEmailHtml(data);
  const text = `Dear ${data.fullName}, welcome to Horizon Move Limited! Your client account (${data.email}) has been successfully created. Account ID: ${data.accountId}. Office: ${OFFICE_ADDRESS_FULL}. Helpline: ${PRIMARY_PHONE}.`;

  return dispatchToResendApi({
    to: data.email,
    subject,
    type: 'account_welcome',
    html,
    text,
    passengerName: data.fullName
  });
}

// ----------------------------------------------------------------------
// 2. BOOKING CONFIRMATION & FLIGHT ITINERARY
// ----------------------------------------------------------------------

export interface FlightEmailPayload {
  to: string;
  passengerName: string;
  pnr: string;
  bookingReference: string;
  carrier?: string;
  airlineName: string;
  flightNo: string;
  from: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  fare: string;
  ticketDeadline?: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
  cabinClass?: string;
}

export function generateFlightEmailHtml(data: FlightEmailPayload): string {
  const deadline = data.ticketDeadline || '24 - 48 Hours from reservation';
  const cabin = data.cabinClass || 'Economy Class (Confirmed)';
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Flight Reservation Itinerary - PNR: ${data.pnr}</title>
</head>
<body style="margin:0;padding:20px;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 25px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color:#142642;padding:26px 30px;border-bottom:4px solid #CFAE70;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#E4C88E;letter-spacing:0.5px;">HORIZON MOVE LIMITED</h1>
              <p style="margin:4px 0 0 0;font-size:11px;color:#94a3b8;">RC: ${RC_NUMBER} • Certified Global Travel & Flight Desk</p>
            </td>
            <td align="right">
              <span style="display:inline-block;background:rgba(207,174,112,0.18);color:#E4C88E;border:1px solid #CFAE70;font-size:11px;padding:5px 12px;border-radius:20px;font-weight:bold;text-transform:uppercase;">
                Booking Confirmation
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- PNR Reference Banner -->
    <tr>
      <td style="padding:24px 30px 10px;">
        <div style="background-color:#0c182b;border:2px dashed #CFAE70;border-radius:12px;padding:16px 20px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <div style="font-size:10px;text-transform:uppercase;color:#94a3b8;font-weight:bold;letter-spacing:1px;">Airline Booking Reference</div>
                <div style="font-size:28px;font-weight:800;color:#E4C88E;font-family:monospace;letter-spacing:3px;">${data.pnr}</div>
              </td>
              <td align="right">
                <div style="font-size:10px;text-transform:uppercase;color:#94a3b8;font-weight:bold;">Ticketing Time Limit</div>
                <div style="font-size:13px;font-weight:bold;color:#f87171;margin-top:2px;">${deadline}</div>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- Greeting -->
    <tr>
      <td style="padding:10px 30px 15px;">
        <p style="font-size:14px;line-height:1.6;color:#334155;margin:0;">
          Dear <strong>${data.passengerName}</strong>,<br>
          Your flight reservation on <strong>${data.airlineName}</strong> has been confirmed. Below is your official flight itinerary and ticketing receipt for route <strong>${formatFullRoute(data.from, data.toCode)}</strong>.
        </p>
      </td>
    </tr>

    <!-- Flight Route Strip -->
    <tr>
      <td style="padding:0 30px 20px;">
        <div style="background:linear-gradient(135deg, #1B365D 0%, #142642 100%);border-radius:12px;padding:18px 22px;color:#ffffff;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="text-align:center;">
            <tr>
              <td width="35%" align="left">
                <div style="font-size:24px;font-weight:800;color:#E4C88E;">${data.from}</div>
                <div style="font-size:11px;color:#cbd5e1;font-weight:600;margin-top:2px;">${formatFullCityAirport(data.from)}</div>
                <div style="font-size:12px;color:#e2e8f0;margin-top:4px;">${data.departureTime}</div>
              </td>
              <td width="30%">
                <div style="font-size:18px;color:#CFAE70;">✈ ➔</div>
                <div style="font-size:11px;font-weight:bold;color:#ffffff;margin-top:4px;">${data.airlineName}</div>
                <div style="font-size:10px;color:#cbd5e1;">Flight ${data.flightNo} • ${cabin}</div>
              </td>
              <td width="35%" align="right">
                <div style="font-size:24px;font-weight:800;color:#E4C88E;">${data.toCode}</div>
                <div style="font-size:11px;color:#cbd5e1;font-weight:600;margin-top:2px;">${formatFullCityAirport(data.toCode)}</div>
                <div style="font-size:12px;color:#e2e8f0;margin-top:4px;">${data.arrivalTime}</div>
              </td>
            </tr>
          </table>
          <div style="margin-top:14px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.15);font-size:11.5px;color:#f8fafc;text-align:center;font-weight:bold;">
            Full Route: ${formatFullRoute(data.from, data.toCode)}
          </div>
        </div>
      </td>
    </tr>

    <!-- Passenger Details & Fare Summary -->
    <tr>
      <td style="padding:0 30px 20px;">
        <div style="font-size:12px;font-weight:700;color:#142642;text-transform:uppercase;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px;">
          Passenger & Fare Information
        </div>
        <table width="100%" border="0" cellspacing="6" cellpadding="0">
          <tr>
            <td width="50%" style="background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Passenger Name</div>
              <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:2px;">${data.passengerName}</div>
            </td>
            <td width="50%" style="background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Passport Number</div>
              <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:2px;">${data.passportNumber || 'On File with Counselor'}</div>
            </td>
          </tr>
          <tr>
            <td width="50%" style="background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Total Quoted Fare</div>
              <div style="font-size:15px;font-weight:800;color:#15803d;margin-top:2px;">${data.fare}</div>
            </td>
            <td width="50%" style="background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Baggage Allowance</div>
              <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:2px;">2 x 23kg Checked Bags + 7kg Cabin</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Important Notice & Payment Instructions -->
    <tr>
      <td style="padding:0 30px 25px;">
        <div style="background-color:#fffbeb;border:1px solid #fef3c7;border-radius:10px;padding:14px 18px;">
          <div style="font-size:12px;font-weight:bold;color:#92400e;margin-bottom:4px;">
            ⚠️ Payment & Ticket Issuance Advisory
          </div>
          <p style="font-size:12px;line-height:1.5;color:#78350f;margin:0;">
            Airlines require payment verification before the ticketing deadline (<strong>${deadline}</strong>) to guarantee fare locking and avoid automated cancellation. Please contact our ticketing officer at <strong>${PRIMARY_PHONE}</strong> or reply with proof of transfer.
          </p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#f1f5f9;padding:20px 30px;border-top:1px solid #cbd5e1;font-size:11px;color:#64748b;line-height:1.5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <strong>HORIZON MOVE LIMITED</strong><br>
              ${OFFICE_ADDRESS_FULL}<br>
              Direct Ticketing Desk: <strong>${PRIMARY_PHONE}</strong> | Email: <strong>${EMAIL_ADDRESS}</strong>
            </td>
            <td align="right" valign="top">
              Booking Ref: <strong>${data.bookingReference}</strong><br>
              Status: <strong style="color:#15803d;">RESERVATION ACTIVE</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendFlightItineraryEmail(data: FlightEmailPayload): Promise<EmailDispatchResult> {
  const fullRoute = formatFullRoute(data.from, data.toCode);
  const subject = `Your Flight Reservation Itinerary - PNR: ${data.pnr} | ${fullRoute}`;
  const html = generateFlightEmailHtml(data);
  const text = `Flight Itinerary for ${data.passengerName}. PNR: ${data.pnr}. Route: ${fullRoute} on ${data.airlineName} ${data.flightNo}. Total Fare: ${data.fare}. Ticketing Deadline: ${data.ticketDeadline}. Contact: ${PRIMARY_PHONE}`;

  return dispatchToResendApi({
    to: data.to,
    subject,
    type: 'flight_itinerary',
    html,
    text,
    pnr: data.pnr,
    passengerName: data.passengerName,
    totalAmount: data.fare,
    customSender: 'Horizon Move Limited <ticketing@horizonmove.ng>',
    replyTo: 'ticketing@horizonmove.ng'
  });
}

// ----------------------------------------------------------------------
// 3. INVOICE (BILLING NOTIFICATION)
// ----------------------------------------------------------------------

export interface InvoiceItem {
  description: string;
  quantity?: number;
  amount: string;
}

export interface InvoiceEmailPayload {
  to: string;
  clientName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: string;
  currency?: string;
  notes?: string;
  pnr?: string;
}

export function generateInvoiceEmailHtml(data: InvoiceEmailPayload): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;">
        ${item.description}
      </td>
      <td align="center" style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">
        ${item.quantity || 1}
      </td>
      <td align="right" style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:700;color:#0f172a;">
        ${item.amount}
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${data.invoiceNumber} - Horizon Move Limited</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 25px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color:#142642;padding:28px 32px;border-bottom:4px solid #CFAE70;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#E4C88E;">HORIZON MOVE LIMITED</h1>
              <p style="margin:4px 0 0 0;font-size:11px;color:#94a3b8;">RC: ${RC_NUMBER} • Official Travel & Consulting Invoice</p>
            </td>
            <td align="right">
              <span style="display:inline-block;background:rgba(207,174,112,0.18);color:#E4C88E;border:1px solid #CFAE70;font-size:11px;padding:5px 12px;border-radius:20px;font-weight:bold;text-transform:uppercase;">
                Commercial Invoice
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Invoice Details Bar -->
    <tr>
      <td style="padding:24px 32px 16px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="55%" valign="top">
              <div style="font-size:10px;text-transform:uppercase;color:#64748b;font-weight:bold;">Billed To</div>
              <div style="font-size:16px;font-weight:700;color:#0f172a;margin-top:2px;">${data.clientName}</div>
              <div style="font-size:12px;color:#475569;margin-top:2px;">${data.to}</div>
              ${data.pnr ? `<div style="font-size:12px;color:#B8934C;font-weight:bold;margin-top:4px;">Booking PNR: ${data.pnr}</div>` : ''}
            </td>
            <td width="45%" align="right" valign="top">
              <div style="font-size:11px;color:#64748b;">Invoice Number: <strong style="color:#1B365D;font-family:monospace;">${data.invoiceNumber}</strong></div>
              <div style="font-size:11px;color:#64748b;margin-top:3px;">Issue Date: <strong>${data.issueDate}</strong></div>
              <div style="font-size:11px;color:#dc2626;font-weight:bold;margin-top:3px;">Payment Due: ${data.dueDate}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Line Items Table -->
    <tr>
      <td style="padding:0 32px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
          <thead>
            <tr style="background-color:#f8fafc;">
              <th align="left" style="padding:10px 14px;font-size:11px;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e2e8f0;">Item Description</th>
              <th align="center" style="padding:10px 14px;font-size:11px;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e2e8f0;">Qty</th>
              <th align="right" style="padding:10px 14px;font-size:11px;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e2e8f0;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr style="background-color:#f1f5f9;">
              <td colspan="2" align="right" style="padding:12px 14px;font-size:13px;font-weight:bold;color:#0f172a;">Total Payable:</td>
              <td align="right" style="padding:12px 14px;font-size:17px;font-weight:800;color:#15803d;">${data.totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>

    <!-- Bank Details Card -->
    <tr>
      <td style="padding:0 32px 24px;">
        <div style="background-color:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;padding:16px 20px;">
          <div style="font-size:11px;font-weight:bold;color:#1B365D;text-transform:uppercase;margin-bottom:6px;">
            Official Bank Wire & Settlement Accounts (Nigeria)
          </div>
          <p style="font-size:12px;color:#475569;margin:0 0 10px 0;">
            Please initiate payment to our designated corporate banking channel:
          </p>
          <table width="100%" border="0" cellspacing="4" cellpadding="0" style="font-size:12px;">
            <tr>
              <td width="33%" style="background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;">
                <strong style="color:#1B365D;">Sterling Bank</strong><br>
                Acct: <strong>0089234102</strong><br>
                <span style="font-size:10px;color:#64748b;">HORIZON MOVE LTD</span>
              </td>
              <td width="33%" style="background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;">
                <strong style="color:#1B365D;">Providus Bank</strong><br>
                Acct: <strong>5401928374</strong><br>
                <span style="font-size:10px;color:#64748b;">HORIZON MOVE LTD</span>
              </td>
              <td width="33%" style="background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;">
                <strong style="color:#1B365D;">Stanbic IBTC</strong><br>
                Acct: <strong>0039281726</strong><br>
                <span style="font-size:10px;color:#64748b;">HORIZON MOVE LTD</span>
              </td>
            </tr>
          </table>
          <p style="font-size:11px;color:#64748b;margin:10px 0 0 0;">
            Use your Invoice Number (<strong>${data.invoiceNumber}</strong>)${data.pnr ? ` or PNR (<strong>${data.pnr}</strong>)` : ''} as payment reference. Email payment evidence to <strong>${EMAIL_ADDRESS}</strong> or WhatsApp <strong>${PRIMARY_PHONE}</strong>.
          </p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#f1f5f9;padding:18px 32px;border-top:1px solid #cbd5e1;font-size:11px;color:#64748b;line-height:1.5;">
        <strong>HORIZON MOVE LIMITED</strong> • ${OFFICE_ADDRESS_FULL}<br>
        Direct Desk: <strong>${PRIMARY_PHONE}</strong> | Official Billing: <strong>${EMAIL_ADDRESS}</strong>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendInvoiceEmail(data: InvoiceEmailPayload): Promise<EmailDispatchResult> {
  const subject = `Invoice #${data.invoiceNumber} from Horizon Move Limited (${data.totalAmount})`;
  const html = generateInvoiceEmailHtml(data);
  const text = `Invoice #${data.invoiceNumber} for ${data.clientName}. Total amount: ${data.totalAmount}. Due date: ${data.dueDate}. Payment accounts: Sterling Bank (0089234102), Providus Bank (5401928374) - HORIZON MOVE LIMITED. Contact: ${PRIMARY_PHONE}`;

  return dispatchToResendApi({
    to: data.to,
    subject,
    type: 'invoice',
    html,
    text,
    passengerName: data.clientName,
    invoiceNumber: data.invoiceNumber,
    totalAmount: data.totalAmount,
    pnr: data.pnr,
    customSender: 'Horizon Move Limited <ticketing@horizonmove.ng>',
    replyTo: 'ticketing@horizonmove.ng'
  });
}

// ----------------------------------------------------------------------
// 4. PAYMENT RECEIPT
// ----------------------------------------------------------------------

export interface PaymentReceiptPayload {
  to: string;
  clientName: string;
  receiptNumber: string;
  invoiceReference?: string;
  transactionRef: string;
  amountPaid: string;
  paymentMethod: string;
  paymentDate: string;
  serviceDescription: string;
  pnr?: string;
}

export function generatePaymentReceiptEmailHtml(data: PaymentReceiptPayload): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt #${data.receiptNumber} - Horizon Move Limited</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 25px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color:#142642;padding:28px 32px;border-bottom:4px solid #CFAE70;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#E4C88E;">HORIZON MOVE LIMITED</h1>
              <p style="margin:4px 0 0 0;font-size:11px;color:#94a3b8;">RC: ${RC_NUMBER} • Official Travel & Financial Services</p>
            </td>
            <td align="right">
              <span style="display:inline-block;background:rgba(34,197,94,0.2);color:#22c55e;border:1px solid #22c55e;font-size:11px;padding:5px 12px;border-radius:20px;font-weight:bold;text-transform:uppercase;">
                Payment Received
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Banner & Amount -->
    <tr>
      <td style="padding:28px 32px 20px;">
        <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;">
          <div style="font-size:11px;text-transform:uppercase;color:#166534;font-weight:bold;letter-spacing:1px;">Amount Successfully Settled</div>
          <div style="font-size:32px;font-weight:800;color:#15803d;margin:6px 0;">${data.amountPaid}</div>
          <div style="font-size:12px;color:#166534;">Payment Status: <strong>PAID IN FULL</strong> • Balance: <strong>0.00</strong></div>
        </div>
      </td>
    </tr>

    <!-- Receipt Details Table -->
    <tr>
      <td style="padding:0 32px 20px;">
        <table width="100%" border="0" cellspacing="6" cellpadding="0">
          <tr>
            <td width="50%" style="background:#f8fafc;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Received From</div>
              <div style="font-size:14px;font-weight:700;color:#0f172a;margin-top:2px;">${data.clientName}</div>
              <div style="font-size:11px;color:#64748b;">${data.to}</div>
            </td>
            <td width="50%" style="background:#f8fafc;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Receipt Number</div>
              <div style="font-size:14px;font-weight:700;color:#1B365D;font-family:monospace;margin-top:2px;">${data.receiptNumber}</div>
              <div style="font-size:11px;color:#64748b;">Date: ${data.paymentDate}</div>
            </td>
          </tr>
          <tr>
            <td width="50%" style="background:#f8fafc;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Transaction Reference</div>
              <div style="font-size:12px;font-weight:700;color:#0f172a;font-family:monospace;margin-top:2px;">${data.transactionRef}</div>
              ${data.invoiceReference ? `<div style="font-size:11px;color:#64748b;">Invoice: ${data.invoiceReference}</div>` : ''}
            </td>
            <td width="50%" style="background:#f8fafc;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;color:#64748b;font-weight:bold;text-transform:uppercase;">Payment Channel</div>
              <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:2px;">${data.paymentMethod}</div>
              ${data.pnr ? `<div style="font-size:11px;color:#B8934C;font-weight:bold;">Airline PNR: ${data.pnr}</div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Description & Stamp -->
    <tr>
      <td style="padding:0 32px 24px;">
        <div style="border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;background:#ffffff;">
          <div style="font-size:11px;font-weight:bold;color:#1B365D;text-transform:uppercase;margin-bottom:4px;">
            Service Rendered
          </div>
          <p style="font-size:13px;line-height:1.5;color:#334155;margin:0 0 12px 0;">
            ${data.serviceDescription}
          </p>
          <div style="border-top:1px dashed #cbd5e1;padding-top:10px;font-size:11px;color:#64748b;display:flex;justify-content:space-between;">
            <span>Authorized by: <strong>Accounts & Ticketing Registry</strong></span>
            <span style="color:#15803d;font-weight:bold;">✓ VALIDATED OFFICIAL RECEIPT</span>
          </div>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#f1f5f9;padding:18px 32px;border-top:1px solid #cbd5e1;font-size:11px;color:#64748b;line-height:1.5;">
        <strong>HORIZON MOVE LIMITED</strong> • ${OFFICE_ADDRESS_FULL}<br>
        Direct Helpline: <strong>${PRIMARY_PHONE}</strong> | Official Desk: <strong>${EMAIL_ADDRESS}</strong>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPaymentReceiptEmail(data: PaymentReceiptPayload): Promise<EmailDispatchResult> {
  const subject = `Official Payment Receipt #${data.receiptNumber} - Horizon Move Limited (${data.amountPaid})`;
  const html = generatePaymentReceiptEmailHtml(data);
  const text = `Official Receipt #${data.receiptNumber} for ${data.clientName}. Amount Paid: ${data.amountPaid}. Transaction Ref: ${data.transactionRef}. Status: Settled. Horizon Move Limited. Helpline: ${PRIMARY_PHONE}`;

  return dispatchToResendApi({
    to: data.to,
    subject,
    type: 'payment_receipt',
    html,
    text,
    passengerName: data.clientName,
    receiptNumber: data.receiptNumber,
    totalAmount: data.amountPaid,
    pnr: data.pnr,
    customSender: 'Horizon Move Limited <ticketing@horizonmove.ng>',
    replyTo: 'ticketing@horizonmove.ng'
  });
}

// ----------------------------------------------------------------------
// 5. PASSWORD RESET NOTIFICATION
// ----------------------------------------------------------------------

export interface PasswordResetPayload {
  email: string;
  fullName: string;
  resetCode: string;
  resetLink?: string;
  expiryMinutes?: number;
}

export function generatePasswordResetEmailHtml(data: PasswordResetPayload): string {
  const expiry = data.expiryMinutes || 30;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request - Horizon Move Limited</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 25px rgba(0,0,0,0.06);">
    <!-- Header -->
    <tr>
      <td style="background-color:#142642;padding:24px 30px;border-bottom:4px solid #CFAE70;">
        <h1 style="margin:0;font-size:20px;font-weight:800;color:#E4C88E;">HORIZON MOVE LIMITED</h1>
        <p style="margin:4px 0 0 0;font-size:11px;color:#94a3b8;">Client Portal • Security & Authentication Desk</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:28px 30px 16px;">
        <h2 style="margin:0 0 10px 0;font-size:18px;color:#0f172a;font-weight:700;">
          Password Reset Request
        </h2>
        <p style="font-size:14px;line-height:1.6;color:#334155;margin:0 0 16px 0;">
          Dear <strong>${data.fullName}</strong>,<br>
          We received a request to reset your password for your Horizon Move client portal account. Use the one-time security code below:
        </p>

        <!-- Code Box -->
        <div style="background:#f8fafc;border:2px dashed #CFAE70;border-radius:12px;padding:18px;text-align:center;margin:18px 0;">
          <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:bold;letter-spacing:1px;">Your One-Time Security Code</div>
          <div style="font-size:32px;font-weight:800;color:#1B365D;letter-spacing:6px;font-family:monospace;margin:8px 0;">${data.resetCode}</div>
          <div style="font-size:11px;color:#dc2626;font-weight:semibold;">Expires in ${expiry} minutes</div>
        </div>

        <p style="font-size:13px;line-height:1.6;color:#475569;margin:0 0 16px 0;">
          If you requested this change, enter this code on the Client Portal recovery screen. If you did not make this request, you can safely ignore this email; your account remains completely secure.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#f8fafc;padding:18px 30px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;line-height:1.5;">
        <strong>HORIZON MOVE LIMITED</strong> • ${OFFICE_ADDRESS_FULL}<br>
        Direct Helpline: <strong>${PRIMARY_PHONE}</strong> | Official Desk: <strong>${EMAIL_ADDRESS}</strong>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetEmail(data: PasswordResetPayload): Promise<EmailDispatchResult> {
  const subject = `Your Password Reset Verification Code - Horizon Move Limited`;
  const html = generatePasswordResetEmailHtml(data);
  const text = `Password reset code for ${data.fullName}: ${data.resetCode}. Expires in ${data.expiryMinutes || 30} minutes. If you did not request this, ignore this email. Horizon Move Limited.`;

  return dispatchToResendApi({
    to: data.email,
    subject,
    type: 'password_reset',
    html,
    text,
    passengerName: data.fullName
  });
}

// ----------------------------------------------------------------------
// 6. INQUIRY & CONSULTATION CONFIRMATIONS
// ----------------------------------------------------------------------

export async function sendInquiryConfirmationEmail(params: {
  to: string;
  fullName: string;
  service: string;
  summary: string;
  destination?: string;
}): Promise<EmailDispatchResult> {
  const subject = `Inquiry Confirmation - Horizon Move Limited (${params.service})`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1e293b;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #cbd5e1;overflow:hidden;">
    <div style="background:#142642;color:#fff;padding:24px;border-bottom:4px solid #CFAE70;">
      <h2 style="margin:0;color:#E4C88E;">HORIZON MOVE LIMITED</h2>
      <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Official Educational & Travel Consulting Services</p>
    </div>
    <div style="padding:24px;">
      <p style="font-size:14px;color:#334155;">Dear <strong>${params.fullName}</strong>,</p>
      <p style="font-size:13px;line-height:1.6;color:#475569;">
        Thank you for submitting your inquiry for <strong>${params.service}</strong>${params.destination ? ` regarding <strong>${params.destination}</strong>` : ''}.
      </p>
      <div style="background:#f1f5f9;border-left:4px solid #1B365D;padding:12px 16px;margin:16px 0;font-size:12px;color:#1e293b;">
        <strong>Summary:</strong> ${params.summary}
      </div>
      <p style="font-size:13px;line-height:1.6;color:#475569;">
        An assigned senior counselor from our Anthony Lagos office will reach out to you via WhatsApp and phone shortly.
      </p>
    </div>
    <div style="background:#f8fafc;padding:16px 24px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;">
      Direct Office Helpline: <strong>${PRIMARY_PHONE}</strong> • Address: ${OFFICE_ADDRESS_FULL}
    </div>
  </div>
</body>
</html>`;

  const text = `Inquiry confirmation for ${params.fullName}. Service: ${params.service}. Summary: ${params.summary}`;

  return dispatchToResendApi({
    to: params.to,
    subject,
    type: 'inquiry_receipt',
    html,
    text,
    passengerName: params.fullName
  });
}

// ----------------------------------------------------------------------
// 7. GENERIC TRANSACTIONAL EMAIL
// ----------------------------------------------------------------------

export interface GenericTransactionalPayload {
  to: string;
  recipientName: string;
  title: string;
  messageBody: string;
  badgeText?: string;
  ctaText?: string;
  ctaUrl?: string;
  metadata?: Record<string, string>;
}

export function generateGenericTransactionalEmailHtml(data: GenericTransactionalPayload): string {
  const metadataRows = data.metadata 
    ? Object.entries(data.metadata).map(([key, val]) => `
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;">${key}:</td>
        <td align="right" style="padding:6px 0;font-size:12px;color:#0f172a;font-weight:700;">${val}</td>
      </tr>
    `).join('')
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.title} - Horizon Move Limited</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;color:#1e293b;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #cbd5e1;overflow:hidden;">
    <div style="background:#142642;padding:24px;border-bottom:4px solid #CFAE70;">
      <h2 style="margin:0;color:#E4C88E;font-size:20px;">HORIZON MOVE LIMITED</h2>
      <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">RC: ${RC_NUMBER} • Transactional Dispatch</p>
    </div>
    <div style="padding:24px;">
      ${data.badgeText ? `<span style="background:#eff6ff;color:#1d4ed8;font-size:10px;font-weight:bold;padding:4px 10px;border-radius:12px;text-transform:uppercase;">${data.badgeText}</span>` : ''}
      <h3 style="margin:12px 0;font-size:17px;color:#0f172a;">${data.title}</h3>
      <p style="font-size:14px;line-height:1.6;color:#334155;">
        Dear <strong>${data.recipientName}</strong>,<br>
        ${data.messageBody}
      </p>

      ${metadataRows ? `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;margin:18px 0;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            ${metadataRows}
          </table>
        </div>
      ` : ''}

      ${data.ctaText && data.ctaUrl ? `
        <div style="text-align:center;margin:24px 0 12px;">
          <a href="${data.ctaUrl}" style="background:#1B365D;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:13px;display:inline-block;">
            ${data.ctaText}
          </a>
        </div>
      ` : ''}
    </div>
    <div style="background:#f8fafc;padding:16px 24px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;">
      ${OFFICE_ADDRESS_FULL} • Direct Helpline: <strong>${PRIMARY_PHONE}</strong>
    </div>
  </div>
</body>
</html>`;
}

export async function sendGenericTransactionalEmail(data: GenericTransactionalPayload): Promise<EmailDispatchResult> {
  const subject = `${data.title} - Horizon Move Limited`;
  const html = generateGenericTransactionalEmailHtml(data);
  const text = `${data.title} for ${data.recipientName}: ${data.messageBody}`;

  return dispatchToResendApi({
    to: data.to,
    subject,
    type: 'general_transactional',
    html,
    text,
    passengerName: data.recipientName
  });
}
