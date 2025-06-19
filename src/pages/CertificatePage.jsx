import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { generateCertificatePDF } from '@/utils/pdfGenerator';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CertificatePage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const generateAndDownload = async () => {
      if (!user || !user.vaccines || user.vaccines.length === 0) {
        toast({
          title: t('error'),
          description: t('noVaccinesToCertifySelf'),
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      try {
        const certificateData = {
          patientName: `${user.firstName} ${user.lastName}`,
          documentId: user.documentId,
          birthDate: user.birthDate,
          country: user.country,
          vaccines: user.vaccines,
          issueDate: new Date().toISOString(),
          qrCode: `https://vacun.org/verify/${user.id}-${Date.now()}`,
          lang: i18n.language,
          t: t,
        };
        
        await generateCertificatePDF(certificateData);

        const certificates = JSON.parse(localStorage.getItem('vacun_certificates') || '[]');
        const existingCertIndex = certificates.findIndex(c => c.userId === user.id);
        const newCertificateEntry = {
          id: `${user.id}-${Date.now()}`,
          userId: user.id,
          patientName: `${user.firstName} ${user.lastName}`,
          documentId: user.documentId,
          vaccineName: `${user.vaccines.length} vacuna(s)`, 
          dose: 'Unificado',
          vaccinationDate: new Date().toISOString(), 
          issueDate: new Date().toISOString(),
          downloaded: true,
        };

        if (existingCertIndex !== -1) {
          certificates[existingCertIndex] = { ...certificates[existingCertIndex], ...newCertificateEntry, downloaded: true };
        } else {
          certificates.push(newCertificateEntry);
        }
        localStorage.setItem('vacun_certificates', JSON.stringify(certificates));

        toast({
          title: t('certificateGenerated'),
          description: t('certificateGeneratedDesc', { name: user.firstName }),
        });
      } catch (error) {
        toast({
          title: t('errorGeneratingCertificate'),
          description: error.message || t('errorGeneratingCertificateDesc'),
          variant: "destructive",
        });
      } finally {
        navigate('/dashboard');
      }
    };

    generateAndDownload();
  }, [user, navigate, t, i18n.language]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Shield className="h-16 w-16 text-blue-600 mb-4 animate-pulse" />
      <h1 className="text-2xl font-bold text-blue-900 mb-2">{t('generatingCertificate')}</h1>
      <p className="text-blue-700">
        {t('generatingCertificateSubtitle')}
      </p>
      <div className="mt-8 w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-pulse-fast" style={{ width: '100%', animation: 'progress 2s linear infinite' }}></div>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-pulse-fast {
          animation-duration: 1.5s;
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;