import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { vaccinationSchedules } from '@/utils/vaccinationSchedules';

const VaccineModalAdmin = ({ isOpen, user, vaccine, onClose, onSave }) => {
  const { t } = useTranslation();
  const [editableVaccine, setEditableVaccine] = useState({});

  useEffect(() => {
    if (vaccine) {
      setEditableVaccine({ ...vaccine });
    }
  }, [vaccine]);

  if (!isOpen || !user) return null;

  const handleInputChange = (e) => {
    setEditableVaccine({ ...editableVaccine, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name, value) => {
    setEditableVaccine({ ...editableVaccine, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditableVaccine({ ...editableVaccine, vaccineProofUrl: URL.createObjectURL(file) });
    }
  };
  
  const vaccineDoses = ['1ra Dosis', '2da Dosis', '3ra Dosis', 'Refuerzo', 'Dosis Única', 'Refuerzo Anual'];
  const countrySchedules = vaccinationSchedules.find(s => s.country === user.country);
  const vaccineNames = countrySchedules ? countrySchedules.vaccines : vaccinationSchedules.find(s => s.country === 'Default').vaccines;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white shadow-2xl max-h-[90vh] rounded-lg">
        <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg">
          <CardTitle className="text-lg sm:text-xl text-blue-800">{vaccine.id ? t('editVaccineModalTitle', {name: user.firstName}) : t('addVaccineModalTitle', {name: user.firstName})}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
          <div><Label className="font-medium text-slate-700 text-sm">{t('vaccineNameLabel')}</Label>
          <Select value={editableVaccine.vaccineName || ''} onValueChange={(value) => handleSelectChange('vaccineName', value)}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('selectVaccinePlaceholder')}/></SelectTrigger>
              <SelectContent className="max-h-48 sm:max-h-52">{vaccineNames.map(v => <SelectItem key={v} value={v} className="text-sm">{v}</SelectItem>)}</SelectContent>
          </Select></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('doseLabel')}</Label>
          <Select value={editableVaccine.dose || ''} onValueChange={(value) => handleSelectChange('dose', value)}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('selectDosePlaceholder')}/></SelectTrigger>
              <SelectContent className="max-h-48 sm:max-h-52">{vaccineDoses.map(d => <SelectItem key={d} value={d} className="text-sm">{d}</SelectItem>)}</SelectContent>
          </Select></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('vaccinationDateFormLabel')}</Label><Input type="date" name="vaccinationDate" value={editableVaccine.vaccinationDate || ''} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('vaccineLotFormLabel')}</Label><Input name="vaccineLot" value={editableVaccine.vaccineLot || ''} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('vaccinationPlaceFormLabel')}</Label><Input name="vaccinationPlace" value={editableVaccine.vaccinationPlace || ''} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('healthProfessionalLabel')}</Label><Input name="healthProfessional" value={editableVaccine.healthProfessional || ''} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('vaccineProofLabel')}</Label><Input type="file" accept="image/*,.pdf" className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" onChange={handleFileChange} />
           {editableVaccine.vaccineProofUrl && (
              <p className="text-xs text-blue-600 mt-1">{t('currentFile')}: <a href={editableVaccine.vaccineProofUrl} target="_blank" rel="noopener noreferrer" className="underline">Ver/Descargar</a></p>
          )}</div>
          <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-3">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={onClose}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
            <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm" onClick={() => onSave(user, editableVaccine)}><Save className="mr-1.5 h-4 w-4"/>{t('saveButton')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccineModalAdmin;