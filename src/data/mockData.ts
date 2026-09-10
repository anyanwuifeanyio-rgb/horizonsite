import { StudyCountry, WorkPermitCountry, VisaServiceCountry, HolidayPackage, Testimonial, FAQItem, PartnerAirline, PartnerUniversity } from '../types';
import chineduAvatar from '../assets/images/chinedu_okeke_avatar_1788819076154.jpg';
import olusegunAdeshinaImg from '../assets/images/olusegun_adeshina_1788943813226.jpg';
import sharonOgechiImg from '../assets/images/barrister_sharon_ogechi_1788942488905.jpg';
import victorNwosuImg from '../assets/images/victor_nwosu_counselor_1788942501375.jpg';
import fauziyahBelloImg from '../assets/images/fauziyah_bello_travel_1788942521732.jpg';

export const STUDY_COUNTRIES: StudyCountry[] = [
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
    headline: 'World-Class Education & 2-Year Graduate Route Post-Study Visa',
    popularPrograms: [
      'MSc Business Analytics & Project Management',
      'MSc Advanced Computer Science & AI',
      'MSc Public Health & Healthcare Leadership',
      'LLM International Commercial Law',
      'BSc Nursing & Biomedical Science',
      'MBA Global Executive Leadership'
    ],
    intakes: ['September 2026', 'January 2027', 'May 2027'],
    keyBenefits: [
      '2-Year Post-Study Work Visa (3 years for PhD)',
      'WAEC/NECO English Grade C accepted (No IELTS required for most partner universities)',
      'Fast-track CAS issuance (5-10 working days)',
      'Option to bring dependents (for postgraduate research programs)'
    ],
    averageTuition: {
      NGN: '₦18,500,000 - ₦28,000,000 / yr',
      GBP: '£12,500 - £18,500 / yr',
      USD: '$16,000 - $24,000 / yr',
      EUR: '€14,800 - €22,000 / yr'
    },
    postStudyWork: '2 Years (Graduate Route Visa)',
    workWhileStudying: '20 Hours/Week during term time (Full-time on holidays)',
    processingTime: '3 - 5 Weeks for CAS + Visa',
    topUniversities: [
      'University of Hertfordshire',
      'Coventry University',
      'Oxford Brookes University',
      'University of Sunderland',
      'Teesside University',
      'University of Greenwich'
    ]
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    heroImage: 'https://images.unsplash.com/photo-1517935703635-2719054546e3?auto=format&fit=crop&w=900&q=80',
    headline: 'High Standard of Living, Affordable Tuition & Direct PR Pathways',
    popularPrograms: [
      'Post-Graduate Certificate in Data Analytics',
      'Diploma in Cloud Computing & Cyber Security',
      'Master of Global Business Administration',
      'Supply Chain & Logistics Management',
      'Early Childhood Care & Community Health',
      'Engineering & Construction Tech'
    ],
    intakes: ['September 2026', 'January 2027', 'May 2027'],
    keyBenefits: [
      'Up to 3-Year Post-Graduation Work Permit (PGWP)',
      'Lucrative Express Entry & Provincial Nominee (PNP) pathways to Permanent Residence',
      'High minimum wages across Ontario, Alberta & British Columbia',
      'Co-op paid internships included in many diploma programs'
    ],
    averageTuition: {
      NGN: '₦19,000,000 - ₦30,000,000 / yr',
      GBP: '£13,000 - £20,000 / yr',
      USD: '$16,500 - $26,000 / yr',
      EUR: '€15,000 - €24,000 / yr'
    },
    postStudyWork: 'Up to 3 Years PGWP',
    workWhileStudying: '24 Hours/Week off-campus during academic terms',
    processingTime: '6 - 10 Weeks for Study Permit',
    topUniversities: [
      'Seneca Polytechnic',
      'Conestoga College',
      'Humber Polytechnic',
      'University of Windsor',
      'Cape Breton University',
      'Thompson Rivers University'
    ]
  },
  {
    id: 'europe',
    name: 'Europe (Germany, Poland, Ireland, France)',
    code: 'EU',
    flag: '🇪🇺',
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80',
    headline: 'Tuition-Free / Low Tuition Opportunities with Schengen Mobility',
    popularPrograms: [
      'MSc Renewable Energy & Environmental Engineering',
      'MSc Software Development & Cloud Technologies',
      'Bachelor of International Business (100% English)',
      'Automotive Systems & Robotics',
      'Finance, Banking & FinTech'
    ],
    intakes: ['October / Winter 2026', 'March / Summer 2027'],
    keyBenefits: [
      'Low to zero tuition fees at German public universities',
      'Travel freely across 29 Schengen member states without extra visas',
      '18-Month Jobseeker Visa post-graduation in Germany & Ireland',
      'Affordable living costs in Poland, Czech Republic & Hungary'
    ],
    averageTuition: {
      NGN: '₦4,500,000 - ₦14,000,000 / yr',
      GBP: '£3,000 - £9,500 / yr',
      USD: '$4,000 - $12,000 / yr',
      EUR: '€3,500 - €11,000 / yr'
    },
    postStudyWork: '12 - 18 Months Stay-Back Option',
    workWhileStudying: '140 Full Days or 280 Half Days per calendar year',
    processingTime: '4 - 8 Weeks',
    topUniversities: [
      'TU Munich & TU Berlin (Germany)',
      'Warsaw University of Technology (Poland)',
      'National College of Ireland (Dublin)',
      'Vistula University (Poland)',
      'ICN Business School (France)'
    ]
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=900&q=80',
    headline: 'High Earning Potential, Sunny Quality of Life & Extended Post-Study Visas',
    popularPrograms: [
      'Master of Information Technology & Cybersecurity',
      'Master of Professional Accounting',
      'Bachelor of Nursing (Direct AHPRA route)',
      'Master of Construction Management',
      'Hospitality & Tourism Leadership'
    ],
    intakes: ['July 2026', 'November 2026', 'February 2027'],
    keyBenefits: [
      'Subclass 485 Graduate Visa (2 - 4 years stay depending on degree)',
      'High minimum hourly wage ($24.10 AUD/hr)',
      'Regional study migration bonus points for PR',
      'World top 100 universities and leading research centres'
    ],
    averageTuition: {
      NGN: '₦22,000,000 - ₦38,000,000 / yr',
      GBP: '£15,000 - £25,000 / yr',
      USD: '$18,000 - $30,000 / yr',
      EUR: '€17,000 - €28,000 / yr'
    },
    postStudyWork: '2 - 4 Years Temporary Graduate Visa',
    workWhileStudying: '48 Hours per fortnight during semesters',
    processingTime: '4 - 8 Weeks',
    topUniversities: [
      'University of Wollongong',
      'Deakin University',
      'Western Sydney University',
      'Federation University',
      'Torrens University Australia'
    ]
  },
  {
    id: 'usa',
    name: 'United States of America',
    code: 'US',
    flag: '🇺🇸',
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
    headline: 'Ivy League Standards, STEM OPT (3 Years Work Permit) & Generous Scholarships',
    popularPrograms: [
      'STEM MS Computer Science & Software Engineering',
      'Master of Public Health (MPH)',
      'MS Financial Engineering & Econometrics',
      'BSc Mechanical & Electrical Engineering',
      'Biotechnology & Clinical Research'
    ],
    intakes: ['Fall (August 2026)', 'Spring (January 2027)'],
    keyBenefits: [
      '3-Year STEM OPT (Optional Practical Training) work authorization',
      'Scholarships & Graduate Assistantships (covering up to 50% tuition)',
      'I-20 issuance within 1 - 2 weeks from our direct partner colleges',
      'Extensive career networking with Fortune 500 companies'
    ],
    averageTuition: {
      NGN: '₦20,000,000 - ₦35,000,000 / yr',
      GBP: '£14,000 - £24,000 / yr',
      USD: '$17,000 - $28,000 / yr',
      EUR: '€16,000 - €26,000 / yr'
    },
    postStudyWork: '1 Year (Non-STEM) or 3 Years (STEM Programs)',
    workWhileStudying: '20 Hours/Week on-campus during sessions',
    processingTime: '2 - 4 Weeks for I-20 + Visa Interview prep',
    topUniversities: [
      'Arizona State University',
      'University of South Florida',
      'Northeastern University',
      'Illinois Institute of Technology',
      'Texas A&M University - Corpus Christi'
    ]
  }
];

