import React from 'react';

interface UniversityLogoProps {
  universityId: string;
  className?: string;
  showText?: boolean;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  universityId = '',
  className = 'h-8',
  showText = true
}) => {
  switch ((universityId || '').toLowerCase()) {
    case 'coventry':
    case 'coventry-university':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Coventry Phoenix rising from flames crest */}
          <div className="w-8 h-8 rounded-lg bg-[#002D62] flex items-center justify-center shrink-0 border border-[#CFAE70]/60 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#CFAE70]" aria-label="Coventry Phoenix">
              <path d="M12 2C10.5 4.5 9 7.5 9 10C9 11.5 9.5 13 10.5 14C8.5 13 6 10 6 7C4 9.5 3 13 4 16C5 19 8 21.5 12 22C16 21.5 19 19 20 16C21 13 20 9.5 18 7C18 10 15.5 13 13.5 14C14.5 13 15 11.5 15 10C15 7.5 13.5 4.5 12 2Z" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#002D62] text-xs uppercase font-serif tracking-tight">Coventry</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">University</span>
            </div>
          )}
        </div>
      );

    case 'hertfordshire':
    case 'university-of-hertfordshire':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Hertfordshire Royal Hart / Crown Crest */}
          <div className="w-8 h-8 rounded-lg bg-[#5C2D91] flex items-center justify-center shrink-0 border border-[#FFB81C]/50 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FFB81C]" aria-label="Hertfordshire Hart">
              <path d="M5 4L8 8L12 3L16 8L19 4L18 13C18 17.5 15 20.5 12 21.5C9 20.5 6 17.5 6 13L5 4Z" />
              <circle cx="12" cy="12" r="2.5" fill="#5C2D91" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] font-bold text-[#5C2D91] uppercase tracking-wider">University of</span>
              <span className="font-extrabold text-[#5C2D91] text-xs uppercase tracking-tight font-serif">Hertfordshire</span>
            </div>
          )}
        </div>
      );

    case 'oxford-brookes':
    case 'oxford-brookes-university':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Oxford Brookes Open Book & Tower Shield */}
          <div className="w-8 h-8 rounded-lg bg-[#8B0000] flex items-center justify-center shrink-0 border border-[#CFAE70]/50 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-label="Oxford Brookes Shield">
              <path d="M12 3L4 6V12C4 17 8 20.5 12 22C16 20.5 20 17 20 12V6L12 3Z" fill="#8B0000" stroke="#CFAE70" strokeWidth="1" />
              <path d="M8 8H16M8 11H16M8 14H13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold text-[#8B0000] text-xs uppercase tracking-tight font-serif">OXFORD</span>
              <span className="text-[9px] font-extrabold text-[#1B365D] uppercase tracking-wider">BROOKES</span>
            </div>
          )}
        </div>
      );

    case 'seneca':
    case 'seneca-polytechnic':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Seneca Red Double-S Chevron */}
          <div className="w-8 h-8 rounded-lg bg-[#D9272E] flex items-center justify-center shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-label="Seneca S">
              <path d="M6 6C6 4 8 2 12 2C16 2 18 4 18 6C18 10 6 10 6 14C6 16 8 18 12 18C16 18 18 16 18 14H15C15 15 14 16 12 16C10 16 9 15 9 14C9 11 21 11 21 6C21 2 17 0 12 0C7 0 3 2 3 6H6Z" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#D9272E] text-xs uppercase tracking-wider">SENECA</span>
              <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">POLYTECHNIC</span>
            </div>
          )}
        </div>
      );

    case 'vistula':
    case 'vistula-university':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Vistula European Star & V Shield */}
          <div className="w-8 h-8 rounded-lg bg-[#003399] flex items-center justify-center shrink-0 border border-[#F3B229] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#F3B229]" aria-label="Vistula V">
              <path d="M4 3L12 19L20 3H16L12 12L8 3H4Z" />
              <polygon points="12,1 13,3 15,3 13.5,4.5 14,6.5 12,5.2 10,6.5 10.5,4.5 9,3 11,3" fill="#FFFFFF" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-extrabold text-[#003399] text-xs uppercase tracking-wider font-serif">VISTULA</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">UNIVERSITY • POLAND</span>
            </div>
          )}
        </div>
      );

    case 'tu-berlin':
    case 'technical-university-of-berlin':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* TU Berlin Red Monogram */}
          <div className="w-8 h-8 rounded-lg bg-[#C50E1F] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-black text-xs tracking-tighter">TU</span>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#C50E1F] text-xs tracking-tight">TU BERLIN</span>
              <span className="text-[8px] font-medium text-slate-600 uppercase">Germany</span>
            </div>
          )}
        </div>
      );

    case 'deakin':
    case 'deakin-university':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Deakin Stylized D Ribbon */}
          <div className="w-8 h-8 rounded-lg bg-[#007A3D] flex items-center justify-center shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-label="Deakin D">
              <path d="M5 3H12C16.5 3 20 6.5 20 12C20 17.5 16.5 21 12 21H5V3ZM9 7V17H12C14.5 17 16 15 16 12C16 9 14.5 7 12 7H9Z" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#007A3D] text-xs uppercase tracking-wider font-serif">DEAKIN</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">UNIVERSITY • AUSTRALIA</span>
            </div>
          )}
        </div>
      );

    case 'northeastern':
    case 'northeastern-university':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Northeastern Classic Serif N */}
          <div className="w-8 h-8 rounded-lg bg-[#CC0000] flex items-center justify-center shrink-0 shadow-sm border border-black/20">
            <span className="text-white font-black text-sm font-serif">N</span>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-extrabold text-[#CC0000] text-xs uppercase font-serif tracking-tight">Northeastern</span>
              <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">University • Boston USA</span>
            </div>
          )}
        </div>
      );

    case 'sunderland':
    case 'university-of-sunderland':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Sunderland Sunburst Sea Crest */}
          <div className="w-8 h-8 rounded-lg bg-[#004B87] flex items-center justify-center shrink-0 border border-[#FF671F] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF671F]" aria-label="Sunderland Crest">
              <circle cx="12" cy="12" r="6" fill="#FF671F" />
              <path d="M12 2L12 5M12 19L12 22M2 12L5 12M19 12L22 12M5 5L7 7M17 17L19 19M5 19L7 17M17 7L19 5" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] font-bold text-slate-500 uppercase">University of</span>
              <span className="font-extrabold text-[#004B87] text-xs uppercase tracking-tight font-serif">Sunderland</span>
            </div>
          )}
        </div>
      );

    case 'greenwich':
    case 'university-of-greenwich':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Greenwich Maritime Compass & Anchor */}
          <div className="w-8 h-8 rounded-lg bg-[#0A1931] flex items-center justify-center shrink-0 border border-[#CFAE70] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#CFAE70]" aria-label="Greenwich Compass">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] font-bold text-slate-500 uppercase">University of</span>
              <span className="font-extrabold text-[#0A1931] text-xs uppercase tracking-tight font-serif">Greenwich</span>
            </div>
          )}
        </div>
      );

    case 'dublin-business-school':
    case 'dbs':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Dublin Business School Irish Emerald Harp */}
          <div className="w-8 h-8 rounded-lg bg-[#006644] flex items-center justify-center shrink-0 border border-[#FFD100] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FFD100]" aria-label="DBS Harp">
              <path d="M6 3C12 3 18 7 18 13C18 18 14 21 6 21V3Z" fill="none" stroke="#FFD100" strokeWidth="2" />
              <line x1="8" y1="5" x2="8" y2="19" stroke="#FFD100" strokeWidth="1" />
              <line x1="11" y1="7" x2="11" y2="17" stroke="#FFD100" strokeWidth="1" />
              <line x1="14" y1="10" x2="14" y2="15" stroke="#FFD100" strokeWidth="1" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-[#006644] text-xs uppercase tracking-tight">DBS DUBLIN</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Business School • Ireland</span>
            </div>
          )}
        </div>
      );

    case 'fanshawe':
    case 'fanshawe-college':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Fanshawe Canadian Red Falcon */}
          <div className="w-8 h-8 rounded-lg bg-[#BA0C2F] flex items-center justify-center shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-label="Fanshawe Falcon">
              <path d="M3 13C8 12 14 7 21 3C17 10 13 18 5 21C7 17 6 15 3 13Z" />
            </svg>
          </div>
          {showText && (
            <div className="flex flex-col text-left leading-none">
              <span className="font-extrabold text-[#BA0C2F] text-xs uppercase tracking-tight">FANSHAWE</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">College • Canada</span>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-[#1B365D] text-[#CFAE70] flex items-center justify-center text-xs font-bold shrink-0">
            🎓
          </div>
          {showText && (
            <span className="font-bold text-[#1B365D] text-xs">{universityId}</span>
          )}
        </div>
      );
  }
};
