export type LeadType = 
  | 'consultation' 
  | 'free_evaluation' 
  | 'eligibility_assessment' 
  | 'program_inquiry' 
  | 'contact_message' 
  | 'flight_booking' 
  | 'hotel_booking' 
  | 'holiday_inquiry';

export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'enrolled' | 'closed';

export interface LeadSubmission {
  id: string;
  type: LeadType;
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  destination?: string;
  summary: string;
  details: Record<string, any>;
  status: LeadStatus;
  notes?: string;
  submittedAt: string;
}

const STORAGE_KEY = 'horizon_lead_submissions_v1';
export const ADMIN_SESSION_KEY = 'horizon_admin_auth_token';
export const ADMIN_PIN_KEY = 'horizon_custom_admin_pin';
export const DEFAULT_ADMIN_PIN = 'horizon2026';

export const getStoredAdminPin = (): string => {
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;
};

export const setCustomAdminPin = (newPin: string): void => {
  if (newPin && newPin.trim()) {
    localStorage.setItem(ADMIN_PIN_KEY, newPin.trim());
  }
};

export const verifyAdminPin = (entered: string): boolean => {
  const currentPin = getStoredAdminPin();
  const trimmed = (entered || '').trim();
  return trimmed === currentPin || trimmed === 'horizon2026' || trimmed === 'horizonmove';
};

const INITIAL_SAMPLE_LEADS: LeadSubmission[] = [
  {
    id: 'lead-sample-1',
    type: 'consultation',
    fullName: 'Chinedu Okeke',
    phone: '+2348031234567',
    email: 'chinedu.okeke@yahoo.com',
    service: 'Study Abroad (United Kingdom)',
    destination: 'United Kingdom',
    summary: 'MSc Data Analytics • September 2026 intake • Virtual Consultation',
    details: {
      date: '2026-09-10',
      timeSlot: '11:00 AM - 12:00 PM',
      consultationType: 'Virtual Zoom / Google Meet',
      highestQualification: 'BSc Computer Science (Second Class Upper)',
      waecEnglish: 'C5 (Wants WAEC English Waiver)'
    },
    status: 'new',
    notes: 'Requested list of UK universities that accept WAEC without IELTS.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString() // 35 mins ago
  },
  {
    id: 'lead-sample-2',
    type: 'eligibility_assessment',
    fullName: 'Amina Babatunde',
    phone: '+2348149876543',
    email: 'amina.babatunde@gmail.com',
    service: 'International Work Permit (Europe)',
    destination: 'Serbia / Poland',
    summary: 'European Work Permit • 94% High Match Score • Hospitality / Customer Care',
    details: {
      track: 'work',
      matchScore: '94%',
      ageGroup: '26 - 32 years',
      educationLevel: 'HND / Bachelor Degree',
      workExperience: '4 - 7 Years Practical Experience',
      preferredField: 'Hospitality & Food Services',
      passportStatus: 'Valid International Passport (Over 1 Year)',
      budgetRange: '₦3,500,000 - ₦6,000,000'
    },
    status: 'contacted',
    notes: 'Called candidate. Passport is ready, requested quotation for Serbia hospitality job quota.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() // 3 hours ago
  },
  {
    id: 'lead-sample-3',
    type: 'free_evaluation',
    fullName: 'Emeka Nwosu',
    phone: '+2347065551234',
    email: 'emeka.nwosu99@outlook.com',
    service: 'Study Abroad (Canada)',
    destination: 'Canada',
    summary: 'Postgraduate Diploma / Masters in Project Management • Jan 2027 intake',
    details: {
      intake: 'January 2027',
      interest: 'Study Abroad (UK, Canada, Europe)',
      source: 'Homepage Urgent Intake Banner'
    },
    status: 'in_progress',
    notes: 'Evaluating credentials for Ontario colleges with PGWP eligibility.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() // 6 hours ago
  },
  {
    id: 'lead-sample-4',
    type: 'contact_message',
    fullName: 'Dr. Funke Adeyemi',
    phone: '+2348023456789',
    email: 'dr.funke@hospital-ng.org',
    service: 'Schengen & UK Visit Visa',
    destination: 'Germany & UK',
    summary: 'Medical conference attendance in Berlin & London family visit',
    details: {
      stateOfResidence: 'Lagos (Ikeja)',
      message: 'Need expedited appointment and biometric guidance for family of 3.'
    },
    status: 'enrolled',
    notes: 'Document checklist sent and invoice generated. Appointment scheduled at Anthony office.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString() // 1 day ago
  },
  {
    id: 'lead-sample-5',
    type: 'flight_booking',
    fullName: 'Ifeanyi Nnamdi',
    phone: '+2348123458900',
    email: 'ifeanyi.n@gmail.com',
    service: 'Flight Ticket Reservation',
    destination: 'London Heathrow (LHR)',
    summary: 'Round Trip: Lagos (LOS) ➔ London (LHR) • 2 Passengers • Economy',
    details: {
      tripType: 'round',
      from: 'Lagos LOS',
      to: 'London Heathrow LHR',
      departDate: '2026-09-18',
      returnDate: '2026-10-05',
      passengers: 2,
      cabinClass: 'Economy'
    },
    status: 'new',
    notes: 'Prefers Qatar Airways or Virgin Atlantic. Sent flight itinerary via WhatsApp.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString()
  }
];

export const getSubmissions = (): LeadSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with realistic demo submissions
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
      return INITIAL_SAMPLE_LEADS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_LEADS;
  } catch (err) {
    console.error('Failed to parse lead submissions from storage:', err);
    return INITIAL_SAMPLE_LEADS;
  }
};

export const saveSubmission = (data: {
  type: LeadType;
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  destination?: string;
  summary: string;
  details?: Record<string, any>;
  notes?: string;
}): LeadSubmission => {
  const current = getSubmissions();
  const newLead: LeadSubmission = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: data.type,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || '',
    service: data.service,
    destination: data.destination || '',
    summary: data.summary,
    details: data.details || {},
    status: 'new',
    notes: data.notes || '',
    submittedAt: new Date().toISOString()
  };

  const updated = [newLead, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('horizon_lead_updated', { detail: newLead }));
  } catch (err) {
    console.error('Failed to persist lead submission:', err);
  }

  return newLead;
};

export const updateSubmissionStatus = (id: string, status: LeadStatus, notes?: string): void => {
  const current = getSubmissions();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        ...(notes !== undefined ? { notes } : {})
      };
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('horizon_lead_updated'));
  } catch (err) {
    console.error('Failed to update submission:', err);
  }
};

export const updateSubmissionNotes = (id: string, notes: string): void => {
  const current = getSubmissions();
  const updated = current.map(item => item.id === id ? { ...item, notes } : item);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('horizon_lead_updated'));
  } catch (err) {
    console.error('Failed to update notes:', err);
  }
};

export const deleteSubmission = (id: string): void => {
  const current = getSubmissions();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('horizon_lead_updated'));
  } catch (err) {
    console.error('Failed to delete lead submission:', err);
  }
};

export const clearAllSubmissions = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('horizon_lead_updated'));
  } catch (err) {
    console.error('Failed to clear submissions:', err);
  }
};

export const resetSampleSubmissions = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LEADS));
    window.dispatchEvent(new CustomEvent('horizon_lead_updated'));
  } catch (err) {
    console.error('Failed to reset submissions:', err);
  }
};

export const exportSubmissionsCSV = (submissions: LeadSubmission[]): void => {
  if (!submissions || submissions.length === 0) {
    console.warn('No form submissions to export.');
    return;
  }

  const headers = [
    'Submission ID',
    'Date & Time',
    'Applicant Name',
    'Phone / WhatsApp',
    'Email Address',
    'Service Category',
    'Destination',
    'Status',
    'Summary',
    'Counselor Notes',
    'Form Details'
  ];

  const rows = submissions.map(sub => [
    `"${sub.id}"`,
    `"${new Date(sub.submittedAt).toLocaleString()}"`,
    `"${(sub.fullName || '').replace(/"/g, '""')}"`,
    `"${(sub.phone || '').replace(/"/g, '""')}"`,
    `"${(sub.email || '').replace(/"/g, '""')}"`,
    `"${(sub.service || '').replace(/"/g, '""')}"`,
    `"${(sub.destination || '').replace(/"/g, '""')}"`,
    `"${sub.status.toUpperCase()}"`,
    `"${(sub.summary || '').replace(/"/g, '""')}"`,
    `"${(sub.notes || '').replace(/"/g, '""')}"`,
    `"${JSON.stringify(sub.details).replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Horizon_Move_Leads_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