export const WORK_PERMIT_COUNTRIES: WorkPermitCountry[] = [
  {
    id: 'serbia',
    name: 'Serbia',
    code: 'RS',
    flag: '🇷🇸',
    image: 'https://images.unsplash.com/photo-1563277068-ee59738c203e?auto=format&fit=crop&w=900&q=80',
    jobSectors: [
      'Construction & Civil Works (Masons, Carpenters, Welders, Electricians)',
      'Logistics, Warehousing & Forklift Drivers',
      'Hospitality, Kitchen Staff & Hotel Services',
      'Factory Production & Food Packaging',
      'Heavy Truck & Commercial Delivery Drivers'
    ],
    processingTime: '60 - 90 Days',
    requirements: [
      'Valid International Passport (Min. 2 years validity)',
      'Police Character Clearance Certificate (Apostilled)',
      'Updated CV / Resume (Horizon Move formats for EU)',
      'Passport Photograph with white background',
      'Medical fitness certificate'
    ],
    contractDuration: '1 - 2 Years Renewable with TRC (Temporary Residence Permit)',
    salaryRange: {
      EUR: '€800 - €1,400 / month (Net + Free Accommodation)',
      NGN: '₦1,200,000 - ₦2,200,000 / month'
    },
    highlights: [
      'Employer provides free company accommodation and shared transport',
      'Overtime pay available for extra hours',
      'Direct pathway to European permanent residency after continuous employment',
      'High approval rates for Nigerian applicants'
    ],
    visaType: 'Type D National Work Visa'
  },
  {
    id: 'poland',
    name: 'Poland (EU Schengen)',
    code: 'PL',
    flag: '🇵🇱',
    image: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=900&q=80',
    jobSectors: [
      'Automotive Assembly & Metal Fabrication',
      'Warehouse Order Picking & E-Commerce Logistics',
      'Food Processing & Poultry Operations',
      'Heavy Machinery Operators & Welders (MIG/MAG/TIG)',
      'Hospitality & Industrial Cleaning'
    ],
    processingTime: '90 - 120 Days (Voivodeship Permit)',
    requirements: [
      'Valid Nigerian Passport',
      'Clean Police Report (Legalized)',
      'Europass Format CV',
      'Proof of work experience or trade certifications',
      'Embassy appointment slot booking'
    ],
    contractDuration: '1 Year Renewable Work Permit (Zezwolenie Typ A) + Karta Pobytu',
    salaryRange: {
      EUR: '€1,000 - €1,800 / month',
      NGN: '₦1,600,000 - ₦2,800,000 / month'
    },
    highlights: [
      'Full Schengen Area freedom of travel during off-days',
      'Health insurance covered by Polish social security (ZUS)',
      'Card of Residence (Karta Pobytu) renewable without returning home',
      'Overtime bonuses and shift allowances'
    ],
    visaType: 'National D-Type Schengen Work Visa'
  },
  {
    id: 'czech',
    name: 'Czech Republic',
    code: 'CZ',
    flag: '🇨🇿',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=900&q=80',
    jobSectors: [
      'Industrial Manufacturing & Electronics Assembly',
      'Automotive Component Assembly (Skoda / Tier 1 suppliers)',
      'Warehouse Management & Inventory Control',
      'CNC Machine Operators',
      'General Construction & Masonry'
    ],
    processingTime: '75 - 100 Days',
    requirements: [
      'Valid International Passport',
      'Criminal Record Check from Nigeria Police Force (Legalized)',
      'Educational / Vocational certificates',
      'Biometric photos and medical evaluation'
    ],
    contractDuration: '2 Years Employee Card (Zaměstnanecká Karta)',
    salaryRange: {
      EUR: '€1,100 - €1,900 / month',
      NGN: '₦1,750,000 - ₦3,000,000 / month'
    },
    highlights: [
      'Central Europe location with strong stable economy',
      'Combined work and residence permit in one card',
      'Company subsidized meals and accommodation packages'
    ],
    visaType: 'Long-term Visa for Employment / Employee Card'
  },
  {
    id: 'germany',
    name: 'Germany (Chancenkarte & Skilled Workers)',
    code: 'DE',
    flag: '🇩🇪',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80',
    jobSectors: [
      'IT & Software Engineering (Cloud, DevOps, Full-Stack)',
      'Healthcare, Nursing & Eldercare Assistants',
      'Mechanical, Electrical & Civil Engineers',
      'Hospitality, Chefs & Culinary Specialists',
      'Opportunity Card (Chancenkarte) Points-Based Jobseeker'
    ],
    processingTime: '60 - 90 Days',
    requirements: [
      'University Degree or Recognized Vocational Certificate',
      'English (B2) or German (A1-B1 depending on pathway)',
      'Proof of blocked account funds or confirmed employer contract',
      'Professional CV & Motivation Letter'
    ],
    contractDuration: '1 - 4 Years (Direct EU Blue Card or Work Permit)',
    salaryRange: {
      EUR: '€2,400 - €4,500 / month',
      NGN: '₦3,800,000 - ₦7,200,000 / month'
    },
    highlights: [
      'Top European economy with unmatched social welfare',
      'Opportunity Card allows 1 year legal job searching in Germany',
      'EU Blue Card holders eligible for PR in as little as 21-27 months',
      'Family reunion rights for spouse and children'
    ],
    visaType: 'Chancenkarte / National Skilled Work Visa / EU Blue Card'
  },
  {
    id: 'albania',
    name: 'Albania',
    code: 'AL',
    flag: '🇦🇱',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=900&q=80',
    jobSectors: [
      'Tourism, Resort & Hotel Staff',
      'Construction & Infrastructure Projects',
      'Textile & Garment Manufacturing',
      'Agriculture, Greenhouses & Food Logistics',
      'Security & Facility Maintenance'
    ],
    processingTime: '45 - 60 Days (Fastest in Europe)',
    requirements: [
      'Valid Passport',
      'Clean Police Report',
      'Basic CV',
      'Passport size photos',
      'Contract signed by verified Albanian employer'
    ],
    contractDuration: '1 Year Renewable Unique Permit (Work & Residence)',
    salaryRange: {
      EUR: '€650 - €1,100 / month + Room & Board',
      NGN: '₦1,000,000 - ₦1,750,000 / month'
    },
    highlights: [
      'Very fast turnaround time (45 to 60 days)',
      'Low entry barriers with high job availability',
      'Subsidized housing and food allowances provided',
      'Great stepping stone for career growth in the Mediterranean region'
    ],
    visaType: 'Type D Long-Stay Work Visa'
  },
  {
    id: 'croatia',
    name: 'Croatia (EU Schengen)',
    code: 'HR',
    flag: '🇭🇷',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80',
    jobSectors: [
      'Coastal Tourism, Bartenders & Housekeeping',
      'Construction, Masonry, Ironworkers',
      'Food Delivery & Courier Logistics',
      'Shipbuilding & Maritime Trades'
    ],
    processingTime: '75 - 90 Days',
    requirements: [
      'Passport valid for 2+ years',
      'Apostilled Police Clearance Certificate',
      'CV in European format',
      'Employer Labor Market Test approval'
    ],
    contractDuration: '1 Year Renewable (Dozvola za boravak i rad)',
    salaryRange: {
      EUR: '€900 - €1,600 / month',
      NGN: '₦1,400,000 - ₦2,500,000 / month'
    },
    highlights: [
      'Full member of Schengen Zone and Eurozone',
      'Bustling coastal tourist economy with high seasonal bonuses',
      'Company provides accommodation and visa renewal support'
    ],
    visaType: 'Stay and Work Permit (Dozvola za boravak i rad)'
  }
];

export const VISA_SERVICES_LIST: VisaServiceCountry[] = [
  {
    id: 'china',
    name: 'China',
    category: 'Both',
    flag: '🇨🇳',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80',
    processingTime: '10 - 15 Working Days',
    validity: 'Single, Double, or Multi-entry (3 - 12 Months)',
    keyServices: [
      'Canton Fair Official Invitation & Badge Registration',
      'Direct Business Partner Invitation Letter verification',
      'Document legalization & Chinese Visa Application Centre (CVASC) appointments',
      'Hotel reservation & Trade itinerary structuring',
      'Complete submission and courier pickup service'
    ],
    idealFor: 'Traders, Importers, Manufacturers, Electronics buyers, and Business Delegates.',
    estimatedCost: {
      NGN: '₦450,000 - ₦850,000 (Subject to visa category)',
      USD: '$300 - $550'
    }
  },
  {
    id: 'schengen',
    name: 'Schengen Area (France, Germany, Italy, Netherlands, Spain)',
    category: 'Both',
    flag: '🇪🇺',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80',
    processingTime: '15 - 21 Working Days',
    validity: 'Short Stay Uniform Visa (Up to 90 days stay in 180-day window)',
    keyServices: [
      'TLScontact / VFS Global Embassy appointment securing',
      'Detailed day-to-day tourist or business travel itinerary',
      'Flight reservations (Verifiable PNR) & Confirmed Hotel bookings',
      'Schengen-compliant €30,000 Travel Medical Insurance',
      'Bank statement auditing & ties-to-home-country advisory'
    ],
    idealFor: 'Tourists, Family visitors, Corporate trainees, and European trade conferences.',
    estimatedCost: {
      NGN: '₦380,000 - ₦650,000',
      USD: '$250 - $420'
    }
  },
  {
    id: 'uk-visit',
    name: 'United Kingdom (Standard Visitor Visa)',
    category: 'Both',
    flag: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
    processingTime: '3 - 6 Weeks (Priority 5-day available)',
    validity: '6 Months, 2 Years, 5 Years, or 10 Years Multiple Entry',
    keyServices: [
      'Gov.uk portal accurate form submission',
      'TLScontact Lagos / Abuja priority biometrics appointment booking',
      'Professional Cover Letter & Sponsorship letter drafting',
      'Proof of funds and source of wealth structuring',
      'Past refusal review & mitigation appeals'
    ],
    idealFor: 'Vacationers, Family visits, Medical trips, Short business negotiations.',
    estimatedCost: {
      NGN: '₦350,000 - ₦750,000',
      USD: '$230 - $480'
    }
  },
  {
    id: 'canada-visit',
    name: 'Canada (Visitor Visa / TRV)',
    category: 'Both',
    flag: '🇨🇦',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=900&q=80',
    processingTime: '4 - 8 Weeks',
    validity: 'Up to 10 Years Multiple Entry (or passport expiration)',
    keyServices: [
      'IRCC Secure Portal profile creation and questionnaire',
      'VFS Biometrics appointment arrangement',
      'Comprehensive Purpose of Travel & Financial ties narrative',
      'Dual intent review for prospective study/work candidates'
    ],
    idealFor: 'Tourism, Visiting children/family studying in Canada, Business summits.',
    estimatedCost: {
      NGN: '₦400,000 - ₦700,000',
      USD: '$260 - $450'
    }
  },
  {
    id: 'dubai-uae',
    name: 'Dubai & UAE (Tourist & Business E-Visa)',
    category: 'Both',
    flag: '🇦🇪',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    processingTime: '3 - 5 Working Days',
    validity: '30 Days or 60 Days Single / Multiple Entry',
    keyServices: [
      'Fast-track UAE immigration E-Visa processing',
      'Verified hotel voucher and Return ticket arrangement',
      'OK TO BOARD confirmation with airlines (Emirates, Air Peace, Qatar)',
      'Security clearance and document verification'
    ],
    idealFor: 'Holidaymakers, Shoppers, Real estate investors, Short business trips.',
    estimatedCost: {
      NGN: '₦280,000 - ₦450,000',
      USD: '$180 - $290'
    }
  },
  {
    id: 'usa-b1b2',
    name: 'United States (B1/B2 Visitor Visa Prep)',
    category: 'Both',
    flag: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=900&q=80',
    processingTime: 'Appointment Dependent (Prep within 5 days)',
    validity: '5 Years Multiple Entry (for Nigerian passport holders)',
    keyServices: [
      'DS-160 accurate completion and submission',
      'MRV Fee payment & Appointment calendar monitoring (Lagos / Abuja)',
      '1-on-1 Mock Interview coaching with former visa officers',
      'Strong ties & socio-economic profile presentation strategy'
    ],
    idealFor: 'Tourism, Conferences, Business meetings, Visiting relatives.',
    estimatedCost: {
      NGN: '₦350,000 - ₦600,000',
      USD: '$230 - $400'
    }
  }
];

export const HOLIDAY_PACKAGES: HolidayPackage[] = [
  {
    id: 'dubai-luxury',
    title: 'Dubai Luxury Getaway & Desert Mirage',
    destination: 'Dubai, United Arab Emirates',
    duration: '5 Nights / 6 Days',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    pricePerPerson: {
      NGN: '₦1,850,000',
      USD: '$1,200'
    },
    inclusions: [
      '5-Star Luxury Hotel Stay with daily breakfast buffet',
      'VIP 4x4 Desert Safari with Dune Bashing, Camel Ride & BBQ Dinner',
      'Burj Khalifa 124th Floor Observation Deck Tickets',
      'Luxury Marina Yacht Dhow Cruise with International Dinner',
      'Dubai Miracle Garden & Global Village Entry',
      'Private Airport Pick-up and Drop-off in luxury vehicle',
      'UAE Tourist E-Visa & Travel Insurance included'
    ],
    highlights: [
      'Iconic Burj Khalifa View',
      'Desert Glamping experience',
      'World-class shopping malls tour'
    ],
    itinerarySummary: 'Day 1: Arrival & Marina Cruise. Day 2: Modern Dubai City Tour & Burj Khalifa. Day 3: Premium Desert Safari. Day 4: Miracle Garden & Shopping. Day 5: Free Leisure Day. Day 6: Departure.',
    tag: 'Best Seller'
  },
  {
    id: 'zanzibar-paradise',
    title: 'Zanzibar All-Inclusive Beach Escape',
    destination: 'Zanzibar Island, Tanzania',
    duration: '6 Nights / 7 Days',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    pricePerPerson: {
      NGN: '₦1,650,000',
      USD: '$1,080'
    },
    inclusions: [
      '4-Star All-Inclusive Oceanfront Resort (All meals & drinks included)',
      'Stone Town Historic Walking Tour & Freddie Mercury House',
      'Spice Farm Tour with tropical fruit tasting',
      'Safari Blue Full-Day Dhow Sailing & Snorkeling at Sandbank',
      'Prison Island Giant Tortoise Sanctuary visit',
      'Sunset Dhow Cruise in Nungwi',
      'Airport & Ferry private transfers'
    ],
    highlights: [
      'Turquoise waters of Nungwi Beach',
      'Swahili cultural cuisine & seafood feast',
      'Dolphin spotting & coral reef snorkeling'
    ],
    itinerarySummary: 'Day 1: Arrive & Check-in. Day 2: Stone Town & Spice Tour. Day 3: Safari Blue Full Day. Day 4: Prison Island & Jozani Forest. Day 5: Resort Relaxation & Water Sports. Day 6: Sunset Dhow Cruise. Day 7: Farewell Zanzibar.',
    tag: 'Romantic Pick'
  },
  {
    id: 'europe-explorer',
    title: 'European Golden Triangle (Paris, Amsterdam & Brussels)',
    destination: 'France, Netherlands, Belgium',
    duration: '8 Nights / 9 Days',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    rating: 5.0,
    pricePerPerson: {
      NGN: '₦3,450,000',
      USD: '$2,250'
    },
    inclusions: [
      'Central 4-Star Hotels in Paris (3N), Amsterdam (3N), Brussels (2N)',
      'High-Speed Thalys / Eurostar International Train Tickets between cities',
      'Paris Seine River Sightseeing Cruise & Eiffel Tower Summit ticket',
      'Amsterdam Canal Cruise & Zaanse Schans Windmills Tour',
      'Grand Place & Atomium Tour in Brussels with Belgian Chocolate Tasting',
      'Comprehensive Schengen Visa Documentation & Appointment Assistance',
      'Daily Continental Breakfast & 24/7 English-speaking tour guide'
    ],
    highlights: [
      'Iconic Eiffel Tower summit view',
      'Cruising Amsterdam historic canals',
      'Belgian chocolates & medieval Bruges excursion'
    ],
    itinerarySummary: 'Days 1-3: Romantic Paris & Louvre. Days 4-6: Vibrant Amsterdam & Windmills. Days 7-8: Regal Brussels & Bruges. Day 9: Return Departure.',
    tag: 'Grand Tour'
  },
  {
    id: 'kenya-safari',
    title: 'Kenya Masai Mara Safari & Nairobi City Vibe',
    destination: 'Kenya (Nairobi & Masai Mara)',
    duration: '5 Nights / 6 Days',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    pricePerPerson: {
      NGN: '₦1,720,000',
      USD: '$1,120'
    },
    inclusions: [
      '2 Nights in Nairobi 5-Star Hotel + 3 Nights in Masai Mara Luxury Tented Camp',
      'Full-board meals (Breakfast, Lunch, Dinner) during safari',
      'Private 4x4 Land Cruiser with pop-up roof for wildlife photography',
      'Multiple Big-5 Game Drives in Masai Mara National Reserve',
      'Nairobi Giraffe Centre & Karen Blixen Museum Tour',
      'Authentic Maasai Village cultural dance experience',
      'Kenya eTA processing & park entrance fees included'
    ],
    highlights: [
      'Witness the Big Five in their natural habitat',
      'Feed endangered Rothschild Giraffes by hand',
      'Luxury glamping under the African starry sky'
    ],
    itinerarySummary: 'Day 1: Arrive Nairobi & Giraffe Centre. Day 2: Drive through Great Rift Valley to Masai Mara. Days 3-4: Full-day Big Five Safari & Maasai Village. Day 5: Morning Game Drive & return to Nairobi. Day 6: Souvenir shopping & flight home.',
    tag: 'Wildlife Adventure'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Chinedu Okeke',
    role: 'MSc Data Analytics Student',
    city: 'Enugu / Now in Birmingham, UK',
    destination: 'United Kingdom',
    type: 'Study Abroad',
    content: 'Horizon Move Limited transformed what seemed impossible into a reality. My previous agent wasted 8 months, but the Horizon team reviewed my documents, secured my CAS from Coventry University within 12 days, and coached me for the visa interview. I landed in the UK right in time for my September session!',
    avatar: chineduAvatar,
    rating: 5,
    visaApprovedDate: 'August 2026'
  },
  {
    id: 't2',
    name: 'Adewale Adeleke',
    role: 'Logistics Supervisor',
    city: 'Lagos / Now in Belgrade, Serbia',
    destination: 'Serbia',
    type: 'Work Permit',
    content: 'I was very skeptical about European work permits because of many fake agencies in Nigeria. Horizon Move provided verified employer contracts, handled my Serbian Ministry work permit, and guided me through the embassy in Abuja smoothly. Today I earn in Euros, send money home, and my accommodation is 100% paid by my employer.',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    visaApprovedDate: 'July 2026'
  },
  {
    id: 't3',
    name: 'Dr. (Mrs.) Funke Balogun',
    role: 'Healthcare Administrator & Family',
    city: 'Ibadan / Now in Toronto, Canada',
    destination: 'Canada',
    type: 'Study Abroad',
    content: 'Securing a Canadian study permit with family accompanying is notoriously hard, but Horizon Move structured our Statement of Purpose with such precision and financial evidence that we received an outright approval in 7 weeks without query. Their Anthony, Lagos office team is respectful and world-class.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    visaApprovedDate: 'June 2026'
  },
  {
    id: 't4',
    name: 'Ibrahim Danjuma',
    role: 'Electronics Importer & CEO',
    city: 'Kano & Lagos',
    destination: 'China',
    type: 'Visit Visa',
    content: 'I have traveled to Guangzhou for Canton Fair three times through Horizon Move. Their official invitation letters and fast-track appointment processing save me weeks of stress. If you need legitimate China business visas, don’t look elsewhere.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    visaApprovedDate: 'May 2026'
  },
  {
    id: 't5',
    name: 'Ngozi & Emeka Nwosu',
    role: 'Newlyweds (Honeymoon Travelers)',
    city: 'Port Harcourt, Rivers State',
    destination: 'Zanzibar',
    type: 'Holiday',
    content: 'Our Zanzibar honeymoon package was magical from start to finish! The airport pick-up was prompt, the resort was right on the beach, and the private Safari Blue dhow cruise was unforgettable. We will definitely use Horizon Move for all our family vacations.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    visaApprovedDate: 'April 2026'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    category: 'Work',
    question: 'How long does a European Work Permit (Serbia, Poland, Czech) take to process?',
    answer: 'Processing times vary depending on the destination country and labor ministry queue. Serbia typically takes 60 to 90 days, Albania takes 45 to 60 days, while Poland and Czech Republic average 75 to 120 days. Horizon Move provides continuous milestone updates at each stage: employer job offer, Ministry of Labor permit issuance, and Embassy visa stamping.'
  },
  {
    id: 'f2',
    category: 'Study',
    question: 'Can I study in the UK or Canada without taking IELTS?',
    answer: 'Yes! For the United Kingdom, many of our partner universities accept a minimum of C6 or B3 in WAEC/NECO English Language in place of IELTS, or accept an official English proficiency letter from your Nigerian university. For Canada, select colleges waive IELTS when supported by an undergraduate degree taught in English. Our counselors match you with institutions that honor your existing credentials.'
  },
  {
    id: 'f3',
    category: 'General',
    question: 'Is Horizon Move Limited a registered agency in Nigeria?',
    answer: 'Yes. Horizon Move Limited is a legally registered corporate entity with the Corporate Affairs Commission (CAC) of Nigeria (RC 9795462). We maintain our verified corporate consulting office at 4, Ayanbole Street, Anthony, Lagos, with an extensive network of accredited overseas employers, colleges, and airline partners.'
  },
  {
    id: 'f4',
    category: 'Payments',
    question: 'What are your consultation fees and payment structures?',
    answer: 'We offer an initial Free 15-Minute Profile Evaluation (Virtual or In-Office). For full end-to-end processing (Study Admissions, Work Permits, or Complex Visas), our professional service fees are transparently outlined upfront in a signed agreement. We operate on structured milestone-based installments, so you only pay as each stage of your application is achieved.'
  },
  {
    id: 'f5',
    category: 'Visa',
    question: 'Do you guarantee visa approval?',
    answer: 'While no ethical agency can issue a 100% unilateral visa guarantee since final approval rests exclusively with consular officers, Horizon Move boasts a 98.4% success rate. We achieve this by rigorously pre-screening all financial documents, conducting mock consular interviews, fixing past refusal errors, and only submitting immaculate, compliant files.'
  },
  {
    id: 'f6',
    category: 'Work',
    question: 'Is accommodation and transportation included with work permits?',
    answer: 'Yes, for most European blue-collar and logistics work permit routes (such as Serbia, Poland, and Albania), the employing company provides shared or private company accommodation, utility subsidies, and free shuttle buses between housing and work sites. Detailed perks are clearly stated in your authenticated employment offer before departure.'
  }
];

export const PARTNER_AIRLINES: PartnerAirline[] = [
  { id: 'qatar-airways', name: 'Qatar Airways', iata: 'QR', country: 'Qatar', hub: 'Doha (DOH)', alliance: 'oneworld' },
  { id: 'emirates', name: 'Emirates', iata: 'EK', country: 'United Arab Emirates', hub: 'Dubai (DXB)' },
  { id: 'british-airways', name: 'British Airways', iata: 'BA', country: 'United Kingdom', hub: 'London (LHR)', alliance: 'oneworld' },
  { id: 'air-peace', name: 'Air Peace', iata: 'P4', country: 'Nigeria', hub: 'Lagos (LOS) / London (LGW)' },
  { id: 'klm', name: 'KLM Royal Dutch', iata: 'KL', country: 'Netherlands', hub: 'Amsterdam (AMS)', alliance: 'SkyTeam' },
  { id: 'turkish-airlines', name: 'Turkish Airlines', iata: 'TK', country: 'Turkey', hub: 'Istanbul (IST)', alliance: 'Star Alliance' },
  { id: 'ethiopian-airlines', name: 'Ethiopian Airlines', iata: 'ET', country: 'Ethiopia', hub: 'Addis Ababa (ADD)', alliance: 'Star Alliance' },
  { id: 'virgin-atlantic', name: 'Virgin Atlantic', iata: 'VS', country: 'United Kingdom', hub: 'London (LHR)', alliance: 'SkyTeam' },
  { id: 'lufthansa', name: 'Lufthansa', iata: 'LH', country: 'Germany', hub: 'Frankfurt (FRA)', alliance: 'Star Alliance' },
  { id: 'air-france', name: 'Air France', iata: 'AF', country: 'France', hub: 'Paris (CDG)', alliance: 'SkyTeam' },
  { id: 'delta', name: 'Delta Air Lines', iata: 'DL', country: 'United States', hub: 'Atlanta (ATL)', alliance: 'SkyTeam' }
];

export const PARTNER_UNIVERSITIES: PartnerUniversity[] = [
  {
    id: 'coventry-university',
    name: 'Coventry University',
    shortName: 'Coventry',
    country: 'United Kingdom',
    flag: '🇬🇧',
    location: 'Coventry & London',
    badgeAccent: '#002D62',
    ranking: 'Top 30 UK University',
    popularFor: 'Business Analytics, Engineering & IT'
  },
  {
    id: 'university-of-hertfordshire',
    name: 'University of Hertfordshire',
    shortName: 'Hertfordshire',
    country: 'United Kingdom',
    flag: '🇬🇧',
    location: 'Hatfield, UK',
    badgeAccent: '#5C2D91',
    ranking: 'Top Modern University',
    popularFor: 'Computer Science, Data & Healthcare'
  },
  {
    id: 'oxford-brookes-university',
    name: 'Oxford Brookes University',
    shortName: 'Oxford Brookes',
    country: 'United Kingdom',
    flag: '🇬🇧',
    location: 'Oxford, UK',
    badgeAccent: '#8B0000',
    ranking: 'Global Top 50 Under 50',
    popularFor: 'Business & ACCA Fast Track'
  },
  {
    id: 'seneca-polytechnic',
    name: 'Seneca Polytechnic',
    shortName: 'Seneca',
    country: 'Canada',
    flag: '🇨🇦',
    location: 'Toronto, Ontario',
    badgeAccent: '#D9272E',
    ranking: 'Top Canadian Public College',
    popularFor: 'Software Dev, Project Management, PGD'
  },
  {
    id: 'vistula-university',
    name: 'Vistula University',
    shortName: 'Vistula',
    country: 'Poland (EU)',
    flag: '🇵🇱',
    location: 'Warsaw, Poland',
    badgeAccent: '#003399',
    ranking: 'Top Internationalized Uni in Poland',
    popularFor: 'Low Tuition BSc & MSc in English'
  },
  {
    id: 'tu-berlin',
    name: 'TU Berlin',
    shortName: 'TU Berlin',
    country: 'Germany (EU)',
    flag: '🇩🇪',
    location: 'Berlin, Germany',
    badgeAccent: '#C50E1F',
    ranking: 'TU9 German Excellence',
    popularFor: 'Tuition-Free Engineering & STEM'
  },
  {
    id: 'deakin-university',
    name: 'Deakin University',
    shortName: 'Deakin',
    country: 'Australia',
    flag: '🇦🇺',
    location: 'Melbourne & Geelong',
    badgeAccent: '#007A3D',
    ranking: 'World Top 1% University',
    popularFor: 'Nursing, AI, MBA & Post-Study Work'
  },
  {
    id: 'northeastern-university',
    name: 'Northeastern University',
    shortName: 'Northeastern',
    country: 'United States',
    flag: '🇺🇸',
    location: 'Boston & Silicon Valley',
    badgeAccent: '#CC0000',
    ranking: 'US Top 50 National University',
    popularFor: 'STEM OPT (3-Year Work Rights)'
  },
  {
    id: 'university-of-sunderland',
    name: 'University of Sunderland',
    shortName: 'Sunderland',
    country: 'United Kingdom',
    flag: '🇬🇧',
    location: 'Sunderland & London',
    badgeAccent: '#004B87',
    ranking: 'Affordable UK Tuition',
    popularFor: 'Nursing, Pharmacy & Project Mgmt'
  },
  {
    id: 'university-of-greenwich',
    name: 'University of Greenwich',
    shortName: 'Greenwich',
    country: 'United Kingdom',
    flag: '🇬🇧',
    location: 'London, UK',
    badgeAccent: '#0A1931',
    ranking: 'Historic London Campus',
    popularFor: 'Law, Finance & Global Supply Chain'
  },
  {
    id: 'dublin-business-school',
    name: 'Dublin Business School',
    shortName: 'DBS Dublin',
    country: 'Ireland (EU)',
    flag: '🇮🇪',
    location: 'Dublin, Ireland',
    badgeAccent: '#006644',
    ranking: '2-Year Irish Stay Back Visa',
    popularFor: 'Cloud Computing, FinTech & MBA'
  },
  {
    id: 'fanshawe-college',
    name: 'Fanshawe College',
    shortName: 'Fanshawe',
    country: 'Canada',
    flag: '🇨🇦',
    location: 'London, Ontario',
    badgeAccent: '#BA0C2F',
    ranking: 'Direct PGWP Work Permit Route',
    popularFor: 'Applied Tech, Agri-Business & Health'
  }
];

