import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Users, UserPlus, Edit3, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const ManageDependentsPage = () => {
  const { t } = useTranslation();
  const { user, deleteDependentForUser } = useAuth();
  const navigate = useNavigate();
  const [dependentsDetails, setDependentsDetails] = useState([]);

  useEffect(() => {
    if (user && user.id) { 
      const allStoredUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const mainUserAccount = allStoredUsers.find(u => u.id === user.id);

      if (mainUserAccount && mainUserAccount.dependents) {
        const dependentUserObjects = mainUserAccount.dependents
          .map(depId => allStoredUsers.find(u => u.id === depId && u.isConvertedDependent && u.mainAccountId === user.id))
          .filter(Boolean);
        setDependentsDetails(dependentUserObjects);
      } else {
        setDependentsDetails([]);
      }
    } else {
      setDependentsDetails([]);
    }
  }, [user]);

  const handleDeleteDependent = async (dependentId) => {
    if (window.confirm(t('confirmDeleteDependentFull'))) {
      const result = await deleteDependentForUser(user.id, dependentId);
      if (result.success) {
        toast({ title: t('dependentDeletedToastTitle'), description: t('dependentDeletedToastDesc') });
        
        const allStoredUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
        const mainUserAccount = allStoredUsers.find(u => u.id === user.id);
        if (mainUserAccount && mainUserAccount.dependents) {
            const updatedDependentUserObjects = mainUserAccount.dependents
              .map(depId => allStoredUsers.find(u => u.id === depId && u.isConvertedDependent && u.mainAccountId === user.id))
              .filter(Boolean);
            setDependentsDetails(updatedDependentUserObjects);
        } else {
            setDependentsDetails([]);
        }

      } else {
        toast({ title: t('error'), description: result.error || t('couldNotDeleteDependent'), variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-700" />
            <span className="text-2xl font-bold text-blue-800">Vacun.org</span>
          </Link>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToDashboard')}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-blue-800 mb-2">{t('manageDependentsTitle')}</h1>
              <p className="text-lg text-slate-600">
                {t('manageDependentsSubtitle')}
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white self-start sm:self-center" asChild>
              <Link to="/add-dependent">
                <UserPlus className="mr-2 h-5 w-5" />
                {t('addDependentButton')}
              </Link>
            </Button>
          </div>
        </motion.div>

        {dependentsDetails.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Users className="h-20 w-20 text-slate-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-3">{t('noDependentsRegistered')}</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {t('addDependentsToManageVaccines')}
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white" size="lg" asChild>
              <Link to="/add-dependent">
                <UserPlus className="mr-2 h-5 w-5" />
                {t('addFirstDependentButton')}
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dependentsDetails.map((dependent, index) => (
              <motion.div
                key={dependent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-slate-200 h-full flex flex-col">
                  <CardHeader className="bg-slate-50 p-5 rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl text-blue-700">{dependent.firstName} {dependent.lastName}</CardTitle>
                      <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">{dependent.relationship || t('dependentRole')}</span>
                    </div>
                    <CardDescription className="text-slate-500 text-sm pt-1">ID: {dependent.documentId}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 flex-grow">
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-medium">{t('birthDateLabel')}:</span> {new Date(dependent.birthDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">{t('countryLabel')}:</span> {dependent.country}</p>
                      <p><span className="font-medium">{t('registeredVaccines')}:</span> {dependent.vaccines?.length || 0}</p>
                    </div>
                  </CardContent>
                  <div className="p-5 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                    <div className="flex flex-col sm:flex-row gap-2">
                       <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                        <Link to={`/dependent/${dependent.id}/dashboard`}>
                          <Eye className="mr-1.5 h-4 w-4" /> {t('viewProfileButton')}
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-100" asChild>
                        <Link to={`/add-dependent?edit=${dependent.id}`}>
                          <Edit3 className="mr-1.5 h-4 w-4" /> {t('editButton')}
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleDeleteDependent(dependent.id)}>
                        <Trash2 className="mr-1.5 h-4 w-4" /> {t('deleteButton')}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDependentsPage;