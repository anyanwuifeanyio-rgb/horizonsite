/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageType, Currency, StudyCountry } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LeadPopup } from './components/LeadPopup';
import { ConsultationModal } from './components/ConsultationModal';
import { EligibilityModal } from './components/EligibilityModal';
import { ProgramDetailsModal } from './components/ProgramDetailsModal';
import { UserManualModal } from './components/UserManualModal';
import { Toast } from './components/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { StudyAbroadPage } from './pages/StudyAbroadPage';
import { WorkPermitPage } from './pages/WorkPermitPage';
import { VisaServicesPage } from './pages/VisaServicesPage';
import { TravelBookingsPage } from './pages/TravelBookingsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ApiDocumentationPage } from './pages/ApiDocumentationPage';
import { ClientPortalPage } from './pages/ClientPortalPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currency, setCurrency] = useState<Currency>('NGN');

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
      } else if (window.location.hash === '#api-docs' || window.location.hash === '#skylink-api') {
        setCurrentPage('api-docs');
      } else if (window.location.hash === '#portal' || window.location.hash === '#account' || window.location.hash === '#my-bookings') {
        setCurrentPage('client-portal');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Modals state
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationService, setConsultationService] = useState('Study Abroad (UK, Canada, Europe)');
  const [consultationCountry, setConsultationCountry] = useState('');

  const [isLeadPopupOpen, setIsLeadPopupOpen] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [eligibilityType, setEligibilityType] = useState<'work' | 'study'>('work');

  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedStudyCountry, setSelectedStudyCountry] = useState<StudyCountry | null>(null);

  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (service = 'General Profile Evaluation', country = '') => {
    setConsultationService(service);
    setConsultationCountry(country);
    setIsConsultationOpen(true);
  };

  const handleOpenEligibility = (type: 'work' | 'study') => {
    setEligibilityType(type);
    setIsEligibilityOpen(true);
  };

  const handleRequestProgramDetails = (country: StudyCountry) => {
    setSelectedStudyCountry(country);
    setIsProgramModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-800 font-sans selection:bg-[#CFAE70] selection:text-[#1B365D]">
      {/* Global Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenLeadPopup={() => setIsLeadPopupOpen(true)}
        onOpenUserManual={() => setIsUserManualOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            currency={currency}
            onOpenConsultation={() => handleOpenConsultation('General Global Opportunities Assessment')}
            onOpenEligibility={handleOpenEligibility}
            onOpenLeadPopup={() => setIsLeadPopupOpen(true)}
            onSuccessToast={showToast}
          />
        )}

        {currentPage === 'study-abroad' && (
          <StudyAbroadPage
            currency={currency}
            onRequestDetails={handleRequestProgramDetails}
            onOpenConsultation={() => handleOpenConsultation('Study Abroad Admission & Visa')}
            onOpenEligibility={handleOpenEligibility}
          />
        )}

        {currentPage === 'work-permit' && (
          <WorkPermitPage
            currency={currency}
            onOpenConsultation={() => handleOpenConsultation('European Work Permit & Employment Quota')}
            onOpenEligibility={handleOpenEligibility}
          />
        )}

        {currentPage === 'visa-services' && (
          <VisaServicesPage
            currency={currency}
            onOpenConsultation={() => handleOpenConsultation('Visit & Business Visa Dossier Support')}
            onSuccessToast={showToast}
          />
        )}

        {currentPage === 'travel-bookings' && (
          <TravelBookingsPage
            currency={currency}
            onSuccessToast={showToast}
            onOpenConsultation={() => handleOpenConsultation('Corporate Flight & Hotel Package Booking')}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about-us' && (
          <AboutPage
            onOpenConsultation={() => handleOpenConsultation('Executive Consultation & Corporate Advisory')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onSuccessToast={showToast} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'api-docs' && (
          <ApiDocumentationPage
            onNavigate={handleNavigate}
            onSuccessToast={showToast}
          />
        )}

        {currentPage === 'client-portal' && (
          <ClientPortalPage
            onNavigate={handleNavigate}
            onSuccessToast={showToast}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenUserManual={() => setIsUserManualOpen(true)}
      />

      {/* Floating Interactive WhatsApp Launcher */}
      <FloatingWhatsApp />

      {/* Website Documentation & User Manual Modal */}
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Lead Capture Popup ("Get Free Consultation for Jan 2027 Intake") */}
      <LeadPopup
        isOpen={isLeadPopupOpen}
        onClose={() => setIsLeadPopupOpen(false)}
        onSuccessToast={showToast}
      />

      {/* Universal Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        onSuccessToast={showToast}
        initialService={consultationService}
        initialCountry={consultationCountry}
      />

      {/* Interactive Eligibility Checker Modal */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        onSuccessToast={showToast}
        initialType={eligibilityType}
      />

      {/* Program Details / University Prospectus Modal */}
      <ProgramDetailsModal
        country={selectedStudyCountry}
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        onSuccessToast={showToast}
      />

      {/* Notification Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
