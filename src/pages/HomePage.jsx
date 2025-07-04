import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, FileText, Users, ArrowRight, LockKeyhole, Hotel as Hospital, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: ShieldCheck,
      title: t('internationalValidity'),
      description: t('internationalValidityDesc'),
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: LockKeyhole,
      title: t('advancedSecurity'),
      description: t('advancedSecurityDesc'),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Globe,
      title: t('multilingualSupport'),
      description: t('multilingualSupportDesc'),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Hospital,
      title: t('integrationWithEntities'),
      description: t('integrationWithEntitiesDesc'),
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  const stats = [
    { value: "190+", label: t('countriesAccepted') },
    { value: "10M+", label: t('certificatesIssued') },
    { value: "99.9%", label: t('availability') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 text-slate-800">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 sm:h-9 sm:w-9 text-blue-700" />
            <span className="text-2xl sm:text-3xl font-bold text-blue-800 tracking-tight">Vacun<span className="text-sky-600">.org</span></span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            <div className="relative z-50"> <LanguageSelector /> </div>
            <Button variant="ghost" asChild className="text-slate-700 hover:bg-sky-100 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
              <Link to="/login">{t('login')}</Link>
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base" asChild>
              <Link to="/register">{t('register')}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <div className="mr-2"> <LanguageSelector /> </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:bg-sky-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40 pb-4"
          >
            <nav className="flex flex-col items-center space-y-3 pt-3">
              <Button variant="ghost" asChild className="w-full text-slate-700 hover:bg-sky-100 py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button className="w-11/12 mx-auto bg-blue-700 hover:bg-blue-800 text-white py-2 text-base" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/register">{t('register')}</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </header>

      <main>
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          fgfgfg
          <div className="absolute inset-0 medical-pattern opacity-30"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-900 mb-6 leading-tight">
                {t('homePageTitle')}
                <span className="block text-sky-600 mt-1 sm:mt-2">{t('homePageSubtitle')}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
                {t('homePageDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 pulse-glow" asChild>
                  <Link to="/register">
                    {t('getCertificate')}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 border-blue-700 text-blue-700 hover:bg-blue-50" asChild>
                  <Link to="/login">{t('verifyCertificate')}</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3}}
              className="mt-12 md:mt-16"
            >
              <img  
                className="mx-auto rounded-xl shadow-2xl w-full max-w-4xl border-4 border-white"
                alt="Maqueta de la interfaz de Vacun.org mostrando un certificado digital en un dispositivo móvil y de escritorio"
                src="https://images.unsplash.com/photo-1589561143018-62df35971405" />
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">{t('yourGlobalHealthPassport')}</h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                {t('featuresForPeaceOfMind')}
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 h-full ${feature.bgColor} border ${feature.borderColor} rounded-xl overflow-hidden`}>
                    <CardHeader className="items-center text-center pt-8 pb-4">
                      <div className={`p-3 sm:p-4 rounded-full inline-block mb-4 ring-2 ring-offset-2 ${feature.color.replace('text-', 'ring-')}`}>
                         <feature.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${feature.color}`} />
                      </div>
                      <CardTitle className={`text-xl sm:text-2xl ${feature.color.replace('text-','text-')}`.replace('600','800')}>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center px-6 pb-8">
                      <p className="text-slate-700 text-sm sm:text-base">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 sm:py-20 bg-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity:0, y:20 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration:0.5, delay:index*0.15}}
                >
                  <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-sky-300">{stat.value}</p>
                  <p className="text-base sm:text-lg text-blue-100 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6">{t('getStartedToday')}</h2>
              <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-xl mx-auto">
                {t('getStartedTodayDesc')}
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg sm:text-xl px-10 sm:px-12 py-3.5 sm:py-4" asChild>
                <Link to="/register">
                  {t('createMyCertificateNow')}
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;