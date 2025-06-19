import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Calendar, CreditCard, ArrowLeft, Globe, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { countries } from '@/utils/countries';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    documentId: '',
    birthDate: '',
    phone: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('validationError'),
        description: t('passwordsDoNotMatch'),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('validationError'),
        description: t('passwordTooShort'),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
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
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        toast({
          title: t('registrationSuccess'),
          description: t('registrationSuccessDesc'),
        });
        navigate('/dashboard');
      } else {
        toast({
          title: t('registrationError'),
          description: result.error || t('registrationErrorDesc'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('unexpectedError'),
        description: t('unexpectedErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-md rounded-xl">
          <CardHeader className="text-center pt-8 pb-6">
            <div className="flex justify-center items-center mb-4">
              <Link to="/" className="inline-block">
                <Shield className="h-12 w-12 text-blue-600 mx-auto" />
              </Link>
            </div>
            <CardTitle className="text-3xl font-bold text-blue-800">
              {t('registerTitle')}
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              {t('registerSubtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-slate-700 font-medium flex items-center"><User className="w-4 h-4 mr-2 text-slate-400"/>{t('firstNameLabel')}</Label>
                  <Input id="firstName" name="firstName" placeholder={t('firstNamePlaceholder')} value={formData.firstName} onChange={handleChange} required className="h-11 text-base"/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium flex items-center"><User className="w-4 h-4 mr-2 text-slate-400"/>{t('lastNameLabel')}</Label>
                  <Input id="lastName" name="lastName" placeholder={t('lastNamePlaceholder')} value={formData.lastName} onChange={handleChange} required className="h-11 text-base"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 font-medium flex items-center"><Mail className="w-4 h-4 mr-2 text-slate-400"/>{t('emailLabel')}</Label>
                <Input id="email" name="email" type="email" placeholder={t('emailPlaceholder')} value={formData.email} onChange={handleChange} required className="h-11 text-base"/>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-slate-700 font-medium flex items-center"><Globe className="w-4 h-4 mr-2 text-slate-400"/>{t('countryLabel')}</Label>
                  <Select name="country" onValueChange={(value) => handleSelectChange('country', value)} value={formData.country}>
                    <SelectTrigger className="w-full h-11 text-base"><SelectValue placeholder={t('countryPlaceholder')} /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.name} className="text-base">{country.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="documentId" className="text-slate-700 font-medium flex items-center"><CreditCard className="w-4 h-4 mr-2 text-slate-400"/>{t('documentIdLabel')}</Label>
                  <Input id="documentId" name="documentId" placeholder={t('documentIdPlaceholder')} value={formData.documentId} onChange={handleChange} required className="h-11 text-base"/>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="birthDate" className="text-slate-700 font-medium flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400"/>{t('birthDateLabel')}</Label>
                  <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required className="h-11 text-base"/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-slate-700 font-medium flex items-center"><Phone className="w-4 h-4 mr-2 text-slate-400"/>{t('phoneLabel')}</Label>
                  <Input id="phone" name="phone" type="tel" placeholder={t('phonePlaceholder')} value={formData.phone} onChange={handleChange} className="h-11 text-base"/>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-700 font-medium flex items-center"><Lock className="w-4 h-4 mr-2 text-slate-400"/>{t('securePasswordLabel')}</Label>
                  <Input id="password" name="password" type="password" placeholder={t('passwordMinLength')} value={formData.password} onChange={handleChange} required className="h-11 text-base"/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium flex items-center"><Lock className="w-4 h-4 mr-2 text-slate-400"/>{t('confirmPasswordLabel')}</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder={t('confirmPasswordPlaceholder')} value={formData.confirmPassword} onChange={handleChange} required className="h-11 text-base"/>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white h-12 text-base font-semibold" disabled={loading}>
                {loading ? t('registeringAccount') : t('createSecureAccount')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-blue-700 hover:text-blue-800 font-semibold hover:underline">
                  {t('loginHere')}
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <Button variant="ghost" className="text-slate-500 hover:text-blue-700" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('backToMainPage')}
                </Link>
              </Button>
            </div>
            <div className="mt-2 text-center">
                <LanguageSelector />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;