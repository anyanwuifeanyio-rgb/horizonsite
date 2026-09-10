import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Sparkles, 
  HelpCircle,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { PRIMARY_PHONE, EMAIL_ADDRESS, ADMISSIONS_EMAIL, WEBSITE_DOMAIN, createWhatsAppUrl, OFFICE_ADDRESS_FULL, FACEBOOK_URL, INSTAGRAM_URL, RC_NUMBER } from '../utils/whatsapp';
import { saveSubmission } from '../utils/submissions';

interface ContactPageProps {
  onSuccessToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onSuccessToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Study Abroad (UK, Canada, Europe)',
    stateOfResidence: 'Lagos',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Save lead submission to Admin Leads Hub
    saveSubmission({
      type: 'contact_message',
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      summary: `${formData.service} • Resident in ${formData.stateOfResidence} • Message: "${(formData.message || 'Consultation inquiry').slice(0, 70)}..."`,
      details: {
        service: formData.service,
        stateOfResidence: formData.stateOfResidence,
        message: formData.message || 'I would like to speak with a counselor.'
      },
      notes: formData.message || 'General contact inquiry'
    });

    const waMsg = `*GENERAL INQUIRY / CONTACT FORM - HORIZON MOVE*
---------------------------------------
*Name:* ${formData.name}
*Phone / WhatsApp:* ${formData.phone}
*Email:* ${formData.email}
*Service:* ${formData.service}
*State of Residence:* ${formData.stateOfResidence}
*Message:* ${formData.message || 'I would like to speak with a counselor.'}
---------------------------------------
_Sent via Horizon Move Official Contact Portal._`;

    setSubmitted(true);
    onSuccessToast('Your message has been received! Opening WhatsApp to connect with our live helpdesk.');

    setTimeout(() => {
      window.open(createWhatsAppUrl(waMsg), '_blank');
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Study Abroad (UK, Canada, Europe)',
        stateOfResidence: 'Lagos',
        message: ''
      });
    }, 1200);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0d1b30] text-white py-12 sm:py-24 rounded-2xl sm:rounded-3xl mx-2 sm:mx-8 px-4 sm:px-12 border-2 border-[#CFAE70]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
            alt="Horizon Move Corporate Consultation Office"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b30] via-[#0d1b30]/90 to-[#1B365D]/80" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#CFAE70]/20 border border-[#CFAE70]/40 text-[#F3E5AB] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5 text-[#CFAE70] shrink-0" />
            <span className="truncate">24/7 CLIENT ADVOCACY & INQUIRY HELPDESK</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold font-serif-luxury tracking-tight leading-tight">
            Contact Horizon Move Limited
          </h1>

          <p className="text-base sm:text-2xl text-[#E4C88E] font-medium font-serif-luxury">
            Let's Discuss Your Study, Work, and Travel Ambitions
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Visit our corporate consultation suites at 4, Ayanbole Street, Anthony, Lagos, or connect with our specialized case managers via WhatsApp, phone, and secure email.
          </p>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS & INTERACTIVE FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office Details & Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
                DIRECT TOUCHPOINTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] font-serif-luxury">
                Reach Our Corporate Office
              </h2>
            </div>

            {/* Anthony Corporate HQ */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#B8934C] uppercase">Headquarters • RC {RC_NUMBER}</span>
                  <h3 className="text-base font-bold text-[#1B365D]">Anthony Corporate Office</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B8934C] shrink-0 mt-0.5" />
                <span>{OFFICE_ADDRESS_FULL}</span>
              </p>
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                <p>📞 Phone: <strong>{PRIMARY_PHONE}</strong></p>
                <p>💬 WhatsApp: <strong>{PRIMARY_PHONE}</strong></p>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B365D] text-[#CFAE70] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#B8934C] uppercase">Verified Channels</span>
                  <h3 className="text-base font-bold text-[#1B365D]">Social Media Handles</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Connect directly with our social support desk and receive live visa advisories:
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-[#1877F2]/10 border border-slate-200 hover:border-[#1877F2] text-slate-700 transition-all font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-[#1877F2]">f</span>
                    Facebook Page
                  </span>
                  <span className="text-slate-400 text-[11px]">web.facebook.com/horizonmove</span>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-[#E4405F]/10 border border-slate-200 hover:border-[#E4405F] text-slate-700 transition-all font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-[#E4405F]">📸</span>
                    Instagram
                  </span>
                  <span className="text-slate-400 text-[11px]">@horizonmoveltd</span>
                </a>
              </div>
            </div>

            {/* Electronic & Hours */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#B8934C]" />
                <span><strong>Official Website:</strong> {WEBSITE_DOMAIN}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8934C]" />
                <span><strong>General Email:</strong> {EMAIL_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8934C]" />
                <span><strong>Admissions:</strong> {ADMISSIONS_EMAIL}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B8934C]" />
                <span><strong>Office Hours:</strong> Mon - Fri: 8:30am - 6pm | Sat: 10am - 3pm</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-white rounded-3xl p-6 sm:p-10 border-2 border-[#CFAE70]/40 shadow-2xl space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1B365D] font-serif-luxury">
                  Send Us an Official Message
                </h3>
                <p className="text-xs text-slate-500">
                  Fill out this form to receive a prompt email response and immediate WhatsApp verification from our intake team.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold text-white">Message Dispatched!</h4>
                  <p className="text-xs text-slate-300">
                    Opening WhatsApp to connect you with our live helpdesk...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Oluwaseun Adeleke"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 07075624318 or +234 707 562 4318"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="oluwaseun@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        State of Residence in Nigeria
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos, Abuja, Port Harcourt, Enugu"
                        value={formData.stateOfResidence}
                        onChange={(e) => setFormData({ ...formData, stateOfResidence: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Service Interested In *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Study Abroad (UK, Canada, Europe, USA)">Study Abroad (UK, Canada, Europe, USA)</option>
                      <option value="Work Permit (Serbia, Poland, Czech, Germany, Albania)">Work Permit (Serbia, Poland, Czech, Germany, Albania)</option>
                      <option value="China Canton Fair / Business Visa">China Canton Fair / Business Visa</option>
                      <option value="Schengen / UK / USA Visit Visa">Schengen / UK / USA Visit Visa</option>
                      <option value="Flight Tickets & Hotel Booking">Flight Tickets & Hotel Booking</option>
                      <option value="Holiday Vacation Package">Holiday Vacation Package</option>
                      <option value="Other Consultation">Other Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Message or Specific Inquiry Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Please describe your background, timeline, or specific questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#CFAE70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="gold-shimmer-btn w-full bg-gradient-to-r from-[#CFAE70] to-[#A98745] text-[#1B365D] font-extrabold py-3.5 rounded-xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry & Connect on WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. GOOGLE MAP EMBED / VISUAL COMPONENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B8934C]">
            MAP & NAVIGATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B365D] font-serif-luxury">
            Locate Our Corporate Office
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {OFFICE_ADDRESS_FULL}
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border-2 border-[#CFAE70]/30 shadow-2xl h-80 sm:h-96 relative bg-slate-900">
          <iframe
            title="Horizon Move Limited Anthony Lagos Location"
            src="https://maps.google.com/maps?q=Anthony+Village+Lagos+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute bottom-4 left-4 bg-[#1B365D]/95 text-white p-3.5 rounded-2xl border border-[#CFAE70]/40 shadow-xl backdrop-blur-md text-xs max-w-xs pointer-events-none">
            <span className="text-[#E4C88E] font-bold block">HORIZON MOVE LIMITED HQ • RC {RC_NUMBER}</span>
            <span>4, Ayanbole Street, Anthony, Lagos, Nigeria</span>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION: 5+ COMMON QUESTIONS */}
      <section className="bg-navy-pattern py-16 sm:py-24 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E4C88E]">
              TRANSPARENCY & CLARITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-300">
              Clear answers regarding processing timelines, fees, embassy procedures, and requirements.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="glass-navy rounded-2xl border border-[#CFAE70]/30 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-serif-luxury">
                      {faq.question}
                    </span>
                    <div className="p-1 rounded-full bg-white/10 text-[#CFAE70] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
