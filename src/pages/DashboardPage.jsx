import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, Plus, Download, LogOut, Settings, User as UserIcon, Edit3, Syringe, Users, ChevronRight, Hotel as Hospital, FileArchive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { generateCertificatePDF } from '@/utils/pdfGenerator';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userVaccines, setUserVaccines] = useState([]);
  const [dependentsCount, setDependentsCount] = useState(0);

  useEffect(() => {
    if (user) {
      setUserVaccines(user.vaccines || []);
      
      const allStoredUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const mainUserAccount = allStoredUsers.find(u => u.id === user.id);
      if (mainUserAccount && mainUserAccount.dependents) {
        const actualDependents = mainUserAccount.dependents
          .map(depId => allStoredUsers.find(u => u.id === depId && u.isConvertedDependent && u.mainAccountId === user.id))
          .filter(Boolean);
        setDependentsCount(actualDependents.length);
      } else {
        setDependentsCount(0);
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGenerateCertificate = async (targetUser = user, isDependent = false) => {
    const vaccinesToCertify = isDependent ? targetUser.vaccines : userVaccines;

    if (!targetUser || !vaccinesToCertify || vaccinesToCertify.length === 0) {
      toast({
        title: t('error'),
        description: t(isDependent ? 'noVaccinesToCertifyOther' : 'noVaccinesToCertifySelf', { name: targetUser.firstName }),
        variant: "destructive",
      });
      return;
    }

    try {
      const certificateData = {
        patientName: `${targetUser.firstName} ${targetUser.lastName}`,
        documentId: targetUser.documentId,
        birthDate: targetUser.birthDate,
        country: targetUser.country,
        vaccines: vaccinesToCertify,
        issueDate: new Date().toISOString(),
        qrCode: `https://vacun.org/verify/${targetUser.id}-${Date.now()}`, 
        lang: i18n.language,
        t, 
      };
      
      await generateCertificatePDF(certificateData);

      toast({
        title: t('certificateGenerated'),
        description: t('certificateGeneratedDesc', { name: targetUser.firstName }),
      });
    } catch (error) {
      toast({
        title: t('errorGeneratingCertificate'),
        description: error.message || t('errorGeneratingCertificateDesc'),
        variant: "destructive",
      });
    }
  };


  const stats = [
    {
      title: t('myVaccines'),
      value: userVaccines.length,
      icon: Syringe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: t('registeredDependents'),
      value: dependentsCount,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-blue-700" />
            <span className="text-xl sm:text-2xl font-bold text-blue-800">Vacun.org</span>
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            <div className="hidden sm:flex items-center space-x-2 text-slate-700">
              <UserIcon className="h-5 w-5" />
              <span className="font-medium text-sm">{user?.firstName} {user?.lastName}</span>
            </div>
            
            {user?.role === 'admin' && (
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm" asChild>
                <Link to="/admin">
                  <Settings className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {t('adminPanel')}
                </Link>
              </Button>
            )}
             {user?.role === 'medical_center' && (
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50 text-xs sm:text-sm" asChild>
                <Link to="/medical-center">
                  <Hospital className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {t('medicalCenterPanelButton')}
                </Link>
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm" onClick={handleLogout}>
              <LogOut className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-1 sm:mb-2">
            {t('dashboardWelcome', { name: user?.firstName })}
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            {t('dashboardManage')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`shadow-lg border ${stat.borderColor} ${stat.bgColor} rounded-xl`}>
                <CardContent className="p-5 sm:p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-700 mb-0.5 sm:mb-1">{stat.title}</p>
                    <p className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${stat.color}`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-10"
        >
          <Card className="shadow-xl border-slate-200 bg-white rounded-xl">
            <CardHeader className="bg-slate-50 p-5 sm:p-6 rounded-t-xl">
              <CardTitle className="text-xl sm:text-2xl text-blue-800">{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm sm:text-base w-full justify-start" asChild>
                <Link to="/add-vaccine">
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('addMyVaccine')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-sm sm:text-base w-full justify-start" onClick={() => handleGenerateCertificate()} disabled={userVaccines.length === 0}>
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t('downloadMyCertificate')}
              </Button>
              <Button size="lg" variant="outline" className="border-slate-400 text-slate-700 hover:bg-slate-100 py-3 text-sm sm:text-base w-full justify-start" asChild>
                <Link to="/profile">
                  <Edit3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('editMyData')}
                </Link>
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white py-3 text-sm sm:text-base w-full justify-start sm:col-span-2 lg:col-span-1" asChild>
                <Link to="/manage-dependents">
                  <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('manageDependents')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-xl border-slate-200 bg-white rounded-xl">
            <CardHeader className="bg-slate-50 p-5 sm:p-6 rounded-t-xl">
              <CardTitle className="text-xl sm:text-2xl text-blue-800">{t('myRegisteredVaccines')}</CardTitle>
              <CardDescription className="text-slate-600 mt-1 text-sm sm:text-base">
                {t('myRegisteredVaccinesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              {userVaccines.length === 0 ? (
                <div className="text-center py-8 sm:py-10">
                  <Syringe className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4 sm:mb-5" />
                  <p className="text-slate-600 mb-4 sm:mb-5 text-base sm:text-lg">
                    {t('noVaccinesAddedYetSelf')}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base" asChild>
                    <Link to="/add-vaccine">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('addMyFirstVaccine')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {userVaccines.map((vaccine) => (
                    <div
                      key={vaccine.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0 flex-grow">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                          <Syringe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-blue-800 text-base sm:text-lg leading-tight">
                            {vaccine.vaccineName} <span className="text-sm sm:text-base font-normal text-slate-600">{t('vaccineDose', { dose: vaccine.dose })}</span>
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500">
                            {t('vaccinationDateLabel')}: {new Date(vaccine.vaccinationDate).toLocaleDateString()}
                            {vaccine.vaccineLot && ` | ${t('vaccineLotLabel')}: ${vaccine.vaccineLot}`}
                          </p>
                          {vaccine.vaccinationPlace && <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-sm">{t('vaccinationPlaceLabel')}: {vaccine.vaccinationPlace}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        {vaccine.vaccineProofUrl && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-sky-300 text-sky-600 hover:bg-sky-50 text-xs sm:text-sm whitespace-nowrap"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = vaccine.vaccineProofUrl;
                              link.download = vaccine.vaccineProofUrl.split('/').pop() || 'vaccine_proof';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              toast({title: "Descarga Iniciada", description: "El archivo de prueba se está descargando."})
                            }}
                          >
                            <FileArchive className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('vaccineProofFile')}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm whitespace-nowrap" asChild>
                          <Link to={`/add-vaccine?edit=${vaccine.id}`}>
                            <Edit3 className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('editButton')}
                          </Link>
                        </Button>
                      </div>
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

export default DashboardPage;