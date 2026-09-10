import { jsPDF } from 'jspdf';
import { PRIMARY_PHONE, EMAIL_ADDRESS, OFFICE_ADDRESS_FULL, RC_NUMBER } from './whatsapp';
import { formatFullCityAirport, formatFullRoute } from '../data/airportsData';

export interface FlightItineraryPDFData {
  pnr: string;
  bookingReference?: string;
  carrier?: string;
  airlineName: string;
  flightNo: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  fare: string;
  ticketDeadline: string;
  passengerName: string;
  passportNumber?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  cabinClass?: string;
  baggage?: string;
  status?: string;
}

/**
 * Generates and triggers download of a high-resolution, vector PDF itinerary slip
 * using jsPDF for client-side execution with no external backend dependency.
 */
export function generateItineraryPDF(data: FlightItineraryPDFData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Background subtle tint
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Header Banner (Dark Navy: #142642)
  doc.setFillColor(20, 38, 66);
  doc.rect(margin, 12, contentWidth, 26, 'F');

  // Gold Trim Line at bottom of header (#CFAE70)
  doc.setFillColor(207, 174, 112);
  doc.rect(margin, 38, contentWidth, 1.8, 'F');

  // Company Brand Name & Subtitle
  doc.setTextColor(228, 200, 142); // #E4C88E
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HORIZON MOVE LIMITED', margin + 6, 22);

  doc.setTextColor(203, 213, 225); // Slate 300
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`RC: ${RC_NUMBER} • Certified Corporate Travel & Aviation Desk`, margin + 6, 28);
  doc.text(`Abuja HQ: ${PRIMARY_PHONE} • ${EMAIL_ADDRESS}`, margin + 6, 33);

  // Badge on Header Right
  doc.setFillColor(207, 174, 112);
  doc.roundedRect(pageWidth - margin - 52, 18, 46, 13, 2, 2, 'F');
  doc.setTextColor(20, 38, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('OFFICIAL E-TICKET', pageWidth - margin - 29, 23.5, { align: 'center' });
  doc.text('ITINERARY RECEIPT', pageWidth - margin - 29, 28, { align: 'center' });

  let curY = 46;

  // PNR Highlight Card (Navy card with gold border)
  doc.setFillColor(15, 27, 46); // #0f1b2e
  doc.setDrawColor(207, 174, 112);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, curY, contentWidth, 24, 3, 3, 'FD');

  // Left side: PNR
  doc.setTextColor(180, 195, 215);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('AIRLINE BOOKING REFERENCE (PNR)', margin + 7, curY + 7);

  doc.setTextColor(228, 200, 142);
  doc.setFont('courier', 'bold');
  doc.setFontSize(19);
  doc.text(data.pnr || 'CONFIRMED', margin + 7, curY + 17);

  // Right side: Ticketing Time Limit
  doc.setTextColor(248, 113, 113); // Rose 400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TICKETING TIME LIMIT (PAYMENT DEADLINE)', pageWidth - margin - 7, curY + 7, { align: 'right' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(data.ticketDeadline || 'Within 24-48 Hours of Reservation', pageWidth - margin - 7, curY + 14, { align: 'right' });

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Status: ${data.status || 'CONFIRMED (SEATS HELD)'}`, pageWidth - margin - 7, curY + 19.5, { align: 'right' });

  curY += 30;

  // Passenger Information Section
  doc.setTextColor(20, 38, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. PASSENGER INFORMATION', margin, curY);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, curY + 1.5, pageWidth - margin, curY + 1.5);

  curY += 6;

  // Passenger Info Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, curY, contentWidth, 30, 2, 2, 'FD');

  const col1 = margin + 6;
  const col2 = margin + 68;
  const col3 = margin + 130;

  // Row 1
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('PASSENGER NAME', col1, curY + 6);
  doc.text('PASSPORT NUMBER', col2, curY + 6);
  doc.text('NATIONALITY', col3, curY + 6);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(data.passengerName || 'Primary Passenger', col1, curY + 11.5);
  doc.text(data.passportNumber || 'On File with Desk', col2, curY + 11.5);
  doc.text(data.nationality || 'Nigerian (NG)', col3, curY + 11.5);

  // Row 2
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('PHONE / WHATSAPP', col1, curY + 19);
  doc.text('EMAIL ADDRESS', col2, curY + 19);
  doc.text('BOOKING REF / TICKET', col3, curY + 19);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(data.phone || 'N/A', col1, curY + 24.5);
  doc.text(data.email || 'N/A', col2, curY + 24.5);
  doc.text(data.bookingReference || `HORIZON-${data.pnr}`, col3, curY + 24.5);

  curY += 36;

  // Flight Schedule Section
  doc.setTextColor(20, 38, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. FLIGHT ITINERARY & FULL ROUTING', margin, curY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, curY + 1.5, pageWidth - margin, curY + 1.5);

  curY += 6;

  // Full Route written out in full (e.g. Lagos, Nigeria (LOS) ➔ London Heathrow, United Kingdom (LHR))
  const fullRouteText = formatFullRoute(data.from, data.to);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`Official Route: ${fullRouteText}`, margin, curY + 3.5);

  curY += 6;

  // Flight Banner Card (Deep Blue gradient representation)
  doc.setFillColor(27, 54, 93); // #1B365D
  doc.setDrawColor(20, 38, 66);
  doc.roundedRect(margin, curY, contentWidth, 38, 3, 3, 'FD');

  // Origin
  doc.setTextColor(228, 200, 142);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(data.from || 'LOS', col1, curY + 14);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(formatFullCityAirport(data.from) || 'Lagos, Nigeria', col1, curY + 20);

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`DEPARTURE: ${data.departureTime || 'Scheduled Time'}`, col1, curY + 26);

  // Center flight info
  doc.setTextColor(207, 174, 112);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('------------------->', pageWidth / 2, curY + 14, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`${data.airlineName} • ${data.flightNo}`, pageWidth / 2, curY + 20, { align: 'center' });

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(data.cabinClass || 'Economy Class • Confirmed Flight', pageWidth / 2, curY + 26, { align: 'center' });

  // Destination
  doc.setTextColor(228, 200, 142);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(data.to || 'LHR', pageWidth - margin - 7, curY + 14, { align: 'right' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(formatFullCityAirport(data.to) || 'London, United Kingdom', pageWidth - margin - 7, curY + 20, { align: 'right' });

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`ARRIVAL: ${data.arrivalTime || 'Scheduled Time'}`, pageWidth - margin - 7, curY + 26, { align: 'right' });

  curY += 44;

  // Fare & Baggage Allowance Section
  doc.setTextColor(20, 38, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. FARE BREAKDOWN & BAGGAGE ALLOWANCE', margin, curY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, curY + 1.5, pageWidth - margin, curY + 1.5);

  curY += 6;

  // Fare and Baggage Cards
  const halfCardWidth = (contentWidth - 6) / 2;

  // Left card: Fare
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, curY, halfCardWidth, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TOTAL RESERVED FARE (TAXES & FEES INCL.)', margin + 6, curY + 7);

  doc.setTextColor(22, 101, 52); // Emerald 800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(data.fare || 'Fare On Request', margin + 6, curY + 16);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Guaranteed rate locked until ticketing deadline', margin + 6, curY + 20.5);

  // Right card: Baggage
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + halfCardWidth + 6, curY, halfCardWidth, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('BAGGAGE ALLOWANCE', margin + halfCardWidth + 12, curY + 7);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const baggageStr = typeof data.baggage === 'string' ? data.baggage : '2 x 23kg Checked Bags + 7kg Cabin Bag';
  doc.text(baggageStr, margin + halfCardWidth + 12, curY + 15);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Standard international allowance included', margin + halfCardWidth + 12, curY + 20.5);

  curY += 30;

  // Important Notice & What Happens Next Box (Warm Amber Box)
  doc.setFillColor(254, 252, 232); // Amber 50
  doc.setDrawColor(251, 191, 36); // Amber 400
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, curY, contentWidth, 34, 2.5, 2.5, 'FD');

  doc.setTextColor(146, 64, 14); // Amber 800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('WHAT HAPPENS NEXT (PAYMENT & OFFICIAL E-TICKET ISSUANCE):', margin + 6, curY + 6.5);

  doc.setTextColor(69, 26, 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const instructions = [
    `1. Your seats are held under PNR ${data.pnr} on the carrier reservation system until ${data.ticketDeadline}.`,
    `2. Contact Horizon Move Limited Ticketing Desk at ${PRIMARY_PHONE} or payment desk to complete payment.`,
    `3. Upon payment verification, our certified ticketing officer will issue your official 13-digit airline e-ticket with barcode.`,
    `4. Online web check-in opens 24-48 hours before scheduled departure on the carrier website or mobile app.`
  ];

  let lineY = curY + 12;
  instructions.forEach((inst) => {
    doc.text(inst, margin + 6, lineY);
    lineY += 5;
  });

  curY += 40;

  // Security & Verification Strip
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, curY, contentWidth, 14, 2, 2, 'FD');

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('AUTHENTICITY & SYSTEM VERIFICATION:', margin + 6, curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(`Official Document ID: HML-ITN-${data.pnr}-${Date.now().toString().slice(-6)} • Issued via Horizon Move Global Aviation GDS Network.`, margin + 6, curY + 10);

  // Bottom Footer
  const footerY = pageHeight - 12;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Horizon Move Limited • ${OFFICE_ADDRESS_FULL}`, margin, footerY);
  doc.text(`Tel: ${PRIMARY_PHONE} • Email: ${EMAIL_ADDRESS}`, pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF directly to user's device
  const safePnr = (data.pnr || 'RESERVATION').replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = (data.passengerName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `HorizonMove_Flight_Itinerary_${safePnr}_${safeName}.pdf`;

  doc.save(filename);
}

export interface PaymentReceiptPDFData {
  receiptNumber: string;
  transactionRef: string;
  clientName: string;
  email: string;
  phone?: string;
  serviceDescription: string;
  amountPaid: string;
  paymentMethod: string;
  paymentDate: string;
  pnr?: string;
}

/**
 * Generates and downloads an official, corporate-grade PDF Payment Receipt
 * for Paystack settlements and flight ticket payments.
 */
export function generatePaymentReceiptPdf(data: PaymentReceiptPDFData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Background tint
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner (#142642)
  doc.setFillColor(20, 38, 66);
  doc.rect(margin, 12, contentWidth, 28, 'F');

  // Gold accent bar
  doc.setFillColor(207, 174, 112);
  doc.rect(margin, 40, contentWidth, 2, 'F');

  // Company Branding
  doc.setTextColor(228, 200, 142);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HORIZON MOVE LIMITED', margin + 6, 23);

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`RC Number: ${RC_NUMBER} • Aviation & Global Mobility Consultants`, margin + 6, 30);

  // Right Header Text: RECEIPT
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('OFFICIAL PAYMENT RECEIPT', pageWidth - margin - 6, 23, { align: 'right' });

  doc.setTextColor(52, 211, 153); // Emerald 400
  doc.setFontSize(9);
  doc.text('SETTLED & VERIFIED', pageWidth - margin - 6, 30, { align: 'right' });

  let curY = 48;

  // Metadata Grid Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, curY, contentWidth, 28, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('RECEIPT NUMBER:', margin + 6, curY + 7);
  doc.text('PAYSTACK TRANSACTION REF:', margin + 6, curY + 16);
  doc.text('PAYMENT DATE & TIME:', margin + 6, curY + 24);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(data.receiptNumber, margin + 55, curY + 7);
  doc.setFont('courier', 'bold');
  doc.text(data.transactionRef, margin + 55, curY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentDate, margin + 55, curY + 24);

  // Right Box side: Total Paid Badge
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(pageWidth - margin - 60, curY + 4, 54, 20, 2, 2, 'FD');

  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('TOTAL AMOUNT PAID:', pageWidth - margin - 33, curY + 9, { align: 'center' });

  doc.setFontSize(12);
  doc.text(data.amountPaid, pageWidth - margin - 33, curY + 17, { align: 'center' });

  curY += 34;

  // Client Details Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, curY, contentWidth, 26, 3, 3, 'FD');

  doc.setTextColor(20, 38, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BILLED TO CLIENT:', margin + 6, curY + 7);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Client Name: ${data.clientName}`, margin + 6, curY + 14);
  doc.text(`Email Address: ${data.email}`, margin + 6, curY + 20);

  if (data.phone) {
    doc.text(`Phone / Contact: ${data.phone}`, margin + 95, curY + 14);
  }
  if (data.pnr) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 54, 93);
    doc.text(`Associated Airline PNR: ${data.pnr}`, margin + 95, curY + 20);
  }

  curY += 32;

  // Payment Breakdown Table
  doc.setFillColor(20, 38, 66);
  doc.rect(margin, curY, contentWidth, 8, 'F');

  doc.setTextColor(228, 200, 142);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ITEM DESCRIPTION', margin + 6, curY + 5.5);
  doc.text('METHOD / GATEWAY', margin + 115, curY + 5.5);
  doc.text('AMOUNT PAID', pageWidth - margin - 6, curY + 5.5, { align: 'right' });

  curY += 8;

  // Table Row
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, curY, contentWidth, 22, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(data.serviceDescription, margin + 6, curY + 7);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`Payment Gateway: ${data.paymentMethod}`, margin + 6, curY + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Paystack Secure Checkout', margin + 115, curY + 7);
  doc.text('256-Bit SSL / 3D Secure', margin + 115, curY + 14);

  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(data.amountPaid, pageWidth - margin - 6, curY + 11, { align: 'right' });

  curY += 28;

  // Paystack & Compliance Note
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, curY, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(3, 105, 161);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PAYSTACK GATEWAY SETTLEMENT ADVICE', margin + 6, curY + 6);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('This transaction was authenticated and processed through Paystack Payments Limited (licensed by the Central Bank of Nigeria).', margin + 6, curY + 11);
  doc.text('Funds have been credited towards the issuance of your airline ticket and official GDS confirmation.', margin + 6, curY + 16);

  curY += 28;

  // Official Stamp Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(207, 174, 112);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, curY, 80, 24, 2, 2, 'D');

  doc.setTextColor(184, 147, 76);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('HORIZON MOVE LIMITED', margin + 40, curY + 6, { align: 'center' });
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(7.5);
  doc.text('*** PAID & CERTIFIED ***', margin + 40, curY + 12, { align: 'center' });
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, margin + 40, curY + 18, { align: 'center' });

  // Footer
  const footerY = pageHeight - 12;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Horizon Move Limited • ${OFFICE_ADDRESS_FULL} • RC ${RC_NUMBER}`, margin, footerY);
  doc.text(`Tel: ${PRIMARY_PHONE} • Email: ${EMAIL_ADDRESS}`, pageWidth - margin, footerY, { align: 'right' });

  const filename = `HorizonMove_Receipt_${data.receiptNumber}.pdf`;
  doc.save(filename);
}
