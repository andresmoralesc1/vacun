import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, User, Calendar, CreditCard, Globe, Save, UserPlus, Users as RelationshipIcon, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { countries } from '@/utils/countries';
import { useTranslation } from 'react-i18next';

const AddDependentPage = () => {
  const { t } = useTranslation();
  const { user, addDependentToUser, updateDependentForUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dependentIdToEdit = searchParams.get('edit');

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const initialFormData = {
    firstName: '',
    lastName: '',
    relationship: '', 
    documentId: '',
    birthDate: '',
    country: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (dependentIdToEdit && user) {
      const allStoredUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const dependentUser = allStoredUsers.find(u => u.id === dependentIdToEdit && u.mainAccountId === user.id);
      
      if (dependentUser) {
        setFormData({
          firstName: dependentUser.firstName || '',
          lastName: dependentUser.lastName || '',
          relationship: dependentUser.relationship || '', 
          documentId: dependentUser.documentId || '',
          birthDate: dependentUser.birthDate || '',
          country: dependentUser.country || '',
        });
        setIsEditing(true);
      } else {
        toast({ title: t('error'), description: t('dependentNotFoundToEdit'), variant: "destructive" });
        navigate('/manage-dependents');
      }
    } else {
      setIsEditing(false);
      setFormData(initialFormData);
      setTempPassword('');
    }
  }, [dependentIdToEdit, user, navigate, t]);


  const relationships = [
    t('relationshipSonDaughter'), t('relationshipSpouse'), t('relationshipParent'), t('relationshipSibling'), t('relationshipOtherFamily')
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTempPassword('');

    if (!formData.firstName || !formData.lastName || !formData.relationship || !formData.documentId || !formData.birthDate || !formData.country) {
      toast({
        title: t('incompleteFieldsToast'),
        description: t('completeAllFieldsToast'),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isEditing) {
        result = await updateDependentForUser(user.id, dependentIdToEdit, formData);
      } else {
        result = await addDependentToUser(user.id, formData);
        if (result.success && result.tempPassword) {
          setTempPassword(result.tempPassword);
        }
      }
      
      if (result.success) {
        toast({
          title: t(isEditing ? 'dependentUpdatedToastTitle' : 'dependentAddedToastTitle'),
          description: t(isEditing ? 'dependentUpdatedToastDesc' : 'dependentAddedToastDesc', { name: `${formData.firstName} ${formData.lastName}` }),
        });
        if (!isEditing && result.tempPassword) {
          
        } else {
          navigate('/manage-dependents');
        }
      } else {
        toast({ title: t('error'), description: result.error || t(isEditing ? 'couldNotUpdateDependent' : 'couldNotAddDependent'), variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('unexpectedError'), description: t('unexpectedErrorDesc'), variant: "destructive" });
    } finally {
      setLoading(false);
      if (isEditing) navigate('/manage-dependents');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-blue-700" />
            <span className="text-xl sm:text-2xl font-bold text-blue-800">Vacun.org</span>
          </Link>
          <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm" asChild>
            <Link to="/manage-dependents">
              <ArrowLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {t('backToDependents')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-2 sm:mb-3">
              {isEditing ? t('editDependentDataTitle') : t('addNewDependentTitle')}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              {isEditing ? t('updateDependentInfo') : t('registerDependentInfo')}
            </p>
          </div>

          <Card className="shadow-xl border-slate-200 bg-white rounded-xl">
            <CardHeader className="bg-slate-50 p-5 sm:p-6 rounded-t-xl">
              <CardTitle className="text-xl sm:text-2xl text-blue-800 flex items-center">
                <UserPlus className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                {t('dependentData')}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-5 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium flex items-center text-sm sm:text-base"><User className="w-4 h-4 mr-2 text-slate-400"/>{t('firstNameLabel')}</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="h-10 sm:h-11 text-sm sm:text-base"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium flex items-center text-sm sm:text-base"><User className="w-4 h-4 mr-2 text-slate-400"/>{t('lastNameLabel')}</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="h-10 sm:h-11 text-sm sm:text-base"/>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="relationship" className="text-slate-700 font-medium flex items-center text-sm sm:text-base"><RelationshipIcon className="w-4 h-4 mr-2 text-slate-400"/>{t('relationshipLabel')}</Label>
                  <Select name="relationship" onValueChange={(value) => handleSelectChange('relationship', value)} value={formData.relationship}>
                    <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base"><SelectValue placeholder={t('selectRelationshipPlaceholder')} /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {relationships.map(rel => (
                        <SelectItem key={rel} value={rel} className="text-sm sm:text-base">{rel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                   <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-slate-700 font-medium flex items-center text-sm sm:text-base"><Globe className="w-4 h-4 mr-2 text-slate-400"/>{t('countryLabel')}</Label>
                    <Select name="country" onValueChange={(value) => handleSelectChange('country', value)} value={formData.country}>
                      <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base"><SelectValue placeholder={t('countryPlaceholder')} /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.name} className="text-sm sm:text-base">{country.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="documentId" className="text-slate-700 font-medium flex items-center text-sm sm:text-base"><CreditCard className="w-4 h-4 mr-2 text-slate-400"/>{t('documentIdLabel')}</Label>
                    <Input id="documentId" name="documentId" value={formData.documentId} onChange={handleChange} required className="h-10 sm:h-11 text-sm sm:text-base"/>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="birthDate" className="text-slate-700 font-medium flex items-center text-sm sm:text-base"><Calendar className="w-4 h-4 mr-2 text-slate-400"/>{t('birthDateLabel')}</Label>
                  <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required className="h-10 sm:h-11 text-sm sm:text-base"/>
                </div>
                
                {!isEditing && tempPassword && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"
                  >
                    <Key className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold text-sm">{t('dependentAccountCreated')}</p>
                    <p className="text-green-700 text-xs">{t('dependentLoginInfo')}</p>
                    <p className="text-green-700 text-xs mt-1">
                      {t('loginIdentifierLabel')}: <span className="font-bold">{formData.documentId}</span> ({t('orEmail')}: {formData.documentId}@vacun.org)
                    </p>
                    <p className="text-green-700 text-xs">
                      {t('temporaryPasswordLabel')}: <span className="font-bold">{tempPassword}</span>
                    </p>
                    <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700" onClick={() => navigate('/manage-dependents')}>
                      {t('goToDependentsList')}
                    </Button>
                  </motion.div>
                )}

                {!tempPassword && (
                  <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 sm:py-3 text-sm sm:text-base h-10 sm:h-11" disabled={loading}>
                    {loading ? (isEditing ? t('updating') : t('adding')) : 
                      (isEditing ? <><Save className="mr-2 h-4 w-4" /> {t('saveChanges')}</> : <><UserPlus className="mr-2 h-4 w-4" /> {t('saveDependent')}</>)}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AddDependentPage;