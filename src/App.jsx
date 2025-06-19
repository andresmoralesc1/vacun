import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CertificatePage from '@/pages/CertificatePage';
import AdminPage from '@/pages/AdminPage';
import MedicalCenterPage from '@/pages/MedicalCenterPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfilePage from '@/pages/UserProfilePage';
import AddVaccinePage from '@/pages/AddVaccinePage';
import ManageDependentsPage from '@/pages/ManageDependentsPage';
import AddDependentPage from '@/pages/AddDependentPage';
import DependentDashboardPage from '@/pages/DependentDashboardPage';
import AddVaccineDependentPage from '@/pages/AddVaccineDependentPage';
import CertificateDependentPage from '@/pages/CertificateDependentPage';
import VaccinationSchemePage from '@/pages/VaccinationSchemePage';
import TermsAndConditionsPage from '@/pages/TermsAndConditionsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import HabeasDataPage from '@/pages/HabeasDataPage';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactPage from '@/pages/ContactPage';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

function AppLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100">
      <Shield className="h-16 w-16 text-blue-600 mb-4 animate-pulse" />
      <h1 className="text-2xl font-bold text-blue-800 mb-2">{t('loadingApp')}</h1>
      <p className="text-slate-600">{t('pleaseWait')}</p>
      <div className="mt-8 w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-pulse-fast" style={{ width: '100%', animation: 'progress 2s linear infinite' }}></div>
      </div>
    </div>
  );
}


function App() {
  return (
    <Suspense fallback={<AppLoadingFallback />}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen gradient-bg medical-pattern selection:bg-sky-200 selection:text-sky-900">
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/certificate" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <CertificatePage />
                    </ProtectedRoute>
                  } 
                />
                 <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <UserProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-vaccine" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <AddVaccinePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/manage-dependents" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <ManageDependentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-dependent" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <AddDependentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dependent/:dependentId/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <DependentDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dependent/:dependentId/add-vaccine" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <AddVaccineDependentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dependent/:dependentId/certificate" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <CertificateDependentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dependent/:dependentId/vaccination-scheme" 
                  element={
                    <ProtectedRoute allowedRoles={['user', 'admin', 'medical_center']}>
                      <VaccinationSchemePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/medical-center" 
                  element={
                    <ProtectedRoute allowedRoles={['medical_center', 'admin']}>
                      <MedicalCenterPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/habeas-data" element={<HabeasDataPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </div>
            <Footer />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </Suspense>
  );
}

export default App;