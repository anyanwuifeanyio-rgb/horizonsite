import React, { useState, useEffect } from 'react';
import { Currency, PageType } from '../types';
import { 
  Plane, 
  Calendar, 
  Users, 
  ArrowLeftRight, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Luggage,
  RefreshCw,
  Phone,
  FileCheck,
  Award
} from 'lucide-react';
import { AirportDropdown } from './AirportDropdown';
import { AirlineLogo } from './AirlineLogo';
import { 
  skyLinkService, 
  SkyLinkFlightOffer,
  formatBaggage 
} from '../services/skylinkApi';
import { 
  createWhatsAppUrl, 
  PRIMARY_PHONE 
} from '../utils/whatsapp';

interface HomepageFlightEngineProps {
  currency: Currency;
  onNavigate: (page: PageType) => void;
  onSuccessToast?: (msg: string) => void;
}

const POPULAR_FLIGHT_ROUTES = [
  {
    label: 'Lagos ➔ London (LHR)',
    from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
    to: 'London (LHR) - London Heathrow Airport, United Kingdom',
    fromCode: 'LOS',
    toCode: 'LHR',
    tag: 'Student & Business',
    fromPrice: { NGN: '₦1,250,000', USD: '$820', GBP: '£650', EUR: '€760' }
  },
  {
    label: 'Lagos ➔ Dubai (DXB)',
    from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
    to: 'Dubai (DXB) - Dubai International Airport, United Arab Emirates',
    fromCode: 'LOS',
    toCode: 'DXB',
    tag: 'Best Seller',
    fromPrice: { NGN: '₦890,000', USD: '$580', GBP: '£460', EUR: '€540' }
  },
  {
    label: 'Abuja ➔ London (LHR)',
    from: 'Abuja (ABV) - Nnamdi Azikiwe International Airport, Nigeria',
    to: 'London (LHR) - London Heathrow Airport, United Kingdom',
    fromCode: 'ABV',
    toCode: 'LHR',
    tag: 'Direct Route',
    fromPrice: { NGN: '₦1,320,000', USD: '$860', GBP: '£680', EUR: '€800' }
  },
  {
    label: 'Lagos ➔ Toronto (YYZ)',
    from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
    to: 'Toronto (YYZ) - Toronto Pearson International Airport, Canada',
    fromCode: 'LOS',
    toCode: 'YYZ',
    tag: 'Study & Relocation',
    fromPrice: { NGN: '₦1,850,000', USD: '$1,200', GBP: '£950', EUR: '€1,120' }
  },
  {
    label: 'Lagos ➔ New York (JFK)',
    from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
    to: 'New York (JFK) - John F. Kennedy International Airport, United States',
    fromCode: 'LOS',
    toCode: 'JFK',
    tag: 'Frequent Flights',
    fromPrice: { NGN: '₦1,650,000', USD: '$1,080', GBP: '£850', EUR: '€1,000' }
  },
  {
    label: 'Lagos ➔ Istanbul (IST)',
    from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
    to: 'Istanbul (IST) - Istanbul Airport, Turkey',
    fromCode: 'LOS',
    toCode: 'IST',
    tag: 'Transit Hub',
    fromPrice: { NGN: '₦980,000', USD: '$640', GBP: '£510', EUR: '€595' }
  },
  {
    label: 'Abuja ➔ Doha (DOH)',
    from: 'Abuja (ABV) - Nnamdi Azikiwe International Airport, Nigeria',
    to: 'Doha (DOH) - Hamad International Airport, Qatar',
    fromCode: 'ABV',
    toCode: 'DOH',
    tag: 'Qatar Airways Hub',
    fromPrice: { NGN: '₦940,000', USD: '$615', GBP: '£490', EUR: '€570' }
  },
  {
    label: 'Lagos ➔ Johannesburg (JNB)',
    from: 'Lagos (LOS) - Murtala Muhammed International Airport, Nigeria',
    to: 'Johannesburg (JNB) - O.R. Tambo International Airport, South Africa',
    fromCode: 'LOS',
    toCode: 'JNB',
    tag: 'Africa Connection',
    fromPrice: { NGN: '₦790,000', USD: '$520', GBP: '£410', EUR: '€480' }
  }
];

export const HomepageFlightEngine: React.FC<HomepageFlightEngineProps> = ({
  currency,
  onNavigate,
  onSuccessToast
}) => {
  const [tripType, setTripType] = useState<'round' | 'oneway' | 'multi'>('round');
  const [cabinClass, setCabinClass] = useState<'economy' | 'premium_economy' | 'business' | 'first'>('economy');
  const [passengers, setPassengers] = useState(1);
  const [fromAirport, setFromAirport] = useState('Lagos (LOS) - Murtala Muhammed International Airport, Nigeria');
  const [toAirport, setToAirport] = useState('London (LHR) - London Heathrow Airport, United Kingdom');
  
  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const threeWeeksStr = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [departureDate, setDepartureDate] = useState(nextWeekStr);
  const [returnDate, setReturnDate] = useState(threeWeeksStr);

  // Search results state
  const [isSearching, setIsSearching] = useState(false);
  const [offers, setOffers] = useState<SkyLinkFlightOffer[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Swap airports
  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
    onSuccessToast?.('Swapped departure and destination airports.');
  };

  // Execute flight search
  const handleSearch = async (overrideFrom?: string, overrideTo?: string) => {
    setIsSearching(true);
    setHasSearched(true);
    setOffers(null);

    const fromVal = overrideFrom || fromAirport;
    const toVal = overrideTo || toAirport;

    const originMatch = fromVal.match(/\b([A-Z]{3})\b/);
    const destMatch = toVal.match(/\b([A-Z]{3})\b/);
    const fromCode = originMatch ? originMatch[1] : (fromVal.trim().substring(0, 3).toUpperCase() || 'LOS');
    const toCode = destMatch ? destMatch[1] : (toVal.trim().substring(0, 3).toUpperCase() || 'LHR');

    try {
      const res = await skyLinkService.searchFlights({
        search_mode: 'external',
        from: fromCode,
        to: toCode,
        flight_type: tripType === 'round' ? 'roundtrip' : 'oneway',
        flights_departure_date: departureDate,
        flights_return_date: tripType === 'round' ? returnDate : undefined,
        adults: passengers,
        class: cabinClass,
        currency: currency
      });

      if (res.success && res.data.flights) {
        setOffers(res.data.flights);
        onSuccessToast?.(`Found ${res.data.flights.length} verified flight options (${fromCode} ➔ ${toCode})`);
      }
    } catch {
      onSuccessToast?.('Flight search complete.');
    } finally {
      setIsSearching(false);
    }
  };

  // Preselect a route and run search immediately
  const handleSelectPopularRoute = (route: typeof POPULAR_FLIGHT_ROUTES[0]) => {
    setFromAirport(route.from);
    setToAirport(route.to);
    handleSearch(route.from, route.to);
  };

  // Navigate to full travel page with search state saved
  const handleBookOffer = (offer: SkyLinkFlightOffer) => {
    try {
      sessionStorage.setItem('horizon_pending_flight_search', JSON.stringify({
        tripType: tripType === 'round' ? 'round' : 'one-way',
        from: fromAirport,
        to: toAirport,
        departureDate,
        returnDate,
        passengers,
        cabinClass: cabinClass === 'economy' ? 'Economy' : cabinClass === 'business' ? 'Business' : 'First',
        selectedOffer: offer
      }));
    } catch {}

    onNavigate('travel-bookings');
  };

  // WhatsApp concierge booking
  const handleWhatsAppBooking = (offer?: SkyLinkFlightOffer) => {
    const originMatch = fromAirport.match(/\b([A-Z]{3})\b/);
    const destMatch = toAirport.match(/\b([A-Z]{3})\b/);
    const fromCode = originMatch ? originMatch[1] : 'LOS';
    const toCode = destMatch ? destMatch[1] : 'LHR';

    let text = `Hello Horizon Move Ticketing Desk,\nI would like to book a flight:\n• Route: ${fromAirport} ➔ ${toAirport}\n• Dates: Depart ${departureDate}${tripType === 'round' ? ` | Return ${returnDate}` : ''}\n• Class: ${cabinClass.toUpperCase()}\n• Passengers: ${passengers}`;
    if (offer) {
      text += `\n• Preferred Airline: ${offer.airline_name} (${offer.flight_no})\n• Quoted Fare: ${currency} ${offer.price.toLocaleString()}`;
    }
    text += `\nPlease confirm seat reservation and payment procedures.`;

    window.open(createWhatsAppUrl(text), '_blank');
  };

  return (
    <div id="flight-booking-engine" className="w-full max-w-7xl mx-auto">
      {/* Primary Flight Booking Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#11233e] via-[#0d1b30] to-[#07111e] border-2 border-[#CFAE70]/60 p-5 sm:p-8 text-white shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Subtle decorative glow & runway backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#CFAE70]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-6">
          {/* Top Bar: Live GDS Badge & Value Highlights */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
                <Plane className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span>OFFICIAL GLOBAL FLIGHT TICKETING DESK</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-luxury text-white flex items-center gap-2">
                <span>Book International & Domestic Flights</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Direct GDS seat availability, NCAA & IATA verified tickets, visa itineraries, and exclusive student 46kg baggage allowances.
              </p>
            </div>

            {/* Quick Desk Contact Hotline */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${PRIMARY_PHONE}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-[#F3E5AB] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span className="hidden sm:inline">Ticketing Hotline:</span>
                <span>{PRIMARY_PHONE}</span>
              </a>
              <button
                onClick={() => handleWhatsAppBooking()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Desk</span>
              </button>
            </div>
          </div>

          {/* Trip Type & Class Switchers */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Trip Type Pills */}
            <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10">
              {(['round', 'oneway', 'multi'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    tripType === type
                      ? 'bg-gradient-to-r from-[#CFAE70] to-[#B8934C] text-[#1B365D] shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {type === 'round' ? 'Round Trip' : type === 'oneway' ? 'One Way' : 'Multi-City'}
                </button>
              ))}
            </div>

            {/* Cabin Class & Passenger Counts */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Class Dropdown */}
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-slate-400 font-medium">Class:</span>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="bg-transparent text-[#F3E5AB] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="economy" className="bg-[#1B365D] text-white">Economy</option>
                  <option value="premium_economy" className="bg-[#1B365D] text-white">Premium Economy</option>
                  <option value="business" className="bg-[#1B365D] text-white">Business Class</option>
                  <option value="first" className="bg-[#1B365D] text-white">First Class</option>
                </select>
              </div>

              {/* Passengers selector */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Users className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span className="text-slate-400 font-medium">Passengers:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    disabled={passengers <= 1}
                    className="w-5 h-5 rounded bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-[#F3E5AB] min-w-[14px] text-center">{passengers}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(9, passengers + 1))}
                    disabled={passengers >= 9}
                    className="w-5 h-5 rounded bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Search Inputs Grid (Origin, Swap, Destination, Dates, Search Button) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-black/25 p-4 rounded-2xl border border-white/10">
            {/* Origin Airport */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Plane className="w-3 h-3 text-[#CFAE70] rotate-45" />
                <span>Flying From (Origin)</span>
              </label>
              <div className="bg-white rounded-xl text-slate-800">
                <AirportDropdown
                  label="Flying From"
                  value={fromAirport}
                  onChange={setFromAirport}
                  iconType="departure"
                />
              </div>
            </div>

            {/* Airport Swap Button */}
            <div className="md:col-span-1 flex items-center justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={handleSwapAirports}
                className="w-10 h-10 rounded-full bg-[#1B365D] hover:bg-[#CFAE70] text-[#F3E5AB] hover:text-[#1B365D] border border-[#CFAE70]/50 flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer transform hover:rotate-180"
                title="Swap departure and arrival airports"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Airport */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Plane className="w-3 h-3 text-[#CFAE70] -rotate-45" />
                <span>Flying To (Destination)</span>
              </label>
              <div className="bg-white rounded-xl text-slate-800">
                <AirportDropdown
                  label="Flying To"
                  value={toAirport}
                  onChange={setToAirport}
                  iconType="destination"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#CFAE70]" />
                <span>Departure Date</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-white text-slate-800 font-medium rounded-xl px-3 py-2.5 text-xs sm:text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#CFAE70] cursor-pointer"
              />
            </div>

            {/* Return Date (if roundtrip) or Info */}
            <div className={`md:col-span-3 ${tripType === 'oneway' ? 'opacity-50' : ''}`}>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#CFAE70]" />
                <span>Return Date {tripType === 'oneway' && '(One-Way Selected)'}</span>
              </label>
              <input
                type="date"
                disabled={tripType === 'oneway'}
                min={departureDate}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-white text-slate-800 font-medium rounded-xl px-3 py-2.5 text-xs sm:text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#CFAE70] disabled:bg-slate-200 cursor-pointer"
              />
            </div>

            {/* Primary Search CTA Button */}
            <div className="md:col-span-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] hover:brightness-105 text-[#1B365D] font-extrabold px-6 py-3 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/40"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#1B365D]" />
                    <span>Searching Global Inventory...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#1B365D]" />
                    <span>Search Live Flights & Fares</span>
                    <ArrowRight className="w-4 h-4 text-[#1B365D]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('travel-bookings')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Flight Hub</span>
              </button>
            </div>
          </div>

          {/* Popular Flight Routes from Nigeria */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#CFAE70]" />
                <span>Popular Flights from Nigeria (Instant Fare Search):</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Click any route to check live availability
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {POPULAR_FLIGHT_ROUTES.map((route) => (
                <button
                  key={route.label}
                  type="button"
                  onClick={() => handleSelectPopularRoute(route)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-[#CFAE70]/20 border border-white/10 hover:border-[#CFAE70]/60 transition-all text-left group cursor-pointer flex flex-col justify-between min-h-[64px]"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-white group-hover:text-[#F3E5AB] transition-colors leading-tight">
                      {route.fromCode} ➔ {route.toCode}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-slate-300 group-hover:text-white">
                      {route.toCode}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 block truncate">
                      {route.tag}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#E4C88E] block">
                      {route.fromPrice[currency] || route.fromPrice.NGN}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* LIVE SEARCH RESULTS ON HOMEPAGE */}
          {isSearching && (
            <div className="p-8 rounded-2xl bg-white/5 border border-[#CFAE70]/30 text-center space-y-3 animate-pulse">
              <RefreshCw className="w-8 h-8 text-[#CFAE70] animate-spin mx-auto" />
              <h4 className="text-base font-bold text-white font-serif-luxury">
                Connecting to Global Distribution Systems (GDS)...
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Validating seat inventory across Qatar Airways, British Airways, Emirates, Air Peace, Virgin Atlantic, and Ethiopian Airlines.
              </p>
            </div>
          )}

          {hasSearched && !isSearching && offers && offers.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    Verified Available Flights ({offers.length} options found)
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('travel-bookings')}
                  className="text-xs text-[#E4C88E] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>See Full Flight Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Offer Cards (Top 3 on Homepage with quick actions) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {offers.slice(0, 3).map((offer) => (
                  <div
                    key={offer.booking_token}
                    className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-[#CFAE70]/40 hover:border-[#CFAE70] transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AirlineLogo airlineId={(offer.airline || offer.airline_name || '').toLowerCase()} className="h-6" />
                        <div>
                          <span className="font-bold text-xs text-white block leading-tight">
                            {offer.airline_name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Flight {offer.flight_no}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#CFAE70]/20 text-[#E4C88E] text-[10px] font-bold border border-[#CFAE70]/30">
                        {offer.class}
                      </span>
                    </div>

                    {/* Flight Schedule Times */}
                    <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl text-center">
                      <div>
                        <div className="text-sm font-bold text-white">{offer.departure_time}</div>
                        <div className="text-[10px] text-slate-400">{offer.departure_code}</div>
                      </div>
                      <div className="flex flex-col items-center px-2">
                        <span className="text-[10px] text-slate-400">{offer.duration_time}</span>
                        <div className="w-16 h-0.5 bg-slate-600 relative my-1">
                          <Plane className="w-3 h-3 text-[#CFAE70] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                        </div>
                        <span className="text-[9px] text-emerald-400 font-semibold">
                          {offer.stops === 0 ? 'Direct Flight' : `${offer.stops || 1} Stop (${offer.stopover || 'Transit'})`}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{offer.arrival_time}</div>
                        <div className="text-[10px] text-slate-400">{offer.arrival_code}</div>
                      </div>
                    </div>

                    {/* Baggage & Fare */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-300">
                        <Luggage className="w-3.5 h-3.5 text-[#CFAE70]" />
                        <span>Baggage: {formatBaggage(offer.baggage)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Total Fare</span>
                        <span className="text-base font-extrabold text-[#E4C88E]">
                          {currency} {offer.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleBookOffer(offer)}
                        className="bg-gradient-to-r from-[#CFAE70] to-[#A98745] hover:brightness-105 text-[#1B365D] font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        <span>Reserve PNR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWhatsAppBooking(offer)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3 fill-white" />
                        <span>Hold Fare</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Flight Value Proposition Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Official Verifiable PNR</span>
                <span className="text-[10px] text-slate-400">Guaranteed valid for Visa applications</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
              <Luggage className="w-4 h-4 text-[#CFAE70] shrink-0" />
              <div>
                <span className="font-bold text-white block">Student Extra 46kg Baggage</span>
                <span className="text-[10px] text-slate-400">Special perks for UK & Canada intakes</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
              <Clock className="w-4 h-4 text-[#CFAE70] shrink-0" />
              <div>
                <span className="font-bold text-white block">Flexible Rescheduling</span>
                <span className="text-[10px] text-slate-400">Low or zero amendment penalty</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">IATA & NCAA Certified</span>
                <span className="text-[10px] text-slate-400">Corporate & group ticketing desk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
