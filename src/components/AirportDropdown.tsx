import React, { useState, useRef, useEffect } from 'react';
import { 
  PlaneTakeoff, 
  PlaneLanding, 
  Search, 
  ChevronDown, 
  X, 
  Check, 
  MapPin, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { 
  AIRPORTS, 
  AIRPORT_REGIONS, 
  AirportRegion, 
  formatAirportValue, 
  matchAirportFromString 
} from '../data/airportsData';
import { Airport } from '../types';

interface AirportDropdownProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  iconType?: 'departure' | 'destination';
  required?: boolean;
  disabled?: boolean;
}

export const AirportDropdown: React.FC<AirportDropdownProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Select airport...',
  iconType = 'departure',
  required = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<AirportRegion>('All');
  const [useNativeSelect, setUseNativeSelect] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Identify matched airport for the current value
  const currentAirport = matchAirportFromString(value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      // Auto-focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter airports based on search query and region tab
  const filteredAirports = AIRPORTS.filter((airport) => {
    // Region check
    if (activeRegion === 'Popular' && !airport.popular) {
      return false;
    }
    if (activeRegion !== 'All' && activeRegion !== 'Popular' && airport.region !== activeRegion) {
      return false;
    }

    // Search query check
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return (
      airport.code.toLowerCase().includes(query) ||
      airport.city.toLowerCase().includes(query) ||
      airport.name.toLowerCase().includes(query) ||
      airport.country.toLowerCase().includes(query)
    );
  });

  const handleSelectAirport = (airport: Airport) => {
    const formatted = formatAirportValue(airport);
    onChange(formatted);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectCustom = () => {
    if (searchQuery.trim()) {
      onChange(searchQuery.trim());
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const IconComponent = iconType === 'departure' ? PlaneTakeoff : PlaneLanding;

  return (
    <div className="relative" ref={containerRef} id={id}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
          <IconComponent className="w-3.5 h-3.5 text-[#B8934C]" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setUseNativeSelect(!useNativeSelect)}
          className="text-[10px] text-slate-400 hover:text-[#1B365D] transition-colors flex items-center gap-1 cursor-pointer"
          title="Switch between searchable dropdown and native select list"
        >
          <SlidersHorizontal className="w-2.5 h-2.5" />
          <span>{useNativeSelect ? 'Searchable View' : 'Standard Select'}</span>
        </button>
      </div>

      {/* OPTION A: NATIVE SELECT DROPDOWN */}
      {useNativeSelect ? (
        <div className="relative">
          <select
            value={value}
            required={required}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer appearance-none pr-10 shadow-sm"
          >
            <option value="" disabled>-- Select Airport --</option>
            {AIRPORT_REGIONS.filter(r => r !== 'All' && r !== 'Popular').map((region) => {
              const regionAirports = AIRPORTS.filter(a => a.region === region);
              if (regionAirports.length === 0) return null;
              return (
                <optgroup key={region} label={`─── ${region} ───`}>
                  {regionAirports.map((airport) => {
                    const formatted = formatAirportValue(airport);
                    return (
                      <option key={airport.code} value={formatted}>
                        {airport.city} ({airport.code}) - {airport.name}, {airport.country}
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      ) : (
        /* OPTION B: CUSTOM LUXURY SEARCHABLE DROPDOWN */
        <div className="relative">
          {/* Trigger Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full text-left bg-slate-50 border rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 transition-all flex items-center justify-between gap-2 shadow-sm cursor-pointer ${
              isOpen
                ? 'border-[#CFAE70] ring-2 ring-[#CFAE70]/20 bg-white'
                : 'border-slate-300 hover:border-slate-400'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden flex-1">
              {currentAirport ? (
                <>
                  <span className="w-10 h-7 rounded-lg bg-[#1B365D] text-[#E4C88E] font-mono font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm border border-[#CFAE70]/30">
                    {currentAirport.code}
                  </span>
                  <div className="truncate flex-1">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                      {currentAirport.city} <span className="text-slate-500 font-normal">({currentAirport.country})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate leading-tight">
                      {currentAirport.name}
                    </div>
                  </div>
                </>
              ) : value ? (
                <>
                  <span className="w-10 h-7 rounded-lg bg-slate-700 text-slate-200 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {value.match(/\b([A-Z]{3})\b/)?.[1] || 'AIR'}
                  </span>
                  <div className="truncate font-semibold text-slate-800 text-xs sm:text-sm">
                    {value}
                  </div>
                </>
              ) : (
                <span className="text-slate-400 text-xs sm:text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{placeholder}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 text-slate-400">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="p-1 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
                  title="Clear selection"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#B8934C]' : ''}`} />
            </div>
          </button>

          {/* Hidden input for form requirement checks */}
          <input
            type="text"
            required={required}
            value={value}
            readOnly
            className="sr-only"
            tabIndex={-1}
          />

          {/* Dropdown Popover */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-[#CFAE70]/60 overflow-hidden animate-in fade-in zoom-in-95 duration-150 sm:min-w-[340px] md:min-w-[420px]">
              {/* Header / Search bar */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, airport name, or 3-letter IATA code (e.g. Lagos, LHR, Toronto)..."
                    className="w-full bg-white border border-slate-300 focus:border-[#CFAE70] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 focus:outline-none shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Region Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin text-[11px] no-scrollbar">
                  {AIRPORT_REGIONS.map((region) => {
                    const isActive = activeRegion === region;
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setActiveRegion(region)}
                        className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#1B365D] text-[#E4C88E] shadow-sm'
                            : 'bg-white hover:bg-slate-200/70 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {region === 'Popular' && <Sparkles className="w-2.5 h-2.5 inline mr-1 text-[#CFAE70]" />}
                        {region}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Airports List */}
              <div className="max-h-64 sm:max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
                {filteredAirports.length > 0 ? (
                  filteredAirports.map((airport) => {
                    const isSelected = currentAirport?.code === airport.code;
                    return (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => handleSelectAirport(airport)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                          isSelected
                            ? 'bg-[#CFAE70]/15 border border-[#CFAE70]/40'
                            : 'hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className={`w-11 h-8 rounded-lg font-mono font-extrabold text-xs flex items-center justify-center shrink-0 border transition-all ${
                            isSelected
                              ? 'bg-[#1B365D] text-[#F3E5AB] border-[#CFAE70]'
                              : 'bg-slate-100 group-hover:bg-[#1B365D] text-slate-700 group-hover:text-[#F3E5AB] border-slate-200 group-hover:border-[#CFAE70]'
                          }`}>
                            {airport.code}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 leading-tight">
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {airport.city}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                · {airport.country}
                              </span>
                              {airport.popular && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                  POPULAR
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                              {airport.name}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#1B365D] text-[#E4C88E] flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <p className="text-xs text-slate-500">
                      No predefined airport matched &ldquo;{searchQuery}&rdquo; in {activeRegion}.
                    </p>
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={handleSelectCustom}
                        className="gold-shimmer-btn bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Use &ldquo;{searchQuery}&rdquo; as Airport</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Footer Info */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <span>{filteredAirports.length} airports available</span>
                <span className="font-mono">SkyLink Global IATA Index</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
