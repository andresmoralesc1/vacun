import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, User as UserIcon, Syringe, Plus, Download, Edit3, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { generateCertificatePDF } from '@/utils/pdfGenerator';
import { useTranslation } from 'react-i18next';

const getAgeInYears = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const DependentDashboardPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { dependentId } = useParams();
  const navigate = useNavigate();

  const [dependent, setDependent] = useState(null);
  const [dependentVaccines, setDependentVaccines] = useState([]);
  const [showSchemeButton, setShowSchemeButton] = useState(false);

  useEffect(() => {
    if (user && user.id && dependentId) {
      const allStoredUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const foundDependent = allStoredUsers.find(u => u.id === dependentId && u.isConvertedDependent && u.mainAccountId === user.id);
      
      if (foundDependent) {
        setDependent(foundDependent);
        setDependentVaccines(foundDependent.vaccines || []);
        const age = getAgeInYears(foundDependent.birthDate);
        if (age !== null && age < 18) {
          setShowSchemeButton(true);
        } else {
          setShowSchemeButton(false);
        }
      } else {
        toast({ title: t('error'), description: t('dependentNotFound'), variant: "destructive" });
        navigate('/manage-dependents');
      }
    }
  }, [user, dependentId, navigate, t]);

  const handleGenerateCertificate = async () => {
    if (!dependent || dependentVaccines.length === 0) {
      toast({
        title: t('error'),
        description: t('noVaccinesToCertifyOther', { name: dependent?.firstName || 'El familiar' }),
        variant: "destructive",
      });
      return;
    }

    try {
      const certificateData = {
        patientName: `${dependent.firstName} ${dependent.lastName}`,
        documentId: dependent.documentId,
        birthDate: dependent.birthDate,
        country: dependent.country,
        vaccines: dependentVaccines,
        issueDate: new Date().toISOString(),
        qrCode: `https://vacun.org/verify/dependent/${dependent.id}-${Date.now()}`,
        lang: i18n.language,
        t,
      };
      
      await generateCertificatePDF(certificateData);
      toast({
        title: t('certificateGenerated'),
        description: t('certificateGeneratedDesc', { name: dependent.firstName }),
      });
    } catch (error) {
      toast({
        title: t('errorGeneratingCertificate'),
        description: error.message || t('errorGeneratingCertificateDesc'),
        variant: "destructive",
      });
    }
  };

  if (!dependent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-700">{t('loadingDependentData')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-700" />
            <span className="text-2xl font-bold text-blue-800">Vacun.org</span>
          </Link>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
            <Link to="/manage-dependents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToManageDependents')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center space-x-3 mb-2">
            <UserIcon className="h-10 w-10 text-blue-700" />
            <h1 className="text-4xl font-bold text-blue-800">
              {t('dependentFirstName', { name: dependent.firstName })} {dependent.lastName}
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            {t('dependentSubtitle', { relationship: dependent.relationship || 'other' })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Card className="shadow-xl border-slate-200">
            <CardHeader className="bg-slate-50 p-6 rounded-t-lg">
              <CardTitle className="text-2xl text-blue-800">{t('actionsForDependent', { name: dependent.firstName })}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-base" asChild>
                <Link to={`/dependent/${dependentId}/add-vaccine`}>
                  <Plus className="mr-2 h-5 w-5" />
                  {t('addVaccineButton')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-base" onClick={handleGenerateCertificate} disabled={dependentVaccines.length === 0}>
                <Download className="mr-2 h-5 w-5" />
                {t('downloadMyCertificate')}
              </Button>
              <Button size="lg" variant="outline" className="border-slate-400 text-slate-700 hover:bg-slate-100 py-3 text-base" asChild>
                <Link to={`/add-dependent?edit=${dependentId}`}>
                  <Edit3 className="mr-2 h-5 w-5" />
                  {t('editDependentData')}
                </Link>
              </Button>
               {showSchemeButton && (
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white py-3 text-base sm:col-span-2 lg:col-span-3" asChild>
                  <Link to={`/dependent/${dependentId}/vaccination-scheme`}>
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Ver Esquema de Vacunación
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-slate-200">
            <CardHeader className="bg-slate-50 p-6 rounded-t-lg">
              <CardTitle className="text-2xl text-blue-800">{t('dependentVaccinesTitle', { name: dependent.firstName })}</CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                {t('dependentVaccinesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {dependentVaccines.length === 0 ? (
                <div className="text-center py-10">
                  <Syringe className="h-16 w-16 text-slate-300 mx-auto mb-5" />
                  <p className="text-slate-600 mb-5 text-lg">
                    {t('noVaccinesForDependent', { name: dependent.firstName })}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link to={`/dependent/${dependentId}/add-vaccine`}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('addFirstVaccineForDependent')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dependentVaccines.map((vaccine) => (
                    <div
                      key={vaccine.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
                    >
                      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Syringe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-800 text-lg">
                            {vaccine.vaccineName} <span className="text-base font-normal text-slate-600">{t('vaccineDose', { dose: vaccine.dose })}</span>
                          </p>
                          <p className="text-sm text-slate-500">
                            {t('vaccinationDateLabel')}: {new Date(vaccine.vaccinationDate).toLocaleDateString()}
                            {vaccine.vaccineLot && ` | ${t('vaccineLotLabel')}: ${vaccine.vaccineLot}`}
                          </p>
                          {vaccine.vaccinationPlace && <p className="text-xs text-slate-500">{t('vaccinationPlaceLabel')}: {vaccine.vaccinationPlace}</p>}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100 self-start sm:self-center" asChild>
                        <Link to={`/dependent/${dependentId}/add-vaccine?edit=${vaccine.id}`}>
                          <Edit3 className="mr-1 h-4 w-4" /> {t('editButton')}
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DependentDashboardPage;