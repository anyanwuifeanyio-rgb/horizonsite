import React from 'react';

interface AirlineLogoProps {
  airlineId: string;
  className?: string;
  showText?: boolean;
}

export const AirlineLogo: React.FC<AirlineLogoProps> = ({
  airlineId = '',
  className = 'h-8',
  showText = true
}) => {
  switch ((airlineId || '').toLowerCase()) {
    case 'qatar':
    case 'qatar-airways':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Qatar Airways Oryx Emblem */}
          <div className="w-8 h-8 rounded-full bg-[#5C0632] flex items-center justify-center shrink-0 shadow-sm">
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" aria-label="Qatar Airways Oryx">
              <path d="M16 4C14.5 7.5 11 12 8 13.5c2.5 1 5.5 0.5 7.5-1 0.5 4-1 9-5 13 4-1 8.5-5 9.5-11 1 2 2.5 3 4.5 3-2-2.5-2.5-6-1.5-9.5 1.5 2 3.5 2.5 5.5 2-3-2-5-5-5.5-8C21.5 5 18 4.2 16 4z" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-extrabold tracking-wider text-[#5C0632] text-xs uppercase font-serif">QATAR</span>
              <span className="text-[9px] font-bold tracking-widest text-slate-700 uppercase">AIRWAYS</span>
            </div>
          )}
        </div>
      );

    case 'emirates':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Emirates Red Emblem with Calligraphy */}
          <div className="px-2.5 py-1 bg-[#D71921] rounded flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-extrabold text-xs tracking-tight font-serif">Emirates</span>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] font-bold text-[#D71921] uppercase tracking-widest">Fly Better</span>
            </div>
          )}
        </div>
      );

    case 'british-airways':
    case 'ba':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* British Airways Speedmark Ribbon */}
          <div className="relative flex items-center shrink-0">
            <svg viewBox="0 0 40 16" className="w-9 h-4" aria-label="British Airways Speedmark">
              <path d="M0 12 C12 12, 22 2, 38 0 C30 6, 20 14, 8 15 Z" fill="#EB2226" />
              <path d="M8 15 C18 13, 28 5, 40 0 C34 5, 26 12, 14 16 Z" fill="#075AAA" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold text-[#075AAA] text-xs uppercase tracking-tight font-serif">BRITISH AIRWAYS</span>
            </div>
          )}
        </div>
      );

    case 'air-peace':
    case 'p4':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Air Peace Wings Emblem */}
          <div className="w-8 h-8 rounded-full bg-[#0B3060] flex items-center justify-center shrink-0 border-2 border-[#D81A22] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-label="Air Peace Wings">
              <path d="M12 2L14.5 8.5L21 9L16 13.5L17.5 20L12 16.5L6.5 20L8 13.5L3 9L9.5 8.5L12 2Z" fill="#D81A22" />
              <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#0B3060] text-xs uppercase tracking-tight">AIR PEACE</span>
              <span className="text-[8px] font-bold text-[#D81A22] uppercase tracking-wider">Your Peace, Our Goal</span>
            </div>
          )}
        </div>
      );

    case 'ibom-air':
    case 'ibom':
    case 'qi':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Ibom Air Orange Wing */}
          <div className="w-8 h-8 rounded-full bg-[#0A192F] flex items-center justify-center shrink-0 border-2 border-[#FF5900] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FF5900]" aria-label="Ibom Air Wing">
              <path d="M2 14 C6 8, 14 5, 22 4 C18 9, 13 14, 8 18 C5 19, 3 17, 2 14 Z" />
              <path d="M7 14 C11 10, 16 8, 21 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#FF5900] text-xs uppercase tracking-tight font-sans">IBOM AIR</span>
              <span className="text-[8px] font-bold text-[#0A192F] uppercase tracking-wider">Schedule Reliability</span>
            </div>
          )}
        </div>
      );

    case 'united-nigeria':
    case 'united-nigeria-airlines':
    case 'u5':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* United Nigeria Airlines Emerald & Gold Badge */}
          <div className="w-8 h-8 rounded-full bg-[#006633] flex items-center justify-center shrink-0 border-2 border-[#FFB81C] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FFB81C]" aria-label="United Nigeria Wings">
              <path d="M12 3 L15 10 L22 11 L17 16 L18 22 L12 18 L6 22 L7 16 L2 11 L9 10 Z" />
              <circle cx="12" cy="12" r="2.5" fill="#006633" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#006633] text-xs uppercase tracking-tight">UNITED NIGERIA</span>
              <span className="text-[8px] font-bold text-[#D97706] uppercase tracking-wider">Flying to Unite</span>
            </div>
          )}
        </div>
      );

    case 'green-africa':
    case 'green-africa-airways':
    case 'q9':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Green Africa Bababue Lime Emblem */}
          <div className="w-8 h-8 rounded-full bg-[#7BB31A] flex items-center justify-center shrink-0 border border-[#2D572C] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-label="Green Africa Leaf">
              <path d="M12 2 C16 6, 20 12, 19 18 C17 21, 13 22, 10 20 C6 18, 4 14, 5 9 C7 5, 9 3, 12 2 Z" />
              <path d="M10 20 L14 7" stroke="#2D572C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#2D572C] text-xs uppercase tracking-tight">GREEN AFRICA</span>
              <span className="text-[8px] font-bold text-[#7BB31A] uppercase tracking-wider">Go Further</span>
            </div>
          )}
        </div>
      );

    case 'aero-contractors':
    case 'aero':
    case 'ng':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Aero Contractors Blue Swoosh */}
          <div className="w-8 h-8 rounded-full bg-[#003399] flex items-center justify-center shrink-0 border-2 border-[#38BDF8] shadow-sm">
            <span className="text-white font-black text-xs italic tracking-tighter">aero</span>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#003399] text-xs uppercase tracking-tight">AERO</span>
              <span className="text-[8px] font-semibold text-slate-600 uppercase tracking-wider">Contractors</span>
            </div>
          )}
        </div>
      );

    case 'arik-air':
    case 'arik':
    case 'w3':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Arik Air Crimson & Blue Wings */}
          <div className="w-8 h-8 rounded-full bg-[#BA0C2F] flex items-center justify-center shrink-0 border-2 border-[#002D62] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-label="Arik Air Bird">
              <path d="M3 13 C7 9, 13 6, 21 5 C17 10, 13 15, 6 18 Z" />
              <path d="M8 12 L14 11" stroke="#002D62" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#BA0C2F] text-xs uppercase tracking-tight">ARIK AIR</span>
              <span className="text-[8px] font-bold text-[#002D62] uppercase tracking-wider">Wings of Nigeria</span>
            </div>
          )}
        </div>
      );

    case 'valuejet':
    case 'vk':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* ValueJet Magenta Roundel */}
          <div className="w-8 h-8 rounded-full bg-[#7A1350] flex items-center justify-center shrink-0 border-2 border-[#F59E0B] shadow-sm">
            <span className="text-[#F59E0B] font-black text-xs">VJ</span>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#7A1350] text-xs uppercase tracking-tight">VALUEJET</span>
              <span className="text-[8px] font-bold text-[#F59E0B] uppercase tracking-wider">Fly Value</span>
            </div>
          )}
        </div>
      );

    case 'overland':
    case 'overland-airways':
    case 'of':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Overland Airways */}
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center shrink-0 border-2 border-[#F5A623] shadow-sm">
            <span className="text-[#F5A623] font-black text-xs">OF</span>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#1E3A8A] text-xs uppercase tracking-tight">OVERLAND</span>
              <span className="text-[8px] font-bold text-[#F5A623] uppercase tracking-wider">Airways</span>
            </div>
          )}
        </div>
      );

    case 'klm':
    case 'klm-royal-dutch':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* KLM Royal Dutch Crown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <svg viewBox="0 0 30 20" className="w-6 h-4 fill-[#00A1DE]" aria-label="KLM Crown">
              <circle cx="5" cy="4" r="2.5" />
              <circle cx="15" cy="2" r="2.5" />
              <circle cx="25" cy="4" r="2.5" />
              <path d="M2 9 L28 9 L24 18 L6 18 Z" />
            </svg>
            <span className="font-extrabold text-[#00A1DE] text-sm tracking-tighter">KLM</span>
          </div>
          {showText && (
            <span className="text-[9px] text-slate-500 font-medium hidden sm:inline">Royal Dutch</span>
          )}
        </div>
      );

    case 'turkish-airlines':
    case 'turkish':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Turkish Airlines Flying Goose Roundel */}
          <div className="w-7 h-7 rounded-full bg-[#E81932] flex items-center justify-center shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-label="Turkish Airlines Bird">
              <path d="M3 13 C8 12, 14 8, 21 4 C16 9, 12 15, 6 19 C8 16, 8 14, 3 13 Z" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-extrabold text-[#232B38] text-xs uppercase tracking-tight">TURKISH</span>
              <span className="text-[8px] font-bold text-[#E81932] uppercase tracking-wider">AIRLINES</span>
            </div>
          )}
        </div>
      );

    case 'ethiopian-airlines':
    case 'ethiopian':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Ethiopian Airlines Tri-Color Wing */}
          <div className="w-7 h-7 rounded-full bg-[#008751] flex items-center justify-center shrink-0 border-2 border-[#FFD100] shadow-sm">
            <span className="text-[#FFD100] font-black text-xs">ET</span>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#008751] text-xs italic tracking-tight">Ethiopian</span>
              <span className="text-[8px] font-bold text-[#DA121A] uppercase tracking-wider">The New Spirit of Africa</span>
            </div>
          )}
        </div>
      );

    case 'virgin-atlantic':
    case 'virgin':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Virgin Atlantic Ribbon */}
          <div className="flex items-center shrink-0">
            <div className="bg-[#E10A11] px-2 py-0.5 rounded text-white font-extrabold text-xs italic tracking-tight font-serif">
              Virgin
            </div>
          </div>
          {showText && (
            <span className="font-bold text-[#4B1E5B] text-xs tracking-tight">atlantic</span>
          )}
        </div>
      );

    case 'lufthansa':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Lufthansa Crane in Circle */}
          <div className="w-7 h-7 rounded-full bg-[#05164D] flex items-center justify-center shrink-0 border border-[#FFAC00] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FFAC00]" aria-label="Lufthansa Crane">
              <path d="M4 14 C9 13, 15 9, 20 4 C16 9, 11 16, 7 19 C8 16, 7 14, 4 14 Z" />
              <circle cx="12" cy="12" r="10" stroke="#FFAC00" strokeWidth="1" fill="none" />
            </svg>
          </div>
          {showText && (
            <span className="font-black text-[#05164D] text-xs uppercase tracking-wider">Lufthansa</span>
          )}
        </div>
      );

    case 'air-france':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {/* Air France Red Accent */}
          <span className="font-black text-[#002157] text-xs tracking-wider">AIRFRANCE</span>
          <div className="w-2.5 h-3.5 bg-[#ED1C24] -skew-x-12 shrink-0 rounded-xs" />
        </div>
      );

    case 'delta':
    case 'delta-air-lines':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Delta 3D Triangle Widget */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-label="Delta Widget">
            <polygon points="12,2 2,20 22,20" fill="#E01933" />
            <polygon points="12,7 6,19 18,19" fill="#002244" />
          </svg>
          {showText && (
            <span className="font-extrabold text-[#002244] text-xs tracking-wider uppercase">DELTA</span>
          )}
        </div>
      );

    case 'egyptair':
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* EgyptAir Horus Emblem */}
          <div className="w-7 h-7 rounded-full bg-[#0E2856] flex items-center justify-center shrink-0 border border-[#CFAE70]">
            <span className="text-[#CFAE70] font-black text-xs">MS</span>
          </div>
          {showText && (
            <span className="font-extrabold text-[#0E2856] text-xs tracking-wider uppercase">EGYPTAIR</span>
          )}
        </div>
      );

    default:
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="w-7 h-7 rounded-full bg-[#1B365D] text-[#CFAE70] flex items-center justify-center text-xs font-bold shrink-0">
            ✈️
          </div>
          {showText && (
            <span className="font-bold text-[#1B365D] text-xs">{airlineId}</span>
          )}
        </div>
      );
  }
};
