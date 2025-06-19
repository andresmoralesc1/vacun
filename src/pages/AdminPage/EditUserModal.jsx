import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { countries } from '@/utils/countries';

const EditUserModal = ({ isOpen, user, onClose, onSave }) => {
  const { t } = useTranslation();
  const [editableUser, setEditableUser] = useState(null);

  useEffect(() => {
    if (user) {
      setEditableUser({ ...user });
    }
  }, [user]);

  if (!isOpen || !editableUser) return null;

  const userRoles = [
    { value: 'user', label: t('role_user') },
    { value: 'medical_center', label: t('role_medical_center') },
    { value: 'admin', label: t('role_admin') }
  ];

  const handleInputChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name, value) => {
    setEditableUser({ ...editableUser, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white shadow-2xl max-h-[90vh] rounded-lg">
        <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg">
          <CardTitle className="text-lg sm:text-xl text-blue-800">{t('editUserTitle', { name: `${user.firstName} ${user.lastName}` })}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
          <div><Label className="font-medium text-slate-700 text-sm">{t('firstNameLabel')}</Label><Input name="firstName" value={editableUser.firstName} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('lastNameLabel')}</Label><Input name="lastName" value={editableUser.lastName} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('emailLabel')}</Label><Input type="email" name="email" value={editableUser.email} onChange={handleInputChange} className="h-10 text-sm" disabled={editableUser.isConvertedDependent}/></div>
          {editableUser.isConvertedDependent && <p className="text-xs text-slate-500 -mt-2">{t('emailForConvertedDependentInfo')}</p>}
          <div><Label className="font-medium text-slate-700 text-sm">{t('countryLabel')}</Label>
            <Select value={editableUser.country} onValueChange={(value) => handleSelectChange('country', value)}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('countryPlaceholder')} /></SelectTrigger>
              <SelectContent className="max-h-48 sm:max-h-52">{countries.map(c => <SelectItem key={c.code} value={c.name} className="text-sm">{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('documentIdLabel')}</Label><Input name="documentId" value={editableUser.documentId} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('birthDateLabel')}</Label><Input type="date" name="birthDate" value={editableUser.birthDate} onChange={handleInputChange} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('phoneLabel')}</Label><Input name="phone" value={editableUser.phone || ''} onChange={handleInputChange} className="h-10 text-sm"/></div>
          
          {!editableUser.isConvertedDependent && (
            <div>
              <Label className="font-medium text-slate-700 text-sm">{t('roleLabelAdmin')}</Label>
              <Select value={editableUser.role} onValueChange={(value) => handleSelectChange('role', value)}>
                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{userRoles.map(role => <SelectItem key={role.value} value={role.value} className="text-sm">{role.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {editableUser.role === 'medical_center' && !editableUser.isConvertedDependent && (
            <div><Label className="font-medium text-slate-700 text-sm">{t('medicalCenterNameLabelAdmin')}</Label><Input name="medicalCenterName" value={editableUser.medicalCenterName || ''} onChange={handleInputChange} className="h-10 text-sm"/></div>
          )}

          <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-3">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={onClose}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
            <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm" onClick={() => onSave(editableUser)}><Save className="mr-1.5 h-4 w-4"/>{t('saveButton')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserModal;