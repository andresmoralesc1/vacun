import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-blue-700" />
          <span className="text-xl sm:text-2xl font-bold text-blue-800">Vacun.org</span>
          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">{t('roleAdmin').toUpperCase()}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('backToDashboard')}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;