import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, User, Mail, Calendar, CreditCard, Phone, Save, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { countries } from '@/utils/countries';
import { useTranslation } from 'react-i18next';

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    documentId: '',
    birthDate: '',
    phone: '',
    country: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        documentId: user.documentId || '',
        birthDate: user.birthDate || '',
        phone: user.phone || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.country) {
      toast({
        title: t('validationError'),
        description: t('countryRequired'),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await updateUser({ ...user, ...formData });
      if (result.success) {
        toast({
          title: t('dataUpdatedToast'),
          description: t('dataUpdatedDescToast'),
        });
        navigate('/dashboard');
      } else {
        toast({ title: t('updateErrorToast'), description: result.error || t('updateErrorDescToast'), variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('unexpectedError'), description: t('unexpectedErrorDesc'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-700">{t('loadingProfile')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-700" />
            <span className="text-2xl font-bold text-blue-800">Vacun.org</span>
          </Link>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToDashboard')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-800 mb-3">{t('userProfileTitle')}</h1>
            <p className="text-slate-600 text-lg">{t('userProfileSubtitle')}</p>
          </div>

          <Card className="shadow-xl border-slate-300">
            <CardHeader className="bg-slate-50 p-6 rounded-t-lg">
              <CardTitle className="text-2xl text-blue-800 flex items-center">
                <User className="mr-3 h-6 w-6" />
                {t('myData')}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">{t('firstNameLabel')}</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">{t('lastNameLabel')}</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700 font-medium">{t('emailLabel')}</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled 
                         className="bg-slate-100 cursor-not-allowed"/>
                  <p className="text-xs text-slate-500 mt-1">{t('emailCannotBeChanged')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-slate-700 font-medium">{t('countryLabel')}</Label>
                    <Select name="country" onValueChange={(value) => handleSelectChange('country', value)} value={formData.country}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={t('countryPlaceholder')} /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.name}>{country.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="documentId" className="text-slate-700 font-medium">{t('documentIdLabel')}</Label>
                    <Input id="documentId" name="documentId" value={formData.documentId} onChange={handleChange} required />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="birthDate" className="text-slate-700 font-medium">{t('birthDateLabel')}</Label>
                    <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required 
                           className="block w-full appearance-none" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">{t('phoneLabel')}</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 text-base" disabled={loading}>
                  {loading ? t('saving') : <><Save className="mr-2 h-4 w-4" /> {t('saveChanges')}</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;