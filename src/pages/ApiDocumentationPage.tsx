import React, { useState } from 'react';
import { PageType } from '../types';
import { 
  Terminal, 
  Key, 
  Search, 
  DollarSign, 
  Ticket, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Building2, 
  ChevronRight, 
  Code2, 
  Play, 
  RefreshCw,
  FileText,
  Lock,
  Compass
} from 'lucide-react';
import { skyLinkService, SKYLINK_BASE_URL } from '../services/skylinkApi';

interface ApiDocumentationPageProps {
  onNavigate: (page: PageType) => void;
  onSuccessToast?: (msg: string) => void;
}

type ActiveSection = 
  | 'overview'
  | 'auth'
  | 'base-url'
  | 'errors'
  | 'search'
  | 'pricing'
  | 'reserve'
  | 'traveller-structure'
  | 'restrictions'
  | 'workflow'
  | 'rate-limits'
  | 'contact'
  | 'console';

export const ApiDocumentationPage: React.FC<ApiDocumentationPageProps> = ({ onNavigate, onSuccessToast }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Interactive Console State
  const [consoleEndpoint, setConsoleEndpoint] = useState<'login' | 'search' | 'pricing' | 'reserve'>('search');
  const [consolePayload, setConsolePayload] = useState<string>(
    JSON.stringify(
      {
        search_mode: 'external',
        from: 'LOS',
        to: 'DXB',
        flight_type: 'oneway',
        flights_departure_date: '2026-09-15',
        adults: 1,
        children: 0,
        infants: 0,
        class: 'economy',
        currency: 'NGN'
      },
      null,
      2
    )
  );
  const [consoleResponse, setConsoleResponse] = useState<string | null>(null);
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [consoleStatusCode, setConsoleStatusCode] = useState<number | null>(null);
  const [consoleDurationMs, setConsoleDurationMs] = useState<number | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onSuccessToast) {
      onSuccessToast('Copied to clipboard');
    }
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEndpointSelect = (endpoint: 'login' | 'search' | 'pricing' | 'reserve') => {
    setConsoleEndpoint(endpoint);
    setConsoleResponse(null);
    setConsoleStatusCode(null);
    setConsoleDurationMs(null);

    if (endpoint === 'login') {
      setConsolePayload(
        JSON.stringify(
          {
            email: 'partner@example.com',
            password: 'secret_password',
            remember_me: false
          },
          null,
          2
        )
      );
    } else if (endpoint === 'search') {
      setConsolePayload(
        JSON.stringify(
          {
            search_mode: 'external',
            from: 'LOS',
            to: 'DXB',
            flight_type: 'oneway',
            flights_departure_date: '2026-09-15',
            adults: 1,
            children: 0,
            infants: 0,
            class: 'economy',
            currency: 'NGN'
          },
          null,
          2
        )
      );
    } else if (endpoint === 'pricing') {
      setConsolePayload(
        JSON.stringify(
          {
            booking_token: 'btk_3f8a2c1d9e7b4a5f6c2d1e8f9a0b3c7d',
            passengers: { adults: 1, children: 0, infants: 0 },
            currency: 'NGN',
            class: 'economy'
          },
          null,
          2
        )
      );
    } else if (endpoint === 'reserve') {
      setConsolePayload(
        JSON.stringify(
          {
            booking_token: 'btk_3f8a2c1d9e7b4a5f6c2d1e8f9a0b3c7d',
            passengers: { adults: 1, children: 0, infants: 0 },
            travellers: {
              primary_guest: {
                title: 'Mr',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '08012345678',
                country_code: '234',
                dob: '1990-01-01',
                gender: 'male',
                passport_number: 'A12345678',
                passport_expiry: '2030-01-01',
                passport_issue_date: '2020-01-01',
                nationality: 'NG'
              }
            },
            ticket_time_limit_hours: 48
          },
          null,
          2
        )
      );
    }
  };

  const handleExecuteConsole = async () => {
    setConsoleLoading(true);
    setConsoleResponse(null);
    const start = performance.now();

    try {
      const parsed = JSON.parse(consolePayload);
      let res: unknown = null;

      if (consoleEndpoint === 'login') {
        res = await skyLinkService.login(parsed);
      } else if (consoleEndpoint === 'search') {
        res = await skyLinkService.searchFlights(parsed);
      } else if (consoleEndpoint === 'pricing') {
        res = await skyLinkService.priceFlight(parsed);
      } else if (consoleEndpoint === 'reserve') {
        res = await skyLinkService.reserveFlight(parsed);
      }

      const elapsed = Math.round(performance.now() - start);
      setConsoleStatusCode(200);
      setConsoleDurationMs(elapsed);
      setConsoleResponse(JSON.stringify(res, null, 2));
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - start);
      setConsoleDurationMs(elapsed);
      if (err && typeof err === 'object' && 'blocked' in err) {
        setConsoleStatusCode(403);
      } else {
        setConsoleStatusCode(400);
      }
      setConsoleResponse(JSON.stringify(err, null, 2));
    } finally {
      setConsoleLoading(false);
    }
  };

  return (
    <div className="bg-[#09121f] text-slate-100 min-h-screen">
      {/* 1. TOP HEADER / TITLE BAR */}
      <div className="bg-[#0d1b2e] border-b border-[#CFAE70]/30 sticky top-16 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B365D] to-[#0a1424] border border-[#CFAE70] flex items-center justify-center text-[#E4C88E] shadow">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide text-lg sm:text-xl font-serif-luxury">
                  247travels.com SkyLink API
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                  v1.0 · REST / JSON
                </span>
              </div>
              <p className="text-xs text-slate-400">
                External Partner Integration Guide · Powered by Amadeus, Verteil NDC, and Brightsun
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveSection('console')}
              className="inline-flex items-center gap-1.5 bg-[#CFAE70]/20 hover:bg-[#CFAE70]/30 text-[#E4C88E] border border-[#CFAE70]/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Interactive API Console</span>
            </button>

            <button
              onClick={() => onNavigate('travel-bookings')}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Back to Flights</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-36 bg-[#0e1d32] border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#CFAE70] px-3 py-1.5 mb-1">
                Table of Contents
              </div>

              {[
                { id: 'overview', label: '1. Introduction & Overview', icon: FileText },
                { id: 'auth', label: '2. Authentication & Login', icon: Key },
                { id: 'base-url', label: '3. Base URL & Versioning', icon: Code2 },
                { id: 'errors', label: '4. Error Handling', icon: AlertTriangle },
                { id: 'search', label: '5. Flight Search', icon: Search },
                { id: 'pricing', label: '6. Flight Pricing', icon: DollarSign },
                { id: 'reserve', label: '7. Flight Reservation (PNR)', icon: Ticket },
                { id: 'traveller-structure', label: '7.1 Traveller Structure', icon: UsersIcon },
                { id: 'restrictions', label: '7.2 PNR Restrictions', icon: ShieldAlert },
                { id: 'workflow', label: '8. Workflow Integration', icon: Layers },
                { id: 'rate-limits', label: '9. Rate Limits & Best Practices', icon: Clock },
                { id: 'contact', label: '10. Contact & Support', icon: Phone },
                { id: 'console', label: '★ Live API Console', icon: Play, highlight: true }
              ].map((item) => {
                const Icon = item.icon;
                const isCurrent = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as ActiveSection);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? item.highlight
                          ? 'bg-[#CFAE70] text-[#1B365D] font-bold shadow'
                          : 'bg-[#1B365D] text-[#E4C88E] border border-[#CFAE70]/40 font-bold'
                        : item.highlight
                        ? 'text-[#E4C88E] bg-[#CFAE70]/10 hover:bg-[#CFAE70]/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-12">
            {/* SECTION 1: OVERVIEW */}
            {(activeSection === 'overview' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 1</span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Introduction & Overview</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono">
                    REST / JSON
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  SkyLink is the official 247Travels flight integration API. It provides your platform with programmatic access to live flight inventory, real-time pricing, and instant booking — all through a single, clean REST interface. You do not need to integrate with any airline or GDS system directly; SkyLink handles all of that for you.
                </p>

                {/* Feature Detail Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#142642] text-[#E4C88E] uppercase tracking-wider font-bold border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-3 w-1/3">Feature</th>
                        <th className="px-4 py-3">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Protocol</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">HTTPS REST — JSON request and response bodies</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Authentication</td>
                        <td className="px-4 py-3 text-slate-300">JWT Bearer Token (Authorization header)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Search Modes</td>
                        <td className="px-4 py-3 text-slate-300">Local database · Live external inventory</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">PNR Generation</td>
                        <td className="px-4 py-3 text-emerald-300 font-semibold">Instant order creation — no manual ticketing queue</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Currency</td>
                        <td className="px-4 py-3 text-slate-300">Multi-currency support (NGN, USD, EUR, GBP)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Passenger Types</td>
                        <td className="px-4 py-3 text-slate-300">Adults · Children · Infants</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">Trip Types</td>
                        <td className="px-4 py-3 text-slate-300">One-way · Round trip · Multi-city</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION 2: AUTHENTICATION */}
            {(activeSection === 'auth' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 2</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Authentication & Login</h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  All SkyLink API endpoints require a valid JWT Bearer token obtained from <code className="text-[#E4C88E] font-mono bg-black/30 px-1.5 py-0.5 rounded">POST /api/login</code>. Include the token in every request header.
                </p>

                {/* Request Header Banner */}
                <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#E4C88E] uppercase tracking-wider flex items-center justify-between">
                    <span>Request Header</span>
                    <button
                      onClick={() => handleCopy('Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'auth_header')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'auth_header' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-emerald-400 overflow-x-auto">
                    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </pre>
                </div>

                {/* Login Endpoint Box */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-md font-mono">POST</span>
                    <span className="font-mono text-sm font-semibold text-white">/api/login</span>
                    <span className="text-xs text-slate-400 font-medium">— Obtain JWT Access Token</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Authenticates a user and returns a short-lived access token and a long-lived refresh token. Only accounts with the <code className="text-[#E4C88E]">api</code> or <code className="text-[#E4C88E]">admin</code> role can successfully authenticate.
                  </p>

                  {/* Parameters Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#142642] text-[#E4C88E] uppercase font-bold border-b border-slate-700">
                        <tr>
                          <th className="px-4 py-2.5">Parameter</th>
                          <th className="px-4 py-2.5">Type</th>
                          <th className="px-4 py-2.5">Required</th>
                          <th className="px-4 py-2.5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-white">email</td>
                          <td className="px-4 py-2.5 text-slate-400">string</td>
                          <td className="px-4 py-2.5 text-rose-400 font-bold">Yes</td>
                          <td className="px-4 py-2.5 text-slate-300">Registered email address.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-white">password</td>
                          <td className="px-4 py-2.5 text-slate-400">string</td>
                          <td className="px-4 py-2.5 text-rose-400 font-bold">Yes</td>
                          <td className="px-4 py-2.5 text-slate-300">Account password.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-white">remember_me</td>
                          <td className="px-4 py-2.5 text-slate-400">boolean</td>
                          <td className="px-4 py-2.5 text-slate-400">No</td>
                          <td className="px-4 py-2.5 text-slate-300">Extended session flag. Does not affect token expiry.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Response JSON */}
                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-[#E4C88E]">Login Response — Success (HTTP 200)</span>
                      <button
                        onClick={() => handleCopy(sampleLoginResponse, 'sample_login_resp')}
                        className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'sample_login_resp' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {sampleLoginResponse}
                    </pre>
                  </div>

                  {/* Error Responses Table */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-300">Login Error Responses</div>
                    <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#142642] text-slate-300 font-bold border-b border-slate-700">
                          <tr>
                            <th className="px-4 py-2 font-mono text-rose-400">Error Code</th>
                            <th className="px-4 py-2">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                          <tr>
                            <td className="px-4 py-2 font-mono text-rose-300">INVALID_JSON</td>
                            <td className="px-4 py-2 text-slate-300">Request body is not valid JSON.</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono text-rose-300">EMPTY_FIELDS</td>
                            <td className="px-4 py-2 text-slate-300">Email or password missing from request.</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono text-rose-300">INVALID_CREDENTIALS</td>
                            <td className="px-4 py-2 text-slate-300">Email not found or password incorrect.</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono text-rose-300">ACCOUNT_LOCKED</td>
                            <td className="px-4 py-2 text-slate-300">Too many failed attempts. Account temporarily locked.</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 font-mono text-rose-300">ROLE_NOT_PERMITTED</td>
                            <td className="px-4 py-2 text-slate-300">Account role does not have API access (not api or admin).</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 3 & 4: BASE URL & ERROR HANDLING */}
            {(activeSection === 'base-url' || activeSection === 'errors' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Sections 3 & 4</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Base URL & Error Handling</h2>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#E4C88E] uppercase tracking-wider">Base URL</div>
                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-3 font-mono text-xs text-white flex items-center justify-between">
                    <span>{SKYLINK_BASE_URL}/</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 px-2 py-0.5 rounded">HTTPS ONLY</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    ■ All requests must use HTTPS. HTTP connections will be rejected.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Standard HTTP Status Codes</div>
                  <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#142642] text-[#E4C88E] font-bold border-b border-slate-700">
                        <tr>
                          <th className="px-4 py-2.5">HTTP Code</th>
                          <th className="px-4 py-2.5">Meaning</th>
                          <th className="px-4 py-2.5">Common Cause</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-emerald-400 font-bold">200</td>
                          <td className="px-4 py-2.5 text-white font-semibold">Success</td>
                          <td className="px-4 py-2.5 text-slate-300">Request completed successfully</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-amber-400 font-bold">400</td>
                          <td className="px-4 py-2.5 text-white">Bad Request</td>
                          <td className="px-4 py-2.5 text-slate-300">Missing or invalid parameters</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-amber-400 font-bold">401</td>
                          <td className="px-4 py-2.5 text-white">Unauthorized</td>
                          <td className="px-4 py-2.5 text-slate-300">Missing, invalid, or expired JWT token</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-rose-400 font-bold">403</td>
                          <td className="px-4 py-2.5 text-white">Forbidden</td>
                          <td className="px-4 py-2.5 text-slate-300">PNR blocked for this carrier or supplier (Section 7.2)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-amber-400 font-bold">404</td>
                          <td className="px-4 py-2.5 text-white">Not Found</td>
                          <td className="px-4 py-2.5 text-slate-300">Resource or booking not found</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-rose-400 font-bold">502</td>
                          <td className="px-4 py-2.5 text-white">Bad Gateway</td>
                          <td className="px-4 py-2.5 text-slate-300">Supplier API error or unreachable (Amadeus / Verteil)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-mono text-rose-400 font-bold">500</td>
                          <td className="px-4 py-2.5 text-white">Server Error</td>
                          <td className="px-4 py-2.5 text-slate-300">Unexpected internal error</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-semibold text-[#E4C88E]">Standard Error Response Body Structure</div>
                  <pre className="font-mono text-xs text-rose-300">
{`{
  "success": false,
  "message": "Human-readable description",
  "error": "Technical detail (supplier errors only)"
}`}
                  </pre>
                </div>
              </section>
            )}

            {/* SECTION 5: FLIGHT SEARCH */}
            {(activeSection === 'search' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 5</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Flight Search</h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  The search endpoint returns available flight offers for your requested route. Use <code className="text-[#E4C88E]">search_mode=local</code> to query our internal flight database, or <code className="text-[#E4C88E]">search_mode=external</code> to query live airline inventory in real time.
                </p>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-md font-mono">POST</span>
                  <span className="font-mono text-sm font-semibold text-white">/api/flights/search</span>
                </div>

                {/* Parameters Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#142642] text-[#E4C88E] uppercase font-bold border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-2.5">Parameter</th>
                        <th className="px-4 py-2.5">Type</th>
                        <th className="px-4 py-2.5">Required</th>
                        <th className="px-4 py-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">search_mode</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-rose-400 font-bold">Yes</td>
                        <td className="px-4 py-2.5 text-slate-300">"local" — internal database. "external" — live supplier inventory.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">from</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-slate-400">No</td>
                        <td className="px-4 py-2.5 text-slate-300">Origin IATA airport code. E.g. "LOS". Not required for multicity — auto-derived from routes[0].from.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">to</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-slate-400">No</td>
                        <td className="px-4 py-2.5 text-slate-300">Destination IATA airport code. E.g. "DXB". Not required for multicity — auto-derived from routes[-1].to.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">flight_type</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-rose-400 font-bold">Yes</td>
                        <td className="px-4 py-2.5 text-slate-300">"oneway", "roundtrip" (alias: "return"), or "multicity".</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">flights_departure_date</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-slate-400">No</td>
                        <td className="px-4 py-2.5 text-slate-300">Departure date YYYY-MM-DD. Not required for multicity.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">flights_return_date</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-amber-400">Conditional</td>
                        <td className="px-4 py-2.5 text-slate-300">Return date YYYY-MM-DD. Required when flight_type=roundtrip.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">adults</td>
                        <td className="px-4 py-2.5 text-slate-400">integer</td>
                        <td className="px-4 py-2.5 text-rose-400 font-bold">Yes</td>
                        <td className="px-4 py-2.5 text-slate-300">Number of adult passengers. Min 1, max 9.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">class</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-slate-400">No</td>
                        <td className="px-4 py-2.5 text-slate-300">"economy", "premium_economy", "business", or "first". Default: economy.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">currency</td>
                        <td className="px-4 py-2.5 text-slate-400">string</td>
                        <td className="px-4 py-2.5 text-slate-400">No</td>
                        <td className="px-4 py-2.5 text-slate-300">Display currency code. E.g. "NGN", "USD". Default: USD.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">routes</td>
                        <td className="px-4 py-2.5 text-slate-400">array</td>
                        <td className="px-4 py-2.5 text-slate-400">No</td>
                        <td className="px-4 py-2.5 text-slate-300">Multi-city legs array. Each item: {`{ "from": "LOS", "to": "LHR", "date": "YYYY-MM-DD" }`}. Minimum 2 legs.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Example Request & Response */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#E4C88E]">
                      <span className="font-semibold">Example Request (One Way)</span>
                      <button
                        onClick={() => handleCopy(sampleSearchRequest, 'search_req')}
                        className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'search_req' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {sampleSearchRequest}
                    </pre>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#E4C88E]">
                      <span className="font-semibold">Response — Success (HTTP 200)</span>
                      <button
                        onClick={() => handleCopy(sampleSearchResponse, 'search_res')}
                        className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'search_res' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {sampleSearchResponse}
                    </pre>
                  </div>
                </div>

                <div className="bg-blue-950/40 border border-blue-600/40 rounded-xl p-4 text-xs text-blue-200">
                  <strong className="text-white">Important Booking Token Rule:</strong> The <code className="text-[#E4C88E]">booking_token</code> returned for each flight result must be passed unchanged to <code className="text-[#E4C88E]">/api/flights/pricing</code> and <code className="text-[#E4C88E]">/api/flights/reserve</code>. Do not modify it.
                </div>
              </section>
            )}

            {/* SECTION 6: FLIGHT PRICING */}
            {(activeSection === 'pricing' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 6</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Flight Pricing</h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  The pricing endpoint re-validates a selected flight offer in real time against the live supplier system. It confirms the current price, detects changes since the search, and returns an updated <code className="text-[#E4C88E]">booking_token</code> with refreshed offer IDs.
                </p>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-md font-mono">POST</span>
                  <span className="font-mono text-sm font-semibold text-white">/api/flights/pricing</span>
                  <span className="text-xs text-slate-400 font-medium">— Verify & Reprice Flight Offer</span>
                </div>

                <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-4 text-xs text-amber-200">
                  <strong className="text-white">Integration Requirement:</strong> Always use the <code className="text-[#E4C88E]">booking_token</code> from <strong>THIS</strong> response — not the one from search — when calling <code className="text-[#E4C88E]">/api/flights/reserve</code>. The token is refreshed after every pricing call and expires in 15 minutes.
                </div>

                {/* Example Request & Response */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#E4C88E]">
                      <span className="font-semibold">Example Pricing Request</span>
                      <button
                        onClick={() => handleCopy(samplePricingRequest, 'price_req')}
                        className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'price_req' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {samplePricingRequest}
                    </pre>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#E4C88E]">
                      <span className="font-semibold">Pricing Response — Success</span>
                      <button
                        onClick={() => handleCopy(samplePricingResponse, 'price_res')}
                        className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'price_res' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {samplePricingResponse}
                    </pre>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 7: FLIGHT RESERVATION */}
            {(activeSection === 'reserve' || activeSection === 'traveller-structure' || activeSection === 'restrictions' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 7</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Flight Reservation (PNR Generation)</h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  The reservation endpoint creates a confirmed PNR immediately. Your PNR is returned in the response as soon as the airline confirms the order.
                </p>

                {/* Legal / Payment Responsibility Notice */}
                <div className="bg-amber-950/50 border-2 border-[#CFAE70] rounded-2xl p-5 space-y-2 text-xs text-amber-100">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <ShieldAlert className="w-4 h-4 text-[#CFAE70]" />
                    <span>Payment Responsibility Notice (Mandatory)</span>
                  </div>
                  <p className="leading-relaxed">
                    SkyLink API integration partners are required to collect full payment from their end users prior to calling this endpoint. The <code className="text-[#E4C88E]">/api/flights/reserve</code> endpoint does not enforce or process payment — it immediately generates a live airline PNR upon request. Calling this endpoint without prior payment collection constitutes a violation of the SkyLink API Terms of Service and may result in immediate suspension of API access, recovery of outstanding amounts, and legal action where applicable. 247Travels reserves the right to audit reservation activity and enforce accountability at its sole discretion.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-md font-mono">POST</span>
                  <span className="font-mono text-sm font-semibold text-white">/api/flights/reserve</span>
                  <span className="text-xs text-slate-400 font-medium">— Generate PNR & Create Flight Order</span>
                </div>

                {/* Example Request & Response */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#E4C88E]">
                      <span className="font-semibold">Example Reservation Request</span>
                      <button
                        onClick={() => handleCopy(sampleReserveRequest, 'res_req')}
                        className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'res_req' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {sampleReserveRequest}
                    </pre>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#E4C88E]">
                      <span className="font-semibold">Reservation Response — Success</span>
                      <button
                        onClick={() => handleCopy(sampleReserveResponse, 'res_res')}
                        className="text-[11px] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'res_res' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      {sampleReserveResponse}
                    </pre>
                  </div>
                </div>

                {/* 7.1 Traveller Object Structure */}
                <div className="space-y-3 pt-6 border-t border-slate-700">
                  <div className="text-sm font-bold text-[#E4C88E]">7.1 Traveller Object Structure</div>
                  <p className="text-xs text-slate-300">
                    The <code className="text-[#E4C88E]">travellers</code> object contains <code className="text-[#E4C88E]">primary_guest</code> (always required — lead passenger and booking contact) and <code className="text-[#E4C88E]">travelers</code> (additional passengers keyed by type and index).
                  </p>

                  <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#142642] text-[#E4C88E] font-bold border-b border-slate-700">
                        <tr>
                          <th className="px-4 py-2">Field</th>
                          <th className="px-4 py-2">Type</th>
                          <th className="px-4 py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">title</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Salutation: Mr, Mrs, Ms, Miss, Dr, Prof.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">first_name</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">First name exactly as on passport.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">last_name</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Last name / surname as on passport.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">other_name</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Middle or additional given name. Optional.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">email</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Contact email. Required for primary_guest.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">phone</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Phone number digits only. Required for primary_guest.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">country_code</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Phone country dialling code digits only. E.g. "234".</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">dob</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Date of birth YYYY-MM-DD. E.g. "1990-01-01".</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">gender</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">"male" or "female".</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">passport_number</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Passport number alphanumeric only.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">passport_expiry</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Passport expiry date YYYY-MM-DD.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-white">nationality</td>
                          <td className="px-4 py-2 text-slate-400">string</td>
                          <td className="px-4 py-2 text-slate-300">Two-letter ISO country code. E.g. "NG", "GB", "US".</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    Multi-Passenger traveler keys: adult_0, adult_1 (adults); child_0, child_1 (children); infant_0 (infants). adult_0 always mirrors primary_guest and is skipped internally — do not omit it.
                  </p>
                </div>

                {/* 7.2 PNR Restrictions */}
                <div className="space-y-3 pt-6 border-t border-slate-700">
                  <div className="text-sm font-bold text-[#E4C88E]">7.2 PNR Restrictions</div>
                  <p className="text-xs text-slate-300">
                    SkyLink supports three levels of PNR restriction. When triggered, the endpoint returns HTTP 403 with <code className="text-[#E4C88E]">blocked: true</code> before any supplier call is made.
                  </p>

                  <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#142642] text-slate-200 font-bold border-b border-slate-700">
                        <tr>
                          <th className="px-4 py-2">Level</th>
                          <th className="px-4 py-2">Scope</th>
                          <th className="px-4 py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                        <tr>
                          <td className="px-4 py-2 font-semibold text-white">1 — Supplier block</td>
                          <td className="px-4 py-2 text-slate-400">Entire supplier</td>
                          <td className="px-4 py-2 text-slate-300">All reservations via that supplier are blocked.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-semibold text-white">2 — Carrier block</td>
                          <td className="px-4 py-2 text-slate-400">Specific airlines</td>
                          <td className="px-4 py-2 text-slate-300">Named carrier codes are blocked under that supplier.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-semibold text-white">3 — Carrier whitelist</td>
                          <td className="px-4 py-2 text-slate-400">Specific airlines</td>
                          <td className="px-4 py-2 text-slate-300">Only listed carrier codes are permitted.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <pre className="font-mono text-xs text-rose-300 bg-[#0a1424] p-3 rounded-xl border border-slate-700">
{`{
  "success": false,
  "blocked": true,
  "carrier": "KQ",
  "message": "KQ reservations are not available at this time."
}`}
                  </pre>
                </div>
              </section>
            )}

            {/* SECTION 8: WORKFLOW INTEGRATION */}
            {(activeSection === 'workflow' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 8</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Workflow Integration Guide</h2>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  A complete flight booking follows three sequential steps. Each step returns data required by the next — never skip a step.
                </p>

                {/* Workflow Diagram */}
                <div className="space-y-4">
                  <div className="bg-[#0a1424] border border-[#CFAE70]/40 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#CFAE70] text-[#1B365D] text-xs font-bold font-mono">Step 1</span>
                      <span className="font-mono text-sm text-white font-bold">POST /api/flights/search</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Search with <code className="text-[#E4C88E]">search_mode=external</code>. Returns flight list with <code className="text-[#E4C88E]">booking_token</code> per flight.
                    </p>
                  </div>

                  <div className="flex justify-center text-[#CFAE70]">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="bg-[#0a1424] border border-[#CFAE70]/40 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#CFAE70] text-[#1B365D] text-xs font-bold font-mono">Step 2</span>
                      <span className="font-mono text-sm text-white font-bold">POST /api/flights/pricing</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Send <code className="text-[#E4C88E]">booking_token</code>. Returns updated <code className="text-[#E4C88E]">booking_token</code> with current verified pricing.
                    </p>
                  </div>

                  <div className="flex justify-center text-[#CFAE70]">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>

                  <div className="bg-[#0a1424] border border-[#CFAE70]/40 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#CFAE70] text-[#1B365D] text-xs font-bold font-mono">Step 3</span>
                      <span className="font-mono text-sm text-white font-bold">POST /api/flights/reserve</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Send refreshed <code className="text-[#E4C88E]">booking_token</code> + passenger details. Returns confirmed PNR immediately — no payment step required on API.
                    </p>
                  </div>
                </div>

                <div className="bg-rose-950/40 border border-rose-600/40 rounded-xl p-4 text-xs text-rose-200">
                  <strong className="text-white">Token Single-Use Rule:</strong> Never reuse a <code className="text-[#E4C88E]">booking_token</code> across multiple reserve calls. The token is marked <code className="text-white">used=1</code> after a successful reservation. Always obtain a fresh token via search → pricing for each new booking attempt.
                </div>
              </section>
            )}

            {/* SECTION 9: RATE LIMITS & BEST PRACTICES */}
            {(activeSection === 'rate-limits' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 9</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Rate Limits & Best Practices</h2>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#142642] text-[#E4C88E] font-bold border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-2.5">Endpoint</th>
                        <th className="px-4 py-2.5">Limit</th>
                        <th className="px-4 py-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 bg-[#0d1a2d]">
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">/api/flights/search</td>
                        <td className="px-4 py-2.5 text-emerald-400 font-bold">60 / minute</td>
                        <td className="px-4 py-2.5 text-slate-300">Per authenticated user</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">/api/flights/pricing</td>
                        <td className="px-4 py-2.5 text-emerald-400 font-bold">30 / minute</td>
                        <td className="px-4 py-2.5 text-slate-300">Per authenticated user</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">/api/flights/reserve</td>
                        <td className="px-4 py-2.5 text-emerald-400 font-bold">10 / minute</td>
                        <td className="px-4 py-2.5 text-slate-300">Per authenticated user</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-white">/api/login</td>
                        <td className="px-4 py-2.5 text-emerald-400 font-bold">10 / minute</td>
                        <td className="px-4 py-2.5 text-slate-300">Per IP address</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Best Practices Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-[#E4C88E]">Cache search results</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Offers expire within 10–15 minutes. Cache results and re-search if the customer takes longer before initiating payment.
                    </p>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-[#E4C88E]">Price immediately before reserve</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Call <code className="text-white">/pricing</code> within 5 minutes of calling <code className="text-white">/reserve</code> to minimize expiry errors.
                    </p>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-[#E4C88E]">Store PNR on receipt</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Save the PNR and booking reference into your persistent database immediately upon receiving a successful response.
                    </p>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-[#E4C88E]">Refresh tokens proactively</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The access_token expires in 15 minutes (900 seconds). Request a refreshed token to avoid mid-flow 401 errors.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 10: CONTACT & SUPPORT */}
            {(activeSection === 'contact' || activeSection === 'console') && (
              <section className="bg-[#0f2038] border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#CFAE70] uppercase">Section 10</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">Contact & Support</h2>
                </div>

                <p className="text-sm text-slate-300">
                  For integration support, API credentials, or technical assistance:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#E4C88E] font-bold text-xs">
                      <Building2 className="w-4 h-4" />
                      <span>Lagos Office</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      19, Pariola Street, Ogudu G.R.A, Lagos, Nigeria
                    </p>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#E4C88E] font-bold text-xs">
                      <Building2 className="w-4 h-4" />
                      <span>Abuja Office</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      T3, 3rd Floor, The Avenue Plaza, 27 Alexandria Street off Aminu Kano Crescent, Bannex Wuse 2, Abuja
                    </p>
                  </div>

                  <div className="bg-[#0a1424] border border-slate-700 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#E4C88E] font-bold text-xs">
                      <Building2 className="w-4 h-4" />
                      <span>Kano Office</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      12, Zoo Road, beside Sufi Mart, Kano
                    </p>
                  </div>
                </div>

                <div className="bg-[#142642] p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-[#CFAE70]" />
                      <span>+234 705 7000 247 · +234 911 1685 247</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#CFAE70]" />
                      <a href="mailto:info@247travels.com" className="text-[#E4C88E] hover:underline">info@247travels.com</a>
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    SkyLink API v1.0 — © 2025 247Travels Limited. Confidential.
                  </div>
                </div>
              </section>
            )}

            {/* INTERACTIVE LIVE API CONSOLE (TRY IT OUT) */}
            <section id="interactive-console" className="bg-[#0b1626] border-2 border-[#CFAE70] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#CFAE70] text-[#1B365D] flex items-center justify-center font-bold shadow">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                      Live SkyLink API Tester
                    </h3>
                    <p className="text-xs text-slate-300">
                      Execute live requests directly against the SkyLink API Engine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#050d18] p-1.5 rounded-xl border border-slate-700">
                  {(['login', 'search', 'pricing', 'reserve'] as const).map((ep) => (
                    <button
                      key={ep}
                      onClick={() => handleEndpointSelect(ep)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                        consoleEndpoint === ep
                          ? 'bg-[#CFAE70] text-[#1B365D] shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {ep === 'login' ? 'Auth' : ep}
                    </button>
                  ))}
                </div>
              </div>

              {/* Endpoint URL Bar */}
              <div className="bg-[#060e1a] border border-slate-700 rounded-xl p-3 flex items-center gap-3 font-mono text-xs">
                <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">POST</span>
                <span className="text-[#E4C88E] truncate">
                  {SKYLINK_BASE_URL}
                  {consoleEndpoint === 'login'
                    ? '/login'
                    : consoleEndpoint === 'search'
                    ? '/flights/search'
                    : consoleEndpoint === 'pricing'
                    ? '/flights/pricing'
                    : '/flights/reserve'}
                </span>
              </div>

              {/* Code Editor & Response Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Payload Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold uppercase tracking-wider text-[#CFAE70]">Request Body (JSON)</span>
                    <button
                      onClick={() => handleEndpointSelect(consoleEndpoint)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Sample</span>
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={consolePayload}
                    onChange={(e) => setConsolePayload(e.target.value)}
                    className="w-full bg-[#060e1a] border border-slate-700 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-[#CFAE70] leading-relaxed resize-none shadow-inner"
                  />

                  <button
                    onClick={handleExecuteConsole}
                    disabled={consoleLoading}
                    className="w-full gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] via-[#E4C88E] to-[#A98745] text-[#1B365D] font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {consoleLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>{consoleLoading ? 'Sending Request...' : 'Send Live Request'}</span>
                  </button>
                </div>

                {/* Response Output */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold uppercase tracking-wider text-slate-200">Response Payload</span>
                    {consoleStatusCode && (
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          consoleStatusCode === 200 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                            : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}>
                          HTTP {consoleStatusCode}
                        </span>
                        {consoleDurationMs !== null && (
                          <span className="text-slate-400">{consoleDurationMs} ms</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <pre className="w-full h-[288px] bg-[#060e1a] border border-slate-700 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-auto leading-relaxed shadow-inner">
                      {consoleResponse || '// Click "Send Live Request" to execute against the SkyLink engine and inspect live output.'}
                    </pre>
                    {consoleResponse && (
                      <button
                        onClick={() => handleCopy(consoleResponse, 'console_resp')}
                        className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-slate-300 px-2.5 py-1 rounded text-[11px] font-sans flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'console_resp' ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Users Icon fallback
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// Samples for Documentation
const sampleLoginResponse = `{
  "status": "success",
  "code": "LOGIN_SUCCESS",
  "data": {
    "user_id": "USR-001",
    "email": "partner@example.com",
    "name": "John Doe",
    "role": "api",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}`;

const sampleSearchRequest = `{
  "search_mode": "external",
  "from": "LOS",
  "to": "DXB",
  "flight_type": "oneway",
  "flights_departure_date": "2026-06-26",
  "adults": 1,
  "children": 0,
  "infants": 0,
  "class": "economy",
  "currency": "NGN"
}`;

const sampleSearchResponse = `{
  "success": true,
  "data": {
    "meta": {
      "search_id": "abc12345",
      "response_time_ms": 2840,
      "offices_searched": 4,
      "offices_with_results": 3,
      "total_flights": 20,
      "origin": "LOS",
      "destination": "DXB",
      "currency": "NGN"
    },
    "flights": [
      {
        "flight_no": "EK784",
        "airline": "EK",
        "airline_name": "Emirates",
        "departure_code": "LOS",
        "arrival_code": "DXB",
        "departure_time": "17:40",
        "arrival_time": "04:25",
        "duration_time": "6h 45m",
        "class": "Economy",
        "baggage": "30kg",
        "price": 759354,
        "currency": "NGN",
        "booking_token": "btk_3f8a2c1d9e7b..."
      }
    ]
  }
}`;

const samplePricingRequest = `{
  "booking_token": "btk_3f8a2c1d9e7b4a5f6c2d1e8f9a0b3c7d",
  "passengers": { "adults": 1, "children": 0, "infants": 0 },
  "currency": "NGN",
  "class": "economy"
}`;

const samplePricingResponse = `{
  "success": true,
  "data": {
    "booking_token": "btk_3f8a2c1d9e7b4a5f6c2d1e8f9a0b3c7d",
    "verified": true,
    "verification_skipped": false,
    "price_changed": false,
    "class_letter_changed": false,
    "cabin_class_shifted": false,
    "original_price": 759354,
    "verified_price": 759354,
    "currency": "NGN",
    "passengers": { "adults": 1, "children": 0, "infants": 0, "total": 1 },
    "expires_at": "2026-05-17 14:30:00",
    "response_time_ms": 1240,
    "message": "Price verified — no change."
  }
}`;

const sampleReserveRequest = `{
  "booking_token": "btk_3f8a2c1d9e7b4a5f6c2d1e8f9a0b3c7d",
  "passengers": { "adults": 1, "children": 0, "infants": 0 },
  "travellers": {
    "primary_guest": {
      "title": "Mr",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "08012345678",
      "country_code": "234",
      "dob": "1990-01-01",
      "gender": "male",
      "passport_number": "A12345678",
      "passport_expiry": "2030-01-01",
      "passport_issue_date": "2020-01-01",
      "nationality": "NG"
    }
  },
  "ticket_time_limit_hours": 48
}`;

const sampleReserveResponse = `{
  "success": true,
  "data": {
    "pnr": "ABC123",
    "booking_reference": "ABC123",
    "booking_token": "btk_3f8a2c1d9e7b4a5f6c2d1e8f9a0b3c7d",
    "carrier": "EK",
    "status": "confirmed",
    "passengers": { "adults": 1, "children": 0, "infants": 0, "total": 1 },
    "ticket_time_limit_hours": 48,
    "ticket_deadline": "2026-05-19 14:30:00",
    "response_time_ms": 4820,
    "message": "PNR generated successfully"
  }
}`;
