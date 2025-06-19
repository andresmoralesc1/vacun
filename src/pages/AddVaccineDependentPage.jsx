import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
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

const AddVaccineDependentPage = () => {
  const { t } = useTranslation();
  const { user, addVaccineToDependent, updateVaccineForDependent, deleteVaccineForDependent } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dependentId } = useParams();
  const vaccineIdToEdit = searchParams.get('edit');

  const [dependent, setDependent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (user && user.id && dependentId) {
      const allStoredUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const foundDependent = allStoredUsers.find(u => u.id === dependentId && u.isConvertedDependent && u.mainAccountId === user.id);

      if (foundDependent) {
        setDependent(foundDependent);
        
        const countryCode = countries.find(c => c.name === foundDependent.country)?.code;
        const countryVaccines = getVaccineListForCountry(countryCode);
        setVaccinesList([...countryVaccines, 'Otra']);

        if (vaccineIdToEdit && foundDependent.vaccines) {
          const vaccineToEdit = foundDependent.vaccines.find(v => v.id === vaccineIdToEdit);
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
            navigate(`/dependent/${dependentId}/dashboard`);
          }
        } else {
          setIsEditing(false);
          setFormData(initialFormData);
          setVaccineProofName('');
        }
      } else {
        toast({ title: t('error'), description: t('dependentNotFound'), variant: "destructive" });
        navigate('/manage-dependents');
      }
    }
  }, [user, dependentId, vaccineIdToEdit, navigate, t]);

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
        result = await updateVaccineForDependent(user.id, dependentId, vaccineIdToEdit, formData);
      } else {
        result = await addVaccineToDependent(user.id, dependentId, formData);
      }

      if (result.success) {
        toast({
          title: isEditing ? t('vaccineUpdatedToast') : t('vaccineAddedToast'),
          description: isEditing ? t('vaccineUpdatedForDependentToast', { name: dependent?.firstName }) : t('vaccineAddedForDependentToast', { name: dependent?.firstName }),
        });
        navigate(`/dependent/${dependentId}/dashboard`);
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
      const result = await deleteVaccineForDependent(user.id, dependentId, vaccineIdToEdit);
      if (result.success) {
        toast({ title: t('vaccineDeletedToast'), description: t('vaccineDeletedForDependentToast', { name: dependent?.firstName }) });
        navigate(`/dependent/${dependentId}/dashboard`);
      } else {
        toast({ title: t('error'), description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('error'), description: t('unexpectedErrorDesc'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!dependent) {
    return <div className="min-h-screen flex items-center justify-center"><p>{t('loadingDependentData')}</p></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
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
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              {isEditing ? t('editVaccineFor', { name: dependent.firstName }) : t('addVaccineFor', { name: dependent.firstName })}
            </h1>
            <p className="text-lg text-slate-600">
              {isEditing ? t('editVaccineForSubtitle') : t('addVaccineForSubtitle')}
            </p>
          </div>

          <Card className="shadow-xl border-slate-300">
            <CardHeader className="bg-slate-50 p-6 rounded-t-lg">
              <CardTitle className="text-xl text-blue-800 flex items-center">
                <Syringe className="mr-2 h-5 w-5" />
                {t('vaccineDetails')}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-medium">{t('vaccineNameLabel')}</Label>
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
                  <div className="space-y-1.5">
                    <Label className="text-slate-700 font-medium">{t('doseLabel')}</Label>
                    <Select name="dose" value={formData.dose} onValueChange={(value) => handleSelectChange('dose', value)} required>
                      <SelectTrigger><SelectValue placeholder={t('selectDosePlaceholder')} /></SelectTrigger>
                      <SelectContent>
                        {dosesList.map((dose) => (
                          <SelectItem key={dose} value={dose}>{dose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vaccinationDate" className="text-slate-700 font-medium">{t('vaccinationDateFormLabel')}</Label>
                    <Input id="vaccinationDate" name="vaccinationDate" type="date" value={formData.vaccinationDate} onChange={handleChange} required 
                           className="block w-full appearance-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vaccineLot" className="text-slate-700 font-medium">{t('vaccineLotFormLabel')}</Label>
                  <Input id="vaccineLot" name="vaccineLot" placeholder={t('vaccineLotPlaceholder')} value={formData.vaccineLot} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vaccinationPlace" className="text-slate-700 font-medium">{t('vaccinationPlaceFormLabel')}</Label>
                  <Input id="vaccinationPlace" name="vaccinationPlace" placeholder={t('vaccinationPlacePlaceholder')} value={formData.vaccinationPlace} onChange={handleChange} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="healthProfessional" className="text-slate-700 font-medium">{t('healthProfessionalLabel')}</Label>
                  <Input id="healthProfessional" name="healthProfessional" placeholder={t('healthProfessionalPlaceholder')} value={formData.healthProfessional} onChange={handleChange} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vaccineProof" className="text-slate-700 font-medium">{t('vaccineProofLabel')}</Label>
                  <div className="flex items-center space-x-3">
                    <Input id="vaccineProof" type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                    <Button type="button" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => document.getElementById('vaccineProof').click()}>
                      <FileUp className="mr-2 h-4 w-4" />
                      {t('selectFile')}
                    </Button>
                    {vaccineProofName && <span className="text-sm text-slate-600 truncate max-w-xs">{vaccineProofName}</span>}
                  </div>
                   {formData.vaccineProofUrl && !document.getElementById('vaccineProof')?.files?.[0] && (
                    <div className="mt-2">
                      <p className="text-xs text-blue-600">{t('currentFile')}: <a href={formData.vaccineProofUrl} target="_blank" rel="noopener noreferrer" className="underline">{formData.vaccineProofUrl.split('/').pop().substring(0,30)}...</a></p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
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

export default AddVaccineDependentPage;