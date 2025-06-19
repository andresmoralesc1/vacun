import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { countries } from '@/utils/countries';
import { toast } from '@/components/ui/use-toast';


const CreateUserModal = ({ isOpen, onClose, onCreate }) => {
  const { t } = useTranslation();
  const [newUserForm, setNewUserForm] = useState({
    firstName: '', lastName: '', email: '', password: '', documentId: '', birthDate: '', phone: '', role: 'user', country: '', medicalCenterName: ''
  });

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newUserForm.email || !newUserForm.password || !newUserForm.firstName || !newUserForm.documentId || !newUserForm.country || (newUserForm.role === 'medical_center' && !newUserForm.medicalCenterName)) {
      toast({ title: t('error'), description: t('requiredFieldsError'), variant: "destructive" });
      return;
    }
    const dataToRegister = { ...newUserForm };
    if (dataToRegister.role !== 'medical_center') {
      delete dataToRegister.medicalCenterName;
    }
    const success = await onCreate(dataToRegister);
    if(success) {
      setNewUserForm({ firstName: '', lastName: '', email: '', password: '', documentId: '', birthDate: '', phone: '', role: 'user', country: '', medicalCenterName: '' });
    }
  };

  const userRoles = [
    { value: 'user', label: t('role_user') },
    { value: 'medical_center', label: t('role_medical_center') },
    { value: 'admin', label: t('role_admin') }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white shadow-2xl max-h-[90vh] rounded-lg">
        <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg"><CardTitle className="text-lg sm:text-xl text-blue-800">{t('createNewUserTitle')}</CardTitle></CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
          <div><Label className="font-medium text-slate-700 text-sm">{t('firstNameLabel')}*</Label><Input value={newUserForm.firstName} onChange={(e) => setNewUserForm({...newUserForm, firstName: e.target.value})} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('lastNameLabel')}</Label><Input value={newUserForm.lastName} onChange={(e) => setNewUserForm({...newUserForm, lastName: e.target.value})} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('emailLabel')}*</Label><Input type="email" value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('passwordLabelAdmin')}</Label><Input type="password" value={newUserForm.password} onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('countryLabel')}*</Label>
            <Select value={newUserForm.country} onValueChange={(value) => setNewUserForm({...newUserForm, country: value })}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('countryPlaceholder')} /></SelectTrigger>
              <SelectContent className="max-h-48 sm:max-h-52">{countries.map(c => <SelectItem key={c.code} value={c.name} className="text-sm">{c.name}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('documentIdLabel')}*</Label><Input value={newUserForm.documentId} onChange={(e) => setNewUserForm({...newUserForm, documentId: e.target.value})} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('birthDateLabel')}</Label><Input type="date" value={newUserForm.birthDate} onChange={(e) => setNewUserForm({...newUserForm, birthDate: e.target.value})} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('phoneLabel')}</Label><Input value={newUserForm.phone} onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})} className="h-10 text-sm"/></div>
          <div><Label className="font-medium text-slate-700 text-sm">{t('roleLabelAdmin')}</Label>
          <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({...newUserForm, role: value })}>
            <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{userRoles.map(role => <SelectItem key={role.value} value={role.value} className="text-sm">{role.label}</SelectItem>)}</SelectContent>
          </Select></div>
          {newUserForm.role === 'medical_center' && (
            <div><Label className="font-medium text-slate-700 text-sm">{t('medicalCenterNameLabelAdmin')}</Label><Input value={newUserForm.medicalCenterName} onChange={(e) => setNewUserForm({...newUserForm, medicalCenterName: e.target.value})} className="h-10 text-sm"/></div>
          )}
          <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-3">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={onClose}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm" onClick={handleCreate}><CheckCircle className="mr-1.5 h-4 w-4"/>{t('createButton')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserModal;