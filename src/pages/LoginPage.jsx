import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const LoginPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    loginIdentifier: '', 
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.loginIdentifier, formData.password);
      
      if (result.success) {
        toast({
          title: t('loginSuccess'),
          description: t('loginSuccessDesc'),
        });
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'medical_center') {
          navigate('/medical-center');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast({
          title: t('error'),
          description: result.error || t('loginErrorDesc'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-white/20 shadow-2xl rounded-xl">
          <CardHeader className="text-center pt-8 pb-6">
            <div className="flex justify-center items-center mb-4">
              <Link to="/" className="inline-block">
                <Shield className="h-12 w-12 text-blue-600 mx-auto" />
              </Link>
            </div>
            <CardTitle className="text-3xl font-bold text-blue-900">
              {t('loginTitle')}
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              {t('loginSubtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="loginIdentifier" className="text-slate-700 font-medium">{t('emailOrDocumentLabel')}</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="loginIdentifier"
                    name="loginIdentifier"
                    type="text"
                    placeholder={t('emailOrDocumentPlaceholder')}
                    value={formData.loginIdentifier}
                    onChange={handleChange}
                    className="pl-11 h-11 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700 font-medium">{t('passwordLabel')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-11 h-11 text-base"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold" 
                disabled={loading}
              >
                {loading ? t('loggingIn') : t('loginTitle')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                {t('noAccount')}{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  {t('registerHere')}
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Button variant="ghost" asChild className="text-slate-500 hover:text-blue-600">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('backToHome')}
                </Link>
              </Button>
            </div>
             <div className="mt-2 text-center">
                <LanguageSelector />
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-1.5">{t('testAccounts')}</p>
              <p className="text-xs text-blue-700">{t('adminTestAccount')}</p>
              <p className="text-xs text-blue-700">{t('medicalCenterTestAccount')}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;