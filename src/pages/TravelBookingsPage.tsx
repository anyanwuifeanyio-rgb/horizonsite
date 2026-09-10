import React, { useState } from 'react';
import { Currency, FlightSearchData, HotelSearchData, HolidayPackage, PageType } from '../types';
import { HOLIDAY_PACKAGES, PARTNER_AIRLINES } from '../data/mockData';
import { 
  Plane, 
  Hotel, 
  Palmtree, 
  Calendar, 
  Users, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Clock, 
  MessageCircle, 
  Sparkles, 
  Send,
  Building,
  ShieldCheck,
  Terminal,
  Ticket,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  X,
  Lock,
  ArrowLeftRight,
  Download,
  Phone,
  Mail,
  User,
  CreditCard
} from 'lucide-react';
import { PaystackPaymentModal } from '../components/PaystackPaymentModal';
import { 
  formatFlightInquiryWhatsApp, 
  formatHotelInquiryWhatsApp, 
  formatHolidayInquiryWhatsApp, 
  createWhatsAppUrl,
  PRIMARY_PHONE,
  RC_NUMBER,
  OFFICE_ADDRESS_FULL,
  EMAIL_ADDRESS
} from '../utils/whatsapp';
import { saveSubmission } from '../utils/submissions';
import { generateItineraryPDF } from '../utils/pdfGenerator';
import { formatFullRoute, formatFullCityAirport } from '../data/airportsData';
import { AirlineLogo } from '../components/AirlineLogo';
import { AirportDropdown } from '../components/AirportDropdown';
import { getCurrentUser } from '../utils/auth';
import { sendFlightItineraryEmail } from '../utils/emailService';
import { 
  skyLinkService, 
  SkyLinkFlightOffer, 
  SkyLinkPricingResponse, 
  SkyLinkReserveResponse, 
  SkyLinkGuest,
  formatBaggage
} from '../services/skylinkApi';

interface TravelBookingsPageProps {
  currency: Currency;
  onSuccessToast: (msg: string) => void;
  onOpenConsultation: () => void;
  onNavigate?: (page: PageType) => void;
}

export const TravelBookingsPage: React.FC<TravelBookingsPageProps> = ({
  currency,
  onSuccessToast,
  onOpenConsultation,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'holidays'>('flights');

  // SkyLink Live API State
  const [isSkyLinkSearching, setIsSkyLinkSearching] = useState(false);
  const [skyLinkOffers, setSkyLinkOffers] = useState<SkyLinkFlightOffer[] | null>(null);
  const [skyLinkMeta, setSkyLinkMeta] = useState<{ total_flights: number; response_time_ms: number; origin: string; destination: string; currency: string } | null>(null);
  const [selectedOfferForPricing, setSelectedOfferForPricing] = useState<SkyLinkFlightOffer | null>(null);
  const [isPricingVerifying, setIsPricingVerifying] = useState(false);
  const [verifiedPricing, setVerifiedPricing] = useState<SkyLinkPricingResponse['data'] | null>(null);
  
  // Passenger / Reservation Modal State
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationResult, setReservationResult] = useState<SkyLinkReserveResponse['data'] | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [hasPaidViaPaystack, setHasPaidViaPaystack] = useState(false);
  const [paystackReceiptData, setPaystackReceiptData] = useState<{ reference: string; amount: string } | null>(null);
  const [guestDetails, setGuestDetails] = useState<SkyLinkGuest>({
    title: 'Mr',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country_code: '234',
    dob: '1995-05-12',
    gender: 'male',
    passport_number: '',
    passport_expiry: '2031-10-20',
    passport_issue_date: '2021-10-21',
    nationality: 'NG'
  });

  // Pre-fill user information if logged into Client Portal
  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const parts = user.fullName.trim().split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      setGuestDetails(prev => ({
        ...prev,
        first_name: prev.first_name || firstName,
        last_name: prev.last_name || lastName,
        email: prev.email || user.email,
        phone: prev.phone || user.phone.replace(/[^0-9]/g, '').slice(-10),
        passport_number: prev.passport_number || user.passportNumber || '',
      }));
    }
  }, []);

  // Flight search form state
  const [flightData, setFlightData] = useState<FlightSearchData>(() => {
    try {
      const saved = sessionStorage.getItem('horizon_pending_flight_search');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          tripType: parsed.tripType || 'round',
          from: parsed.from || 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
          to: parsed.to || 'London (LHR) - London Heathrow Airport, United Kingdom',
          departureDate: parsed.departureDate || '2026-09-15',
          returnDate: parsed.returnDate || '2026-10-05',
          passengers: parsed.passengers || 1,
          cabinClass: parsed.cabinClass || 'Economy'
        };
      }
    } catch {}
    return {
      tripType: 'round',
      from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
      to: 'London (LHR) - London Heathrow Airport, United Kingdom',
      departureDate: '2026-09-15',
      returnDate: '2026-10-05',
      passengers: 1,
      cabinClass: 'Economy'
    };
  });

  // Check if a specific flight offer was selected on homepage
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('horizon_pending_flight_search');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedOffer) {
          setSelectedOfferForPricing(parsed.selectedOffer);
          setIsReserveModalOpen(true);
        }
        sessionStorage.removeItem('horizon_pending_flight_search');
      }
    } catch {}
  }, []);

  const handleSwapAirports = () => {
    setFlightData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
    onSuccessToast('Swapped departure and destination airports.');
  };

  // Hotel search form state
  const [hotelData, setHotelData] = useState<HotelSearchData>({
    destination: 'Dubai, UAE',
    checkIn: '2026-09-20',
    checkOut: '2026-09-26',
    guests: 2,
    rooms: 1,
    starPreference: '5-Star Luxury Resort'
  });

  // Selected Holiday Package modal/inquiry
  const [selectedPkg, setSelectedPkg] = useState<HolidayPackage | null>(null);

  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'flight_booking',
      fullName: 'Flight Passenger',
      phone: '+234 Client Inquiry',
      service: 'Flight Ticket Reservation',
      destination: flightData.to,
      summary: `${flightData.tripType.toUpperCase()} Flight: ${flightData.from} ➔ ${flightData.to} (${flightData.passengers} ${flightData.passengers === 1 ? 'Passenger' : 'Passengers'}, ${flightData.cabinClass})`,
      details: {
        from: flightData.from,
        to: flightData.to,
        departDate: flightData.departDate,
        returnDate: flightData.returnDate,
        passengers: flightData.passengers,
        cabinClass: flightData.cabinClass,
        tripType: flightData.tripType
      },
      notes: `Departure: ${flightData.departDate} • Class: ${flightData.cabinClass}`
    });

    const msg = formatFlightInquiryWhatsApp(flightData);
    onSuccessToast('Flight search query dispatched! Opening official ticketing desk on WhatsApp.');
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  const handleSkyLinkSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSkyLinkSearching(true);
    setSkyLinkOffers(null);
    setSelectedOfferForPricing(null);
    setVerifiedPricing(null);

    // Extract IATA codes or default
    const originMatch = flightData.from.match(/\b([A-Z]{3})\b/);
    const destMatch = flightData.to.match(/\b([A-Z]{3})\b/);
    const fromCode = originMatch ? originMatch[1] : (flightData.from.trim().substring(0, 3).toUpperCase() || 'LOS');
    const toCode = destMatch ? destMatch[1] : (flightData.to.trim().substring(0, 3).toUpperCase() || 'LHR');

    try {
      const res = await skyLinkService.searchFlights({
        search_mode: 'external',
        from: fromCode,
        to: toCode,
        flight_type: flightData.tripType === 'round' ? 'roundtrip' : 'oneway',
        flights_departure_date: flightData.departureDate,
        flights_return_date: flightData.tripType === 'round' ? flightData.returnDate : undefined,
        adults: Math.min(flightData.passengers, 9),
        class: (((flightData.cabinClass || 'economy').toLowerCase().replace(' ', '_'))) as any,
        currency: currency
      });

      if (res.success && res.data.flights) {
        setSkyLinkOffers(res.data.flights);
        setSkyLinkMeta(res.data.meta);
        onSuccessToast(`SkyLink API: Found ${res.data.flights.length} live flight offers from ${fromCode} to ${toCode}`);
      }
    } catch {
      onSuccessToast('SkyLink search completed.');
    } finally {
      setIsSkyLinkSearching(false);
    }
  };

  const handleVerifyPricing = async (offer: SkyLinkFlightOffer) => {
    setSelectedOfferForPricing(offer);
    setIsPricingVerifying(true);
    setVerifiedPricing(null);

    try {
      const res = await skyLinkService.priceFlight({
        booking_token: offer.booking_token,
        passengers: { adults: flightData.passengers, children: 0, infants: 0 },
        currency: currency,
        class: (offer.class || flightData.cabinClass || 'economy').toLowerCase()
      });

      if (res.success) {
        setVerifiedPricing(res.data);
        onSuccessToast('SkyLink API: Fare verified & locked for 15 minutes.');
      }
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : 'Supplier timeout';
      onSuccessToast('Failed to verify pricing: ' + errorMsg);
    } finally {
      setIsPricingVerifying(false);
    }
  };

  const handleOpenReserveModal = (offer: SkyLinkFlightOffer) => {
    setSelectedOfferForPricing(offer);
    setReservationResult(null);
    setReservationError(null);
    setHasPaidViaPaystack(false);
    setPaystackReceiptData(null);
    setIsReserveModalOpen(true);
  };

   const executeSkyLinkReservation = async () => {
    if (!selectedOfferForPricing) return;
     
    setIsReserving(true);
    setReservationError(null);

    try {
      // WORKFLOW STEP 3: Must use the validated booking_token returned from /pricing (Step 2)
      if (!verifiedPricing?.booking_token) {
        throw new Error('Fare verification (Step 2) is required before issuing live PNR.');
      }
      const activeToken = verifiedPricing.booking_token;
      const verifiedFare = `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}`;

      const res = await skyLinkService.reserveFlight({
        booking_token: activeToken,
        passengers: { adults: flightData.passengers, children: 0, infants: 0 },
        travellers: {
          primary_guest: guestDetails
        },
        ticket_time_limit_hours: 48
      });

      if (res.success) {
        setReservationResult(res.data);
        saveSubmission({
          type: 'flight_booking',
          fullName: `${guestDetails.title} ${guestDetails.first_name} ${guestDetails.last_name}`,
          phone: `+${guestDetails.country_code} ${guestDetails.phone}`,
          email: guestDetails.email,
          service: 'Confirmed PNR Flight Reservation',
          destination: selectedOfferForPricing.arrival_code,
          summary: `PNR: ${res.data.pnr} • ${selectedOfferForPricing.airline_name} (${selectedOfferForPricing.flight_no}) ${formatFullRoute(selectedOfferForPricing.departure_code, selectedOfferForPricing.arrival_code)}`,
          details: {
            pnr: res.data.pnr,
            booking_reference: res.data.booking_reference,
            carrier: res.data.carrier,
            airline: selectedOfferForPricing.airline_name,
            flight_no: selectedOfferForPricing.flight_no,
            from: selectedOfferForPricing.departure_code,
            to: selectedOfferForPricing.arrival_code,
            departure_time: selectedOfferForPricing.departure_time,
            arrival_time: selectedOfferForPricing.arrival_time,
            fare: verifiedFare,
            ticket_deadline: res.data.ticket_deadline,
            primary_passenger: `${guestDetails.title} ${guestDetails.first_name} ${guestDetails.last_name}`,
            passport_number: guestDetails.passport_number,
            nationality: guestDetails.nationality
          },
          notes: `Official PNR issued via SkyLink API (Amadeus / Verteil NDC). Ticket Deadline: ${res.data.ticket_deadline}`
        });

        // Automated Itinerary Email Dispatch
        setIsEmailSending(true);
        sendFlightItineraryEmail({
          to: guestDetails.email,
          passengerName: `${guestDetails.title} ${guestDetails.first_name} ${guestDetails.last_name}`,
          pnr: res.data.pnr,
          bookingReference: res.data.booking_reference,
          airlineName: selectedOfferForPricing.airline_name,
          flightNo: selectedOfferForPricing.flight_no,
          from: selectedOfferForPricing.departure_code,
          toCode: selectedOfferForPricing.arrival_code,
          departureTime: selectedOfferForPricing.departure_time,
          arrivalTime: selectedOfferForPricing.arrival_time,
          fare: verifiedFare,
          ticketDeadline: res.data.ticket_deadline,
          phone: `+${guestDetails.country_code} ${guestDetails.phone}`,
          passportNumber: guestDetails.passport_number,
          nationality: guestDetails.nationality,
          cabinClass: 'Economy Class (Confirmed)'
        }).then((emailRes) => {
          setIsEmailSending(false);
          if (emailRes.success) {
            setIsEmailSent(true);
          }
        }).catch((err) => {
          console.error('Email dispatch error:', err);
          setIsEmailSending(false);
        });

        onSuccessToast(`Success! PNR ${res.data.pnr} confirmed and itinerary emailed to ${guestDetails.email}.`);
      }
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : 'Reservation blocked or failed.';
      setReservationError(errorMsg);
    } finally {
      setIsReserving(false);
    }
  };
  const handleExecuteReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferForPricing) return;
    setIsPaystackOpen(true);
  };

  const handleDownloadCustomerItinerary = () => {
    if (!reservationResult || !selectedOfferForPricing) return;
    try {
      const activeFare = verifiedPricing 
        ? `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}`
        : `${selectedOfferForPricing.currency} ${selectedOfferForPricing.price.toLocaleString()}`;

      generateItineraryPDF({
        pnr: reservationResult?.pnr || 'Pending',
        bookingReference: reservationResult.booking_reference,
        carrier: reservationResult.carrier,
        airlineName: selectedOfferForPricing.airline_name,
        flightNo: selectedOfferForPricing.flight_no,
        from: selectedOfferForPricing.departure_code,
        to: selectedOfferForPricing.arrival_code,
        departureTime: selectedOfferForPricing.departure_time,
        arrivalTime: selectedOfferForPricing.arrival_time,
        fare: activeFare,
        ticketDeadline: reservationResult.ticket_deadline,
        passengerName: `${guestDetails.title} ${guestDetails.first_name} ${guestDetails.last_name}`,
        passportNumber: guestDetails.passport_number,
        nationality: guestDetails.nationality,
        phone: guestDetails.country_code ? `+${guestDetails.country_code} ${guestDetails.phone}` : guestDetails.phone,
        email: guestDetails.email,
        cabinClass: 'Economy Class (Confirmed)',
        baggage: '2 x 23kg Checked Bags + 7kg Cabin',
        status: reservationResult.status || 'CONFIRMED'
      });
      onSuccessToast('Official PDF itinerary slip downloaded!');
    } catch (err) {
      console.error('Error generating PDF itinerary:', err);
      onSuccessToast('Error generating PDF itinerary.');
    }
  };

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'hotel_booking',
      fullName: 'Hotel Guest',
      phone: '+234 Client Inquiry',
      service: 'Hotel & Resort Reservation',
      destination: hotelData.destination,
      summary: `${hotelData.starPreference} in ${hotelData.destination} • ${hotelData.rooms} Room(s), ${hotelData.guests} Guest(s)`,
      details: {
        destination: hotelData.destination,
        checkIn: hotelData.checkIn,
        checkOut: hotelData.checkOut,
        rooms: hotelData.rooms,
        guests: hotelData.guests,
        starPreference: hotelData.starPreference
      },
      notes: `Check-in: ${hotelData.checkIn} to ${hotelData.checkOut}`
    });

    const msg = formatHotelInquiryWhatsApp(hotelData);
    onSuccessToast('Hotel search query dispatched! Connecting with hospitality desk.');
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  const handleHolidayEnquire = (pkg: HolidayPackage) => {
    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'holiday_inquiry',
      fullName: 'Tour Client',
      phone: '+234 Client Inquiry',
      service: 'Holiday & Vacation Package',
      destination: pkg.destination,
      summary: `${pkg.title} (${pkg.destination}) • ${pkg.duration}`,
      details: {
        packageTitle: pkg.title,
        destination: pkg.destination,
        duration: pkg.duration,
        inclusions: pkg.inclusions
      },
      notes: `Requested vacation package: ${pkg.title}`
    });

    const msg = formatHolidayInquiryWhatsApp({
      title: pkg.title,
      destination: pkg.destination,
      duration: pkg.duration
    });
    onSuccessToast(`Inquiry for ${pkg.title} generated! Forwarding to tours specialist on WhatsApp.`);
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0b172a] text-white py-12 sm:py-24 rounded-2xl sm:rounded-3xl mx-2 sm:mx-8 px-4 sm:px-12 border-2 border-[#CFAE70]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Travel & Island Getaway"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b172a] via-[#0b172a]/90 to-[#1B365D]/80" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#F3E5AB] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Palmtree className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
            <span className="truncate">Corporate Travel & Holiday Tours</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold font-serif-luxury tracking-tight leading-tight">
            Flights, Hotels, and Holiday Packages
          </h1>

          <p className="text-base sm:text-2xl text-[#E4C88E] font-medium font-serif-luxury">
            Partnered with World-Leading Airlines & 5-Star Luxury Resorts
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            We partner with top airlines and luxury hotels to get you the best corporate airfares, verified visa-compliant itineraries, and unforgettable vacation getaways in Dubai, Zanzibar, Europe, and Kenya.
          </p>

          {/* Quick Tab Switcher */}
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 pt-2">
            <button
              onClick={() => setActiveTab('flights')}
              className={`px-2.5 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'flights'
                  ? 'bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Flights</span>
            </button>

            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-2.5 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'hotels'
                  ? 'bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Hotel className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Hotels</span>
            </button>

            <button
              onClick={() => setActiveTab('holidays')}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'holidays'
                  ? 'bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Palmtree className="w-4 h-4" />
              <span>Holiday Packages</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN BOOKING ENGINES & PACKAGES CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* SUB-SECTION 1: FLIGHT BOOKING FORM */}
        {activeTab === 'flights' && (
          <div className="glass-white rounded-3xl p-6 sm:p-10 border-2 border-[#CFAE70]/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
            {/* Certified Airline Booking Desk Top Banner */}
            <div className="bg-gradient-to-r from-[#0d1b2e] via-[#142a47] to-[#0c182b] border border-[#CFAE70]/40 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#CFAE70]/20 border border-[#CFAE70] flex items-center justify-center text-[#E4C88E] shrink-0">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CFAE70]">Certified Airline Booking Desk</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">LIVE GDS SEATS</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Real-time flight search & verified fares across Qatar Airways, British Airways, Emirates, Air Peace, and Virgin Atlantic.
                  </p>
                </div>
              </div>
              <a
                href={`tel:${PRIMARY_PHONE}`}
                className="inline-flex items-center gap-1.5 bg-[#CFAE70]/20 hover:bg-[#CFAE70]/30 text-[#E4C88E] border border-[#CFAE70]/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span>Call Ticketing Desk: {PRIMARY_PHONE}</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1B365D] font-serif-luxury flex items-center gap-2">
                  <Plane className="w-6 h-6 text-[#B8934C]" />
                  <span>Search International & Domestic Flights</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time GDS availability for Qatar Airways, Emirates, British Airways, Air Peace, and Virgin Atlantic.
                </p>
              </div>

              {/* Trip type selector */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                {(['round', 'one-way', 'multi'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFlightData({ ...flightData, tripType: type })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      flightData.tripType === type
                        ? 'bg-[#1B365D] text-[#F3E5AB] shadow-sm'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    {type === 'round' ? 'Round Trip' : type === 'one-way' ? 'One Way' : 'Multi City'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSkyLinkSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* From */}
                <div>
                  <AirportDropdown
                    id="flight-from"
                    label="Departure Airport (From)"
                    value={flightData.from}
                    onChange={(val) => setFlightData({ ...flightData, from: val })}
                    placeholder="Select Departure Airport..."
                    iconType="departure"
                    required
                  />
                </div>

                {/* To */}
                <div>
                  <AirportDropdown
                    id="flight-to"
                    label="Destination Airport (To)"
                    value={flightData.to}
                    onChange={(val) => setFlightData({ ...flightData, to: val })}
                    placeholder="Select Destination Airport..."
                    iconType="destination"
                    required
                  />
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Departure Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={flightData.departureDate}
                    onChange={(e) => setFlightData({ ...flightData, departureDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Return Date {flightData.tripType === 'one-way' && '(Optional)'}</span>
                  </label>
                  <input
                    type="date"
                    disabled={flightData.tripType === 'one-way'}
                    value={flightData.returnDate || ''}
                    onChange={(e) => setFlightData({ ...flightData, returnDate: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none ${
                      flightData.tripType === 'one-way'
                        ? 'bg-slate-200/60 text-slate-400 border-slate-200'
                        : 'bg-slate-50 border-slate-300 focus:border-[#CFAE70] text-slate-800 cursor-pointer'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Route Shortcuts & Swap Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 py-1.5 px-3 bg-slate-50/90 rounded-xl border border-slate-200 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B8934C]" />
                    Popular Routes:
                  </span>
                  {[
                    { label: 'LOS ➔ LHR (London)', from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria', to: 'London (LHR) - London Heathrow Airport, United Kingdom' },
                    { label: 'ABV ➔ LHR (London)', from: 'Abuja (ABV) - Nnamdi Azikiwe International Airport, Nigeria', to: 'London (LHR) - London Heathrow Airport, United Kingdom' },
                    { label: 'LOS ➔ YYZ (Toronto)', from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria', to: 'Toronto (YYZ) - Toronto Pearson International Airport, Canada' },
                    { label: 'LOS ➔ JFK (New York)', from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria', to: 'New York (JFK) - John F. Kennedy International Airport, United States' },
                    { label: 'LOS ➔ DXB (Dubai)', from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria', to: 'Dubai (DXB) - Dubai International Airport, United Arab Emirates' },
                    { label: 'LOS ➔ WAW (Warsaw)', from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria', to: 'Warsaw (WAW) - Warsaw Chopin Airport, Poland' },
                  ].map((route) => (
                    <button
                      key={route.label}
                      type="button"
                      onClick={() => setFlightData(prev => ({ ...prev, from: route.from, to: route.to }))}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white hover:bg-[#CFAE70]/20 text-slate-700 hover:text-[#1B365D] border border-slate-200 transition-all cursor-pointer font-medium shadow-2xs"
                    >
                      {route.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSwapAirports}
                  className="text-xs text-[#1B365D] hover:text-[#A98745] font-bold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Swap departure and destination airports"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Swap Departure & Destination</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Passengers */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Number of Passengers</span>
                  </label>
                  <select
                    value={flightData.passengers}
                    onChange={(e) => setFlightData({ ...flightData, passengers: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>

                {/* Cabin Class */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cabin Class Preference
                  </label>
                  <select
                    value={flightData.cabinClass}
                    onChange={(e) => setFlightData({ ...flightData, cabinClass: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                  >
                    <option value="Economy">Economy Class</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>

                {/* Search Flights CTA Buttons */}
                <div className="sm:col-span-2 md:col-span-1 flex items-end gap-2">
                  <button
                    type="submit"
                    disabled={isSkyLinkSearching}
                    className="gold-shimmer-btn flex-1 bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer h-[42px] disabled:opacity-50"
                  >
                    {isSkyLinkSearching ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plane className="w-4 h-4" />
                    )}
                    <span>{isSkyLinkSearching ? 'Searching SkyLink...' : 'Search Live Fares'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFlightSubmit}
                    title="Inquire directly via WhatsApp Desk"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer h-[42px] shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            </form>

            {/* LIVE FLIGHT RESULTS */}
            {isSkyLinkSearching && (
              <div className="p-8 rounded-2xl bg-[#0f2038] text-center space-y-3 text-white border border-[#CFAE70]/30 shadow-inner">
                <RefreshCw className="w-8 h-8 text-[#CFAE70] animate-spin mx-auto" />
                <div className="text-sm font-bold font-serif-luxury">Querying Live Global Airline Inventory...</div>
                <p className="text-xs text-slate-300">
                  Connecting to international & domestic live booking engines for real-time seat availability.
                </p>
              </div>
            )}

            {skyLinkOffers && !isSkyLinkSearching && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#1B365D] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Live Verified Flight Offers</span>
                      <span className="text-xs font-normal text-slate-500 font-mono">
                        ({skyLinkMeta?.total_flights || skyLinkOffers.length} available)
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Step 1 Complete. Click &ldquo;Verify Live Fare (Step 2)&rdquo; to validate live seat pricing and reserve your seat.
                    </p>
                    <div className="text-xs font-bold text-[#B8934C] mt-1">
                      Full Route: {formatFullRoute(skyLinkMeta?.origin || flightData.from, skyLinkMeta?.destination || flightData.to)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {skyLinkOffers.map((offer) => {
                    const isOfferSelected = selectedOfferForPricing?.booking_token === offer.booking_token;
                    return (
                      <div
                        key={offer.booking_token}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isOfferSelected
                            ? 'bg-slate-50 border-[#CFAE70] shadow-md ring-1 ring-[#CFAE70]'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Airline Info */}
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <AirlineLogo airlineId={(offer.airline || offer.airline_name || '').toLowerCase()} className="h-8" />
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-[#1B365D]">
                                {offer.airline_name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                Flight {offer.flight_no} · {offer.class}
                              </div>
                            </div>
                          </div>

                          {/* Flight Route & Timings */}
                          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 flex-1">
                            <div className="text-left">
                              <div className="text-base sm:text-lg font-extrabold text-[#1B365D]">
                                {offer.departure_time}
                              </div>
                              <div className="text-xs font-semibold text-slate-600 font-mono">
                                {offer.departure_code}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium max-w-[140px] truncate" title={formatFullCityAirport(offer.departure_code)}>
                                {formatFullCityAirport(offer.departure_code)}
                              </div>
                            </div>

                            <div className="flex flex-col items-center px-2">
                              <span className="text-[10px] text-slate-400 font-medium">{offer.duration_time}</span>
                              <div className="w-20 sm:w-28 h-0.5 bg-slate-300 relative my-1">
                                <div className="absolute -top-1 right-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-[#CFAE70]" />
                              </div>
                              <span className="text-[10px] text-emerald-700 font-semibold">Direct Flight</span>
                            </div>

                            <div className="text-right">
                              <div className="text-base sm:text-lg font-extrabold text-[#1B365D]">
                                {offer.arrival_time}
                              </div>
                              <div className="text-xs font-semibold text-slate-600 font-mono">
                                {offer.arrival_code}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium max-w-[140px] truncate" title={formatFullCityAirport(offer.arrival_code)}>
                                {formatFullCityAirport(offer.arrival_code)}
                              </div>
                            </div>

                            <div className="hidden sm:block text-xs text-slate-500 border-l border-slate-200 pl-4">
                              <span className="block font-medium">Baggage:</span>
                              <span className="text-slate-800 font-bold">{formatBaggage(offer.baggage)}</span>
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                            <div className="text-left lg:text-right">
                              <span className={`text-[10px] uppercase tracking-wider block font-bold ${isOfferSelected && verifiedPricing ? 'text-emerald-700' : 'text-slate-400'}`}>
                                {isOfferSelected && verifiedPricing ? 'Verified Live Fare (Step 2)' : 'Provisional Fare (Step 1)'}
                              </span>
                              <span className={`text-base sm:text-xl font-extrabold ${isOfferSelected && verifiedPricing ? 'text-emerald-700' : 'text-[#1B365D]'}`}>
                                {isOfferSelected && verifiedPricing
                                  ? `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}`
                                  : `${currency} ${offer.price.toLocaleString()}`}
                              </span>
                              {isOfferSelected && verifiedPricing?.price_changed && (
                                <span className="block text-[10px] text-amber-700 font-medium">
                                  Updated (was {currency} {verifiedPricing.original_price.toLocaleString()})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {verifiedPricing && isOfferSelected ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReserveModal(offer)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                                >
                                  <Ticket className="w-3.5 h-3.5" />
                                  <span>Issue Live PNR (Step 3)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isPricingVerifying && isOfferSelected}
                                  onClick={() => handleVerifyPricing(offer)}
                                  className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all disabled:opacity-50"
                                >
                                  {isPricingVerifying && isOfferSelected ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  )}
                                  <span>{isPricingVerifying && isOfferSelected ? 'Verifying...' : 'Verify Live Fare (Step 2)'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Full Route Footer Pill */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Route: <strong className="text-slate-700">{formatFullRoute(offer.departure_code, offer.arrival_code)}</strong></span>
                          <span className="text-[10px] text-slate-400">Class: {offer.class}</span>
                        </div>

                        {/* If this offer has verified pricing */}
                        {verifiedPricing && isOfferSelected && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900 animate-in fade-in">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>
                                <strong>Fare Verified:</strong> {verifiedPricing.currency} {verifiedPricing.verified_price.toLocaleString()}{typeof verifiedPricing.message === 'string' ? ` • ${verifiedPricing.message}` : ''}{typeof verifiedPricing.expires_at === 'string' ? ` Valid until ${verifiedPricing.expires_at}.` : ''}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                              Refreshed Token Ready
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-SECTION 2: HOTEL BOOKING FORM */}
        {activeTab === 'hotels' && (
          <div className="glass-white rounded-3xl p-6 sm:p-10 border-2 border-[#CFAE70]/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1B365D] font-serif-luxury flex items-center gap-2">
                <Hotel className="w-6 h-6 text-[#B8934C]" />
                <span>Find Verified International Hotels & Suites</span>
              </h3>
              <p className="text-xs text-slate-500">
                Guaranteed verifiable hotel vouchers for visa submission and luxury vacation stays.
              </p>
            </div>

            <form onSubmit={handleHotelSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Destination City / Country</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hotelData.destination}
                    onChange={(e) => setHotelData({ ...hotelData, destination: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                    placeholder="e.g. Dubai, London, Paris, Istanbul"
                  />
                </div>

                {/* Check-in */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Check-in Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={hotelData.checkIn}
                    onChange={(e) => setHotelData({ ...hotelData, checkIn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Check-out Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={hotelData.checkOut}
                    onChange={(e) => setHotelData({ ...hotelData, checkOut: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Star rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Star / Category Preference</span>
                  </label>
                  <select
                    value={hotelData.starPreference}
                    onChange={(e) => setHotelData({ ...hotelData, starPreference: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                  >
                    <option value="5-Star Luxury Resort">5-Star Luxury Resort / Hotel</option>
                    <option value="4-Star Premium Hotel">4-Star Premium Hotel</option>
                    <option value="3-Star Budget Friendly">3-Star Budget Friendly</option>
                    <option value="Serviced Apartment / Suite">Serviced Apartment / Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Number of Guests</span>
                  </label>
                  <select
                    value={hotelData.guests}
                    onChange={(e) => setHotelData({ ...hotelData, guests: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>Number of Rooms</span>
                  </label>
                  <select
                    value={hotelData.rooms}
                    onChange={(e) => setHotelData({ ...hotelData, rooms: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer h-[42px]"
                  >
                    <Hotel className="w-4 h-4" />
                    <span>Find Hotels & Rates</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* SUB-SECTION 3: HOLIDAY PACKAGES GRID */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
              FEATURED VACATION EXPERIENCES
            </span>
            <h2 className="text-3xl font-bold text-[#1B365D] font-serif-luxury">
              Curated All-Inclusive Holiday Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Handcrafted itineraries with 5-star hotels, daily breakfasts, guided excursions, and visa processing included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HOLIDAY_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#CFAE70] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c182a] via-black/30 to-transparent" />
                    
                    {pkg.tag && (
                      <div className="absolute top-4 left-4 bg-[#A61C1C] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {pkg.tag}
                      </div>
                    )}

                    <div className="absolute top-4 right-4 bg-[#1B365D]/90 backdrop-blur-md text-[#F3E5AB] text-xs font-bold px-3 py-1 rounded-full border border-[#CFAE70]/40 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pkg.rating} Rating</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs text-[#E4C88E] font-semibold block">
                        📍 {pkg.destination} • {pkg.duration}
                      </span>
                      <h3 className="text-xl font-bold font-serif-luxury">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    {/* Price banner */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 font-medium">Starting from:</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#1B365D]">
                        {pkg.pricePerPerson[currency === 'USD' ? 'USD' : 'NGN']} <span className="text-xs font-normal text-slate-500">/ person</span>
                      </span>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#B8934C]" />
                        <span>Package Inclusions & Perks:</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {pkg.inclusions.slice(0, 4).map((inc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
                      <strong>Itinerary:</strong> {pkg.itinerarySummary}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleHolidayEnquire(pkg)}
                    className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Palmtree className="w-4 h-4" />
                    <span>Enquire Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={createWhatsAppUrl(`Hello Horizon Move Limited, I want to book the ${pkg.title} package.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AIRLINE & HOTEL TRUST BADGES */}
      <section className="bg-slate-50 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-1 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
              OFFICIAL IATA TICKETING DESK
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1B365D] font-serif-luxury">
              Global Carrier & Airline Partners
            </h3>
            <p className="text-xs text-slate-500">
              Direct GDS ticketing with verified PNRs, baggage waivers, and student fare discounts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {PARTNER_AIRLINES.map((airline) => (
              <div
                key={airline.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#CFAE70] transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <AirlineLogo airlineId={airline.id} className="h-7" showText={false} />
                <div className="text-center">
                  <span className="font-bold text-xs text-[#1B365D] block group-hover:text-[#A98745] transition-colors">
                    {airline.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {airline.iata} • {airline.country}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="glass-navy p-8 sm:p-12 rounded-3xl border-2 border-[#CFAE70]/40 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif-luxury">
              Need a Customized Corporate or Family Tour?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak with our senior ticketing and tour coordinators for bespoke group packages and corporate travel accounts.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-xl cursor-pointer"
            >
              Request Custom Itinerary
            </button>
            <a
              href={createWhatsAppUrl('Hello Horizon Move Limited, I need a custom flight and hotel itinerary.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Tour Desk WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. SKYLINK PNR RESERVATION MODAL */}
      {isReserveModalOpen && selectedOfferForPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#CFAE70] space-y-6 my-8 text-slate-800 relative">
            <button
              onClick={() => setIsReserveModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!reservationResult ? (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8934C]">
                    <Ticket className="w-4 h-4" />
                    <span>SkyLink API · Step 3: Flight Reservation</span>
                  </div>
                  <h3 className="text-xl font-bold font-serif-luxury text-[#1B365D]">
                    Passenger & Passport Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedOfferForPricing.airline_name} ({selectedOfferForPricing.flight_no}) · <span className="font-semibold text-[#1B365D]">{formatFullRoute(selectedOfferForPricing.departure_code, selectedOfferForPricing.arrival_code)}</span> · <span className="font-bold text-emerald-700">{verifiedPricing ? `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}` : `${currency} ${selectedOfferForPricing.price.toLocaleString()}`}</span>
                  </p>
                </div>

                {/* Section 7 Payment Responsibility Notice */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Payment Responsibility Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    The <code className="text-amber-950 font-semibold font-mono">/api/flights/reserve</code> endpoint generates an authentic, live airline order in the GDS. Ensure payment terms are fulfilled.
                  </p>
                </div>

                {reservationError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{reservationError}</span>
                  </div>
                )}

                <form onSubmit={handleExecuteReserve} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                      <select
                        value={guestDetails.title}
                        onChange={(e) => setGuestDetails({ ...guestDetails, title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name (As on Passport)</label>
                      <input
                        type="text"
                        required
                        value={guestDetails.first_name}
                        onChange={(e) => setGuestDetails({ ...guestDetails, first_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name / Surname</label>
                      <input
                        type="text"
                        required
                        value={guestDetails.last_name}
                        onChange={(e) => setGuestDetails({ ...guestDetails, last_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={guestDetails.email}
                        onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={guestDetails.country_code}
                          onChange={(e) => setGuestDetails({ ...guestDetails, country_code: e.target.value })}
                          className="w-16 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70] text-center"
                          placeholder="234"
                        />
                        <input
                          type="tel"
                          required
                          value={guestDetails.phone}
                          onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                          placeholder="08012345678"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={guestDetails.dob}
                        onChange={(e) => setGuestDetails({ ...guestDetails, dob: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={guestDetails.gender}
                        onChange={(e) => setGuestDetails({ ...guestDetails, gender: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nationality (ISO)</label>
                      <input
                        type="text"
                        required
                        value={guestDetails.nationality}
                        onChange={(e) => setGuestDetails({ ...guestDetails, nationality: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                        placeholder="NG"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Passport Number</label>
                      <input
                        type="text"
                        required
                        value={guestDetails.passport_number}
                        onChange={(e) => setGuestDetails({ ...guestDetails, passport_number: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                        placeholder="A12345678"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Passport Expiry</label>
                      <input
                        type="date"
                        required
                        value={guestDetails.passport_expiry}
                        onChange={(e) => setGuestDetails({ ...guestDetails, passport_expiry: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Passport Issue Date</label>
                      <input
                        type="date"
                        required
                        value={guestDetails.passport_issue_date}
                        onChange={(e) => setGuestDetails({ ...guestDetails, passport_issue_date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#CFAE70]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsReserveModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isReserving}
                      className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isReserving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Ticket className="w-4 h-4" />
                      )}
                      <span>{isReserving ? 'Issuing PNR...' : 'Generate Live PNR (Step 3)'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Live Airline Reservation Confirmed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#1B365D]">
                    Booking Reference (PNR) Issued
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Live airline order created for {guestDetails.title} {guestDetails.first_name} {guestDetails.last_name}.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto space-y-3 text-left font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans">Airline PNR:</span>
                    <span className="text-lg font-bold text-[#1B365D] tracking-wider">{reservationResult.pnr}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans">Carrier & Flight:</span>
                    <span className="font-semibold text-slate-800">{reservationResult.carrier} · {selectedOfferForPricing.airline_name} ({selectedOfferForPricing.flight_no})</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans">Full Route:</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[240px]">
                      {formatFullRoute(selectedOfferForPricing.departure_code, selectedOfferForPricing.arrival_code)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans">Total Fare:</span>
                    <span className="font-bold text-emerald-700">
                      {verifiedPricing ? `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}` : `${selectedOfferForPricing.currency} ${selectedOfferForPricing.price.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-sans">Booking Status:</span>
                    <span className="text-emerald-700 font-bold uppercase">{reservationResult.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Ticketing Deadline:</span>
                    <span className="text-rose-600 font-bold">{reservationResult.ticket_deadline} ({reservationResult.ticket_time_limit_hours}h)</span>
                  </div>
                </div>

                {/* Automated Email Notice */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>Automated Itinerary Email</span>
                    </div>
                    {isEmailSending ? (
                      <span className="text-[10px] text-amber-700 font-semibold animate-pulse flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Dispatching...
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Sent to Inbox
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    A copy of this flight itinerary and booking confirmation has been dispatched to <strong>{guestDetails.email}</strong>.
                  </p>
                </div>

                {/* Paystack Online Payment Card */}
                <div className="bg-gradient-to-br from-[#081326] via-[#0E203C] to-[#142642] text-white p-4 sm:p-5 rounded-2xl border border-[#00C3F7]/40 max-w-md mx-auto text-left shadow-lg space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#00C3F7] text-[#081326] flex items-center justify-center font-black text-sm shadow">
                        P
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-white tracking-wide">Paystack Instant Checkout</span>
                          <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Debit Card, Instant Bank Transfer & USSD
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Fare</div>
                      <div className="text-sm sm:text-base font-black text-[#00C3F7] font-mono">
                        {verifiedPricing ? `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}` : `${selectedOfferForPricing.currency} ${selectedOfferForPricing.price.toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  {hasPaidViaPaystack ? (
                    <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl p-3 text-center space-y-1">
                      <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Payment Verified via Paystack!</span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono">
                        Reference: {paystackReceiptData?.reference}
                      </div>
                      <div className="text-[10px] text-emerald-200">
                        Official Payment Receipt and E-ticket issued to {guestDetails.email}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setIsPaystackOpen(true)}
                        className="w-full py-3 bg-[#00C3F7] hover:bg-[#00B0DE] text-[#081326] font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay {verifiedPricing ? `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}` : `${selectedOfferForPricing.currency} ${selectedOfferForPricing.price.toLocaleString()}`} with Paystack</span>
                      </button>
                      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>256-Bit Encrypted • Immediate Airline Fare Lock</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* What Happens Next Roadmap Card */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2.5">
                  <h4 className="text-xs font-bold text-[#1B365D] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B8934C]" />
                    <span>What Happens Next (Post-Reservation Flow)</span>
                  </h4>
                  <ol className="text-xs text-slate-700 space-y-2 pl-4 list-decimal">
                    <li>
                      <strong>Seats Held in Airline GDS:</strong> Your seats are blocked under PNR <span className="font-mono font-bold text-[#1B365D]">{reservationResult.pnr}</span> until the ticketing deadline.
                    </li>
                    <li>
                      <strong>Payment Confirmation:</strong> Contact Horizon Move ticketing desk to confirm your payment (Bank transfer or card) and lock in this guaranteed fare.
                    </li>
                    <li>
                      <strong>13-Digit E-Ticket Issuance:</strong> Our ticketing officer will issue your final electronic ticket with ticket number and barcode, sent via WhatsApp and Email.
                    </li>
                    <li>
                      <strong>Web Check-in & Flying:</strong> 24 hours before flight, online check-in opens for seat selection and boarding pass generation.
                    </li>
                  </ol>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  {/* Download Customer Itinerary Button (PDF) */}
                  <button
                    type="button"
                    onClick={handleDownloadCustomerItinerary}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#142642] hover:bg-[#1B365D] text-[#E4C88E] border border-[#CFAE70]/50 text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4 text-[#CFAE70]" />
                    <span>Download Itinerary Slip (PDF)</span>
                  </button>

                  {/* Resend Itinerary Email Button */}
                  <button
                    type="button"
                    disabled={isEmailSending}
                    onClick={async () => {
                      if (!reservationResult || !selectedOfferForPricing) return;
                      setIsEmailSending(true);
                      const res = await sendFlightItineraryEmail({
                        to: guestDetails.email,
                        passengerName: `${guestDetails.title} ${guestDetails.first_name} ${guestDetails.last_name}`,
                        pnr: reservationResult.pnr,
                        bookingReference: reservationResult.booking_reference,
                        airlineName: selectedOfferForPricing.airline_name,
                        flightNo: selectedOfferForPricing.flight_no,
                        from: selectedOfferForPricing.departure_code,
                        toCode: selectedOfferForPricing.arrival_code,
                        departureTime: selectedOfferForPricing.departure_time,
                        arrivalTime: selectedOfferForPricing.arrival_time,
                        fare: verifiedPricing ? `${verifiedPricing.currency} ${verifiedPricing.verified_price.toLocaleString()}` : `${selectedOfferForPricing.currency} ${selectedOfferForPricing.price.toLocaleString()}`,
                        ticketDeadline: reservationResult.ticket_deadline,
                        phone: `+${guestDetails.country_code} ${guestDetails.phone}`,
                        passportNumber: guestDetails.passport_number,
                        nationality: guestDetails.nationality,
                        cabinClass: 'Economy Class (Confirmed)'
                      });
                      setIsEmailSending(false);
                      if (res.success) {
                        setIsEmailSent(true);
                        onSuccessToast(`Itinerary email re-sent to ${guestDetails.email}!`);
                      } else {
                        onSuccessToast(`Could not send email: ${res.message}`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEmailSending ? 'Sending...' : 'Resend Email'}</span>
                  </button>

                  {/* View in Client Portal Button */}
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsReserveModalOpen(false);
                        onNavigate('client-portal');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#CFAE70]/60 bg-[#CFAE70]/10 text-[#1B365D] hover:bg-[#CFAE70]/20 text-xs font-bold cursor-pointer transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#B8934C]" />
                      <span>View in Client Portal</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(reservationResult.pnr);
                      onSuccessToast(`PNR ${reservationResult.pnr} copied to clipboard!`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PNR</span>
                  </button>

                  <a
                    href={createWhatsAppUrl(`Hello Horizon Move Limited, I have reserved flight with PNR: ${reservationResult.pnr} (${selectedOfferForPricing.airline_name} ${selectedOfferForPricing.flight_no}, ${formatFullRoute(selectedOfferForPricing.departure_code, selectedOfferForPricing.arrival_code)}). Please confirm payment and ticket issuance.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp Ticketing Desk</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsReserveModalOpen(false);
                      setReservationResult(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    <span>Done</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paystack Payment Modal */}
      {isPaystackOpen && selectedOfferForPricing && (
        <PaystackPaymentModal
          isOpen={isPaystackOpen}
          onClose={() => setIsPaystackOpen(false)}
          bookingDetails={{
            pnr: reservationResult.pnr,
            airline: selectedOfferForPricing.airline_name,
            flightNo: selectedOfferForPricing.flight_no,
            from: selectedOfferForPricing.departure_code,
            to: selectedOfferForPricing.arrival_code,
            fareAmount: verifiedPricing?.verified_price || selectedOfferForPricing.price,
            currency: verifiedPricing?.currency || selectedOfferForPricing.currency,
            passengerName: `${guestDetails.title} ${guestDetails.first_name} ${guestDetails.last_name}`,
            passengerEmail: guestDetails.email,
            passengerPhone: `+${guestDetails.country_code} ${guestDetails.phone}`
          }}
          onPaymentSuccess={(data) => {
    setHasPaidViaPaystack(true);
    setPaystackReceiptData(data);
    setIsPaystackOpen(false);
    onSuccessToast(`Payment of ${data.amount} received! Generating your booking...`);
    executeSkyLinkReservation();
}}
        />
      )}
    </div>
  );
};
