import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, User as UserIcon, CheckCircle, Circle, Calendar, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { countries } from '@/utils/countries';
import { schedules as allSchedules } from '@/utils/vaccinationSchedules';

const VaccinationSchemePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dependentId } = useParams();
  const navigate = useNavigate();

  const [dependent, setDependent] = useState(null);
  const [scheme, setScheme] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id && dependentId) {
      const allStoredUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const foundDependent = allStoredUsers.find(u => u.id === dependentId && u.isConvertedDependent && u.mainAccountId === user.id);

      if (foundDependent) {
        setDependent(foundDependent);
        const countryCode = countries.find(c => c.name === foundDependent.country)?.code;
        const countrySchedule = allSchedules[countryCode] || allSchedules['DEFAULT'];

        const processedScheme = countrySchedule.map(scheduledVaccine => {
          const hasVaccine = (foundDependent.vaccines || []).some(userVaccine => 
            scheduledVaccine.keywords.some(kw => userVaccine.vaccineName.toLowerCase().includes(kw.toLowerCase()))
          );
          return { ...scheduledVaccine, completed: hasVaccine };
        });
        
        setScheme(processedScheme);
      } else {
        toast({ title: t('error'), description: t('dependentNotFound'), variant: "destructive" });
        navigate('/manage-dependents');
      }
      setLoading(false);
    } else if (!user) {
        navigate('/login');
    }
  }, [user, dependentId, navigate, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-700">{t('loadingDependentData')}</p>
      </div>
    );
  }

  if (!dependent) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-700" />
            <span className="text-2xl font-bold text-blue-800">Vacun.org</span>
          </Link>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
            <Link to={`/dependent/${dependentId}/dashboard`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToDependentProfile', { name: dependent.firstName })}
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
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
                Esquema de Vacunación
              </h1>
              <p className="text-lg text-slate-600">
                Para {dependent.firstName} {dependent.lastName} ({dependent.country})
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-start space-x-4">
              <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Esta es una guía informativa basada en el esquema de vacunación estándar para {dependent.country}. No reemplaza la consulta médica. Hable siempre con un profesional de la salud para obtener recomendaciones personalizadas.
              </p>
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
              <CardTitle className="text-2xl text-blue-800">Lista de Vacunas</CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                Verifique el estado de las vacunas recomendadas para {dependent.firstName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200">
                {scheme.length > 0 ? scheme.map((vaccine) => (
                  <div key={vaccine.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      {vaccine.completed ? (
                        <CheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-7 w-7 text-slate-300 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 text-base">{vaccine.name}</p>
                        <p className="text-sm text-slate-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          Edad recomendada: {vaccine.age}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${vaccine.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {vaccine.completed ? 'Completada' : 'Pendiente'}
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-slate-500">
                    <HelpCircle className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    No se encontró un esquema de vacunación para {dependent.country}. Usando guía general.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VaccinationSchemePage;