export interface RecentApprovalItem {
  id: string;
  name: string;
  origin: string;
  destination: string;
  flag: string;
  type: string;
  category: 'Study' | 'Work' | 'Visa' | 'Flight';
  badge: string;
  time: string;
}

export const RECENT_APPROVALS: RecentApprovalItem[] = [
  { id: 'app-f1', name: 'Dr. Michael A.', origin: 'Lagos', destination: 'United Kingdom', flag: '🇬🇧', type: 'British Airways Lagos (LOS) ➔ London (LHR) e-Ticket', category: 'Flight', badge: 'Ticket Issued', time: 'Just now' },
  { id: 'app-1', name: 'Tunde A.', origin: 'Lagos', destination: 'United Kingdom', flag: '🇬🇧', type: 'UK Student Visa (MSc Coventry University)', category: 'Study', badge: 'Visa Stamped', time: '5 mins ago' },
  { id: 'app-f2', name: 'Chioma B.', origin: 'Abuja', destination: 'United Arab Emirates', flag: '🇦🇪', type: 'Emirates Abuja (ABV) ➔ Dubai (DXB) Return Flight', category: 'Flight', badge: 'PNR Confirmed', time: '11 mins ago' },
  { id: 'app-2', name: 'Blessing O.', origin: 'Benin City', destination: 'Serbia', flag: '🇷🇸', type: 'Serbia 2-Year TRC Work Permit & Labor Approval', category: 'Work', badge: 'Permit Issued', time: '14 mins ago' },
  { id: 'app-f3', name: 'Olumide T.', origin: 'Lagos', destination: 'Canada', flag: '🇨🇦', type: 'Qatar Airways Lagos (LOS) ➔ Toronto (YYZ) Student Fare', category: 'Flight', badge: 'Extra 46kg Bag Stamped', time: '28 mins ago' },
  { id: 'app-3', name: 'Emeka K.', origin: 'Enugu', destination: 'Canada', flag: '🇨🇦', type: 'Canada Study Permit (Seneca Polytechnic)', category: 'Study', badge: 'Approved', time: '36 mins ago' },
  { id: 'app-4', name: 'Amina Y.', origin: 'Abuja FCT', destination: 'China', flag: '🇨🇳', type: 'China 1-Yr Multi-Entry Business Visa (Canton Fair)', category: 'Visa', badge: 'Passport Ready', time: '1 hr ago' },
  { id: 'app-f4', name: 'Ngozi A.', origin: 'Port Harcourt', destination: 'United States', flag: '🇺🇸', type: 'Delta Air Lines Lagos (LOS) ➔ Atlanta (ATL) Flight', category: 'Flight', badge: 'e-Ticket Dispatched', time: '1 hr ago' },
  { id: 'app-5', name: 'Kelechi M.', origin: 'Port Harcourt', destination: 'Poland', flag: '🇵🇱', type: 'Poland Voivodeship Type A Work Permit (Logistics)', category: 'Work', badge: 'Permit Issued', time: '2 hrs ago' },
  { id: 'app-6', name: 'Omotola D.', origin: 'Ibadan', destination: 'France', flag: '🇫🇷', type: 'Schengen 6-Month Multi-Entry Tourist Visa', category: 'Visa', badge: 'Visa Stamped', time: '3 hrs ago' },
  { id: 'app-f5', name: 'Kazeem S.', origin: 'Kano', destination: 'Saudi Arabia', flag: '🇸🇦', type: 'EgyptAir Kano (KAN) ➔ Jeddah (JED) Umrah Flight', category: 'Flight', badge: 'Confirmed PNR', time: '3 hrs ago' },
  { id: 'app-7', name: 'Chidinma E.', origin: 'Lagos', destination: 'United Kingdom', flag: '🇬🇧', type: 'UK Tier 4 Visa & Chevening Scholarship CAS', category: 'Study', badge: 'Approved', time: '4 hrs ago' },
  { id: 'app-8', name: 'Ifeanyi N.', origin: 'Asaba', destination: 'Czech Republic', flag: '🇨🇿', type: 'Czech Employee Card (Manufacturing Sector)', category: 'Work', badge: 'Contract Stamped', time: '5 hrs ago' },
  { id: 'app-9', name: 'Oluwaseun B.', origin: 'Ogun State', destination: 'Germany', flag: '🇩🇪', type: 'Germany Opportunity Card (Chancenkarte)', category: 'Work', badge: 'Embassy Approved', time: '6 hrs ago' },
  { id: 'app-10', name: 'Fatima S.', origin: 'Kano', destination: 'USA', flag: '🇺🇸', type: 'US B1/B2 5-Year Multiple Entry Visa', category: 'Visa', badge: 'Passport Dispatched', time: 'Yesterday' },
  { id: 'app-11', name: 'Osagie I.', origin: 'Benin City', destination: 'Albania', flag: '🇦🇱', type: 'Albania 1-Year Construction Work Permit', category: 'Work', badge: 'Ministry Approved', time: 'Yesterday' },
  { id: 'app-12', name: 'Ngozi U.', origin: 'Owerri', destination: 'Ireland', flag: '🇮🇪', type: 'Ireland Critical Skills Employment Permit', category: 'Work', badge: 'Work Permit Issued', time: 'Yesterday' },
  { id: 'app-13', name: 'Damilola A.', origin: 'Lagos', destination: 'Canada', flag: '🇨🇦', type: 'Canada Family Dependent Open Work Permit', category: 'Visa', badge: 'Visa Stamped', time: '2 days ago' },
  { id: 'app-14', name: 'Yusuf M.', origin: 'Kaduna', destination: 'Turkey', flag: '🇹🇷', type: 'Turkey Multiple Entry Business E-Visa', category: 'Visa', badge: 'Approved', time: '2 days ago' },
  { id: 'app-15', name: 'Chukwudi O.', origin: 'Onitsha', destination: 'Lithuania', flag: '🇱🇹', type: 'Lithuania National D Work Visa (Long-Stay)', category: 'Work', badge: 'Permit Issued', time: '3 days ago' },
  { id: 'app-16', name: 'Zainab K.', origin: 'Ilorin', destination: 'United Kingdom', flag: '🇬🇧', type: 'UK Skilled Worker Dependent Visa', category: 'Visa', badge: 'Visa Approved', time: '3 days ago' }
];

export const TEAM_MEMBERS = [
  {
    name: 'Olusegun Adeshina',
    role: 'Managing Director & Lead Strategist',
    bio: 'Over 14 years of executive leadership in international education, corporate mobility, and cross-border immigration advisory. Certified member of global educational councils.',
    image: olusegunAdeshinaImg,
    experience: '14+ Years Experience'
  },
  {
    name: 'Barrister (Mrs.) Sharon Ogechi',
    role: 'Head of Legal & Immigration Compliance',
    bio: 'Specialist in European labor law, work permit authorizations, and consular appeal strategies. Ensuring 100% legal compliance for all applicants.',
    image: sharonOgechiImg,
    experience: '11+ Years Experience'
  },
  {
    name: 'Victor Nwosu',
    role: 'Senior Academic Admissions Lead',
    bio: 'Has successfully placed over 2,200 Nigerian students into prestigious universities across UK, Canada, USA, and Europe with generous scholarships.',
    image: victorNwosuImg,
    experience: '9+ Years Experience'
  },
  {
    name: 'Fauziyah Bello',
    role: 'Head of Travel, Ticketing & Corporate Tours',
    bio: 'IATA certified ticketing manager with deep airline relationships securing best corporate airfares, customized holidays, and luxury group tours.',
    image: fauziyahBelloImg,
    experience: '8+ Years Experience'
  }
];
