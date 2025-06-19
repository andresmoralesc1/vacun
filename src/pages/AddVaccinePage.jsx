import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Syringe, Calendar, MapPin, User, FileUp, PlusCircle, Save, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { getVaccineListForCountry } from '@/utils/vaccinationSchedules';
import { countries } from '@/utils/countries';

const AddVaccinePage = () => {
  const { t } = useTranslation();
  const { user, addVaccineToUser, updateVaccineForUser, deleteVaccineForUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vaccineIdToEdit = searchParams.get('edit');

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vaccineProof, setVaccineProof] = useState(null);
  const [vaccineProofName, setVaccineProofName] = useState('');
  const [vaccinesList, setVaccinesList] = useState([]);

  const initialFormData = {
    vaccineName: '',
    dose: '',
    vaccinationDate: '',
    vaccinationPlace: '',
    healthProfessional: '',
    vaccineLot: '',
    vaccineProofUrl: '' 
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (user) {
      const countryCode = countries.find(c => c.name === user.country)?.code;
      const countryVaccines = getVaccineListForCountry(countryCode);
      setVaccinesList([...countryVaccines, 'Otra']);

      if (vaccineIdToEdit && user.vaccines) {
        const vaccineToEdit = user.vaccines.find(v => v.id === vaccineIdToEdit);
        if (vaccineToEdit) {
          setFormData({
            vaccineName: vaccineToEdit.vaccineName || '',
            dose: vaccineToEdit.dose || '',
            vaccinationDate: vaccineToEdit.vaccinationDate || '',
            vaccinationPlace: vaccineToEdit.vaccinationPlace || '',
            healthProfessional: vaccineToEdit.healthProfessional || '',
            vaccineLot: vaccineToEdit.vaccineLot || '',
            vaccineProofUrl: vaccineToEdit.vaccineProofUrl || ''
          });
          if (vaccineToEdit.vaccineProofUrl) {
            setVaccineProofName(vaccineToEdit.vaccineProofUrl.split('/').pop());
          }
          setIsEditing(true);
        } else {
          toast({ title: t('error'), description: t('vaccineNotFoundForEdit'), variant: "destructive" });
          navigate('/dashboard');
        }
      } else {
        setIsEditing(false);
        setFormData(initialFormData);
        setVaccineProof(null);
        setVaccineProofName('');
      }
    }
  }, [vaccineIdToEdit, user, navigate, t]);

  const dosesList = [
    '1ra Dosis', '2da Dosis', '3ra Dosis', 'Refuerzo', 'Dosis Única', 'Refuerzo Anual'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVaccineProof(file);
      setVaccineProofName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, vaccineProofUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isEditing) {
        result = await updateVaccineForUser(user.id, vaccineIdToEdit, formData);
      } else {
        result = await addVaccineToUser(user.id, formData);
      }

      if (result.success) {
        toast({
          title: isEditing ? t('vaccineUpdatedToast') : t('vaccineAddedToast'),
          description: isEditing ? t('vaccineUpdatedDescToast') : t('vaccineAddedDescToast'),
        });
        navigate('/dashboard');
      } else {
        toast({ title: t('error'), description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('error'), description: t('unexpectedErrorDesc'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!isEditing || !vaccineIdToEdit) return;
    setLoading(true);
    try {
      const result = await deleteVaccineForUser(user.id, vaccineIdToEdit);
      if (result.success) {
        toast({ title: t('vaccineDeletedToast'), description: t('vaccineDeletedDescToast') });
        navigate('/dashboard');
      } else {
        toast({ title: t('error'), description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('error'), description: t('unexpectedErrorDesc'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen">
      <header className="glass-effect border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">Vacun.org</span>
          </div>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToDashboard')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              {isEditing ? t('editVaccineTitle') : t('addVaccineTitle')}
            </h1>
            <p className="text-blue-700">
              {isEditing ? t('editVaccineSubtitle') : t('addVaccineSubtitle')}
            </p>
          </div>

          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <Syringe className="mr-2 h-5 w-5" />
                {t('vaccineDetails')}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-blue-900">{t('vaccineNameLabel')}</Label>
                  <Select name="vaccineName" value={formData.vaccineName} onValueChange={(value) => handleSelectChange('vaccineName', value)} required>
                    <SelectTrigger><SelectValue placeholder={t('selectVaccinePlaceholder')} /></SelectTrigger>
                    <SelectContent>
                      {vaccinesList.map((vaccine) => (
                        <SelectItem key={vaccine} value={vaccine}>{vaccine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-blue-900">{t('doseLabel')}</Label>
                    <Select name="dose" value={formData.dose} onValueChange={(value) => handleSelectChange('dose', value)} required>
                      <SelectTrigger><SelectValue placeholder={t('selectDosePlaceholder')} /></SelectTrigger>
                      <SelectContent>
                        {dosesList.map((dose) => (
                          <SelectItem key={dose} value={dose}>{dose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vaccinationDate" className="text-blue-900">{t('vaccinationDateFormLabel')}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                      <Input id="vaccinationDate" name="vaccinationDate" type="date" value={formData.vaccinationDate} onChange={handleChange} className="pl-10" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccineLot" className="text-blue-900">{t('vaccineLotFormLabel')}</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input id="vaccineLot" name="vaccineLot" placeholder={t('vaccineLotPlaceholder')} value={formData.vaccineLot} onChange={handleChange} className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccinationPlace" className="text-blue-900">{t('vaccinationPlaceFormLabel')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input id="vaccinationPlace" name="vaccinationPlace" placeholder={t('vaccinationPlacePlaceholder')} value={formData.vaccinationPlace} onChange={handleChange} className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthProfessional" className="text-blue-900">{t('healthProfessionalLabel')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input id="healthProfessional" name="healthProfessional" placeholder={t('healthProfessionalPlaceholder')} value={formData.healthProfessional} onChange={handleChange} className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccineProof" className="text-blue-900">{t('vaccineProofLabel')}</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="vaccineProof" type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('vaccineProof').click()}>
                      <FileUp className="mr-2 h-4 w-4" />
                      {t('selectFile')}
                    </Button>
                    {vaccineProofName && <span className="text-sm text-blue-700 truncate max-w-xs">{vaccineProofName}</span>}
                  </div>
                   {formData.vaccineProofUrl && !vaccineProof && (
                    <div className="mt-2">
                      <p className="text-sm text-blue-700">{t('currentFile')}: <a href={formData.vaccineProofUrl} target="_blank" rel="noopener noreferrer" className="underline">{formData.vaccineProofUrl.split('/').pop().substring(0,30)}...</a></p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" className="w-full sm:w-auto pulse-glow" disabled={loading}>
                    {loading ? (isEditing ? t('saving') : t('adding')) : (
                      isEditing ? <><Save className="mr-2 h-4 w-4" /> {t('saveChanges')}</> : <><PlusCircle className="mr-2 h-4 w-4" /> {t('addVaccineButton')}</>
                    )}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="destructive" onClick={handleDelete} className="w-full sm:w-auto" disabled={loading}>
                      <Trash2 className="mr-2 h-4 w-4" /> {t('deleteVaccineButton')}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AddVaccinePage;