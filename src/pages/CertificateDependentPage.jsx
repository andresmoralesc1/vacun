import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { generateCertificatePDF } from '@/utils/pdfGenerator';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CertificateDependentPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { dependentId } = useParams();
  const navigate = useNavigate();
  const [dependent, setDependent] = useState(null);

  useEffect(() => {
    if (user && user.dependents) {
      const foundDependent = user.dependents.find(d => d.id === dependentId);
      if (foundDependent) {
        setDependent(foundDependent);
      } else {
        toast({ title: t('error'), description: t('dependentNotFound'), variant: "destructive" });
        navigate('/manage-dependents');
      }
    }
  }, [user, dependentId, navigate, t]);

  useEffect(() => {
    const generateAndDownload = async () => {
      if (!dependent) return;

      if (!dependent.vaccines || dependent.vaccines.length === 0) {
        toast({
          title: t('error'),
          description: t('noVaccinesToCertifyOther', { name: dependent.firstName }),
          variant: "destructive",
        });
        navigate(`/dependent/${dependentId}/dashboard`);
        return;
      }

      try {
        const certificateData = {
          patientName: `${dependent.firstName} ${dependent.lastName}`,
          documentId: dependent.documentId,
          birthDate: dependent.birthDate,
          country: dependent.country,
          vaccines: dependent.vaccines,
          issueDate: new Date().toISOString(),
          qrCode: `https://vacun.org/verify/dependent/${dependent.id}-${Date.now()}`,
          lang: i18n.language,
          t: t,
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
      } finally {
        navigate(`/dependent/${dependentId}/dashboard`);
      }
    };

    if(dependent) {
        generateAndDownload();
    }
  }, [dependent, dependentId, navigate, t, i18n.language]);

  if (!dependent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
        <Shield className="h-16 w-16 text-blue-600 mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold text-blue-800 mb-2">{t('loadingDependentData')}</h1>
        <p className="text-slate-600">
          {t('pleaseWait')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
      <Shield className="h-16 w-16 text-blue-600 mb-4 animate-pulse" />
      <h1 className="text-2xl font-bold text-blue-800 mb-2">{t('generatingCertificateFor', { name: dependent.firstName })}</h1>
      <p className="text-slate-600">
        {t('pleaseWaitRedirect')}
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

export default CertificateDependentPage;