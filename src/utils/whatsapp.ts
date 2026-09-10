export const WHATSAPP_NUMBER = '2347075624318';
export const PRIMARY_PHONE = '07075624318';
export const BUSINESS_PHONE = '07075624318';
export const SECONDARY_PHONE = '+234 707 562 4318';
export const EMAIL_ADDRESS = 'info@horizonmove.ng';
export const ADMISSIONS_EMAIL = 'admissions@horizonmove.ng';
export const WEBSITE_DOMAIN = 'horizonmove.ng';
export const FACEBOOK_URL = 'https://web.facebook.com/horizonmove';
export const INSTAGRAM_URL = 'https://www.instagram.com/horizonmoveltd';
export const RC_NUMBER = '9795462';
export const OFFICE_ADDRESS = '4, Ayanbole Street, Anthony, Lagos';
export const OFFICE_ADDRESS_FULL = '4, Ayanbole Street, Anthony, Lagos State, Nigeria';
export const STUDY_ABROAD_PORTAL_URL = 'https://app.coursefinder.ai/student-platform/02fc1200/sign-up';

export function createWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function formatConsultationWhatsAppMessage(data: {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  targetCountry?: string;
  consultationType: string;
  preferredDate?: string;
  notes?: string;
}): string {
  return `*NEW CONSULTATION BOOKING - HORIZON MOVE LIMITED*
---------------------------------------
*Client Name:* ${data.fullName}
*Phone / WhatsApp:* ${data.phone}
*Email:* ${data.email}
*Service Requested:* ${data.service}
*Target Destination:* ${data.targetCountry || 'Not Specified'}
*Meeting Preference:* ${data.consultationType}
*Preferred Date/Time:* ${data.preferredDate || 'Earliest Available'}
${data.notes ? `*Additional Notes:* ${data.notes}\n` : ''}---------------------------------------
_Sent via Horizon Move Official Portal. Please confirm my appointment slot._`;
}

export function formatFlightInquiryWhatsApp(flight: {
  tripType: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}): string {
  return `*FLIGHT BOOKING ENQUIRY - HORIZON MOVE LIMITED*
---------------------------------------
*Trip Type:* ${flight.tripType.toUpperCase()}
*From:* ${flight.from}
*To:* ${flight.to}
*Departure Date:* ${flight.departureDate}
${flight.returnDate ? `*Return Date:* ${flight.returnDate}\n` : ''}*Passengers:* ${flight.passengers}
*Cabin Class:* ${flight.cabinClass}
---------------------------------------
_Please send available flight options, airline itineraries, and best quote._`;
}

export function formatHotelInquiryWhatsApp(hotel: {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  starPreference: string;
}): string {
  return `*HOTEL RESERVATION ENQUIRY - HORIZON MOVE LIMITED*
---------------------------------------
*Destination:* ${hotel.destination}
*Check-in Date:* ${hotel.checkIn}
*Check-out Date:* ${hotel.checkOut}
*Guests:* ${hotel.guests}
*Rooms:* ${hotel.rooms}
*Hotel Tier:* ${hotel.starPreference}
---------------------------------------
_Please share verified hotel options with breakfast and airport transfer availability._`;
}

export function formatHolidayInquiryWhatsApp(pkg: {
  title: string;
  destination: string;
  duration: string;
  travelers?: number;
  preferredMonth?: string;
}): string {
  return `*HOLIDAY PACKAGE ENQUIRY - HORIZON MOVE LIMITED*
---------------------------------------
*Package:* ${pkg.title}
*Destination:* ${pkg.destination}
*Duration:* ${pkg.duration}
*Travelers:* ${pkg.travelers || 2}
*Target Travel Window:* ${pkg.preferredMonth || 'Upcoming Month'}
---------------------------------------
_Please provide the detailed itinerary, visa requirements, and complete invoice for this package._`;
}

export function formatLeadPopupWhatsApp(data: {
  fullName: string;
  phone: string;
  email: string;
  interest: string;
  intake: string;
}): string {
  return `*FREE PROFILE EVALUATION REQUEST - HORIZON MOVE*
---------------------------------------
*Applicant:* ${data.fullName}
*Phone:* ${data.phone}
*Email:* ${data.email}
*Area of Interest:* ${data.interest}
*Target Intake / Timeline:* ${data.intake}
---------------------------------------
_I would like to claim my Free Profile Evaluation and Document Assessment for the upcoming intake._`;
}
