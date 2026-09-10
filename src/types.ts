export type PageType = 
  | 'home'
  | 'study-abroad'
  | 'work-permit'
  | 'visa-services'
  | 'travel-bookings'
  | 'about-us'
  | 'contact'
  | 'admin'
  | 'api-docs'
  | 'client-portal';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
  createdAt: string;
  memberTier?: 'Standard' | 'Silver' | 'Gold VIP';
}

export interface DispatchedEmail {
  id: string;
  resendId?: string;
  to: string;
  from?: string;
  subject: string;
  type: string;
  sentAt: string;
  status: 'sent' | 'simulated' | 'failed';
  deliveredVia?: 'resend' | 'simulated' | 'failed';
  previewHtml: string;
  pnr?: string;
  passengerName?: string;
  invoiceNumber?: string;
  receiptNumber?: string;
  totalAmount?: string;
  errorMessage?: string;
}


export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP';

export interface StudyCountry {
  id: string;
  name: string;
  code: string;
  flag: string;
  heroImage: string;
  headline: string;
  popularPrograms: string[];
  intakes: string[];
  keyBenefits: string[];
  averageTuition: {
    NGN: string;
    USD: string;
    EUR: string;
    GBP: string;
  };
  postStudyWork: string;
  workWhileStudying: string;
  processingTime: string;
  topUniversities: string[];
}

export interface WorkPermitCountry {
  id: string;
  name: string;
  code: string;
  flag: string;
  image: string;
  jobSectors: string[];
  processingTime: string;
  requirements: string[];
  contractDuration: string;
  salaryRange: {
    EUR: string;
    NGN: string;
  };
  highlights: string[];
  visaType: string;
}

export interface VisaServiceCountry {
  id: string;
  name: string;
  category: 'Visit' | 'Business' | 'Both';
  image: string;
  flag: string;
  processingTime: string;
  validity: string;
  keyServices: string[];
  idealFor: string;
  estimatedCost: {
    NGN: string;
    USD: string;
  };
}

export interface HolidayPackage {
  id: string;
  title: string;
  destination: string;
  duration: string;
  image: string;
  rating: number;
  pricePerPerson: {
    NGN: string;
    USD: string;
  };
  inclusions: string[];
  highlights: string[];
  itinerarySummary: string;
  tag?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  destination: string;
  type: 'Study Abroad' | 'Work Permit' | 'Visit Visa' | 'Holiday';
  content: string;
  avatar: string;
  rating: number;
  visaApprovedDate: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Study' | 'Work' | 'Visa' | 'Payments';
}

export interface ConsultationFormData {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  targetCountry?: string;
  preferredDate?: string;
  consultationType: 'Virtual (Zoom/WhatsApp)' | 'In-Person (Anthony Office)' | string;
  notes?: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  region: string;
  popular?: boolean;
}

export interface FlightSearchData {
  tripType: 'round' | 'one-way' | 'multi';
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
}

export interface HotelSearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  starPreference: string;
}

export interface PartnerAirline {
  id: string;
  name: string;
  iata: string;
  country: string;
  alliance?: string;
  hub?: string;
}

export interface PartnerUniversity {
  id: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  location: string;
  badgeAccent: string;
  ranking?: string;
  popularFor?: string;
}
