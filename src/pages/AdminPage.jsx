import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Users, FileText, Download, Search, Edit, Trash2, PlusCircle, UserPlus, FilePlus, Save, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { generateCertificatePDF } from '@/utils/pdfGenerator';
import { countries } from '@/utils/countries';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const VaccineList = ({ user, onEditVaccine, onDeleteVaccine, t }) => (
  <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 pl-2 sm:pl-4 border-t border-slate-200">
    {user.vaccines.map(vac => (
      <div key={vac.id} className="text-xs sm:text-sm text-slate-700 flex justify-between items-center py-1 border-b border-slate-100 last:border-b-0">
        <div className="truncate max-w-[calc(100%-60px)]">
          <span className="font-medium">{vac.vaccineName}</span> ({vac.dose})
          <span className="text-xs text-slate-500 ml-1.5 sm:ml-2">{t('vaccinationDateLabel')}: {new Date(vac.vaccinationDate).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-0.5 sm:gap-1">
          <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500 hover:text-blue-600" onClick={() => onEditVaccine(user.id, vac)}><Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></Button>
          <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500 hover:text-red-600" onClick={() => onDeleteVaccine(user.id, vac.id)}><Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></Button>
        </div>
      </div>
    ))}
  </div>
);

const UserCard = ({ user, onEdit, onAddVaccine, onDelete, onGenerateCertificate, roles, t, onEditVaccine, onDeleteVaccine }) => (
  <div className="p-4 sm:p-5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
      <div className="flex-1 mb-2 sm:mb-0">
        <p className="text-base sm:text-lg font-semibold text-blue-700">{user.firstName} {user.lastName}
          <span className={`text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ml-2
            ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
              user.role === 'medical_center' ? 'bg-green-100 text-green-700' :
              'bg-sky-100 text-sky-700'}`}>
            {roles.find(r => r.value === user.role)?.label || user.role}
          </span>
        </p>
        <p className="text-xs sm:text-sm text-slate-600 truncate max-w-xs sm:max-w-md">{user.email}</p>
        <p className="text-xs sm:text-sm text-slate-500">ID: {user.documentId} | {t('countryLabel')}: {user.country || 'N/A'}</p>
        {user.role === 'user' && <p className="text-xs sm:text-sm text-blue-600 font-medium">{t('userVaccinesCount')}: {user.vaccines?.length || 0}</p>}
        {user.role === 'medical_center' && user.medicalCenterName && <p className="text-xs sm:text-sm text-green-600 font-medium">{t('medicalCenterNameLabel')}: {user.medicalCenterName}</p>}
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 self-start sm:self-center">
        <Button size="sm" variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100 text-xs" onClick={() => onEdit(user)}><Edit className="mr-1 h-3.5 w-3.5"/>{t('editButton')}</Button>
        {user.role === 'user' && (
          <>
            <Button size="sm" variant="outline" className="border-sky-300 text-sky-600 hover:bg-sky-50 text-xs" onClick={() => onAddVaccine(user.id)}><FilePlus className="mr-1 h-3.5 w-3.5"/>{t('addVaccineShort')}</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => onGenerateCertificate(user.id)}><Download className="mr-1 h-3.5 w-3.5"/>{t('certificateButton')}</Button>
          </>
        )}
        <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 text-xs" onClick={() => onDelete(user.id)}><Trash2 className="mr-1 h-3.5 w-3.5"/>{t('deleteButton')}</Button>
      </div>
    </div>
    {user.role === 'user' && user.vaccines && user.vaccines.length > 0 && (
      <VaccineList user={user} onEditVaccine={onEditVaccine} onDeleteVaccine={onDeleteVaccine} t={t} />
    )}
  </div>
);

const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const { user: adminUser, register: adminRegisterUser, updateUser } = useAuth(); 
  const navigate = useNavigate();

  const [allUsersData, setAllUsersData] = useState([]); 
  const [displayUsers, setDisplayUsers] = useState([]); 
  const [searchTermUsers, setSearchTermUsers] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [selectedUserForVaccine, setSelectedUserForVaccine] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    firstName: '', lastName: '', email: '', password: '', documentId: '', birthDate: '', phone: '', role: 'user', country: '', medicalCenterName: ''
  });

  const vaccineDoses = ['1ra Dosis', '2da Dosis', '3ra Dosis', 'Refuerzo', 'Dosis Única', 'Refuerzo Anual'];
  const vaccineNames = [
    'COVID-19 (Pfizer-BioNTech)', 'COVID-19 (Moderna)', 'COVID-19 (AstraZeneca)', 
    'COVID-19 (Johnson & Johnson)', 'Influenza (Gripe)', 'Hepatitis B', 'Hepatitis A', 
    'Tétanos', 'Fiebre Amarilla', 'Sarampión', 'Rubéola', 'Paperas', 'Varicela', 
    'Neumococo', 'Meningococo', 'HPV (Virus del Papiloma Humano)', 'Otra'
  ];
  
  const userRoles = [
    { value: 'user', label: t('roleUser') },
    { value: 'medical_center', label: t('roleMedicalCenter') },
    { value: 'admin', label: t('roleAdmin') }
  ];

  const loadData = useCallback(() => {
    const storedUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const usersWithVaccines = storedUsers.map(u => ({
      ...u,
      vaccines: u.vaccines || [] 
    }));
    setAllUsersData(usersWithVaccines);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const updateUserInStorage = (updatedUser) => {
    const currentUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = currentUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      currentUsers[userIndex] = updatedUser;
      localStorage.setItem('vacun_users', JSON.stringify(currentUsers));
    }
  };

  const addVaccineToUserInStorage = (userId, vaccine) => {
    const currentUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = currentUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      currentUsers[userIndex].vaccines = [...(currentUsers[userIndex].vaccines || []), vaccine];
      localStorage.setItem('vacun_users', JSON.stringify(currentUsers));
    }
  };

  const updateVaccineInStorage = (userId, vaccineId, updatedVaccine) => {
    const currentUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = currentUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const vaccineIndex = currentUsers[userIndex].vaccines.findIndex(v => v.id === vaccineId);
      if (vaccineIndex !== -1) {
        currentUsers[userIndex].vaccines[vaccineIndex] = updatedVaccine;
        localStorage.setItem('vacun_users', JSON.stringify(currentUsers));
      }
    }
  };
  
  const deleteVaccineFromUserInStorage = (userId, vaccineId) => {
     const currentUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = currentUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      currentUsers[userIndex].vaccines = currentUsers[userIndex].vaccines.filter(v => v.id !== vaccineId);
      localStorage.setItem('vacun_users', JSON.stringify(currentUsers));
    }
  };

  const handleSaveUser = async (userToSave) => {
    const result = await updateUser(userToSave);
    if (result.success) {
      loadData(); 
      setEditingUser(null);
      toast({ title: t('userUpdatedToast'), description: t('userUpdatedDescToast') });
    } else {
      toast({ title: t('updateErrorToastUser'), description: result.error, variant: "destructive" });
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm(t('confirmDeleteUser'))) {
      const currentUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const updatedUsers = currentUsers.filter(u => u.id !== userId);
      localStorage.setItem('vacun_users', JSON.stringify(updatedUsers));
      loadData();
      toast({ title: t('userDeletedToast'), description: t('userDeletedDescToast') });
    }
  };

  const handleSaveVaccine = (userId, vaccineToSave) => {
    if (editingVaccine && editingVaccine.id) { 
      updateVaccineInStorage(userId, vaccineToSave.id, vaccineToSave);
    } else { 
      const newVaccine = { ...vaccineToSave, id: `vaccine-${Date.now()}` };
      addVaccineToUserInStorage(userId, newVaccine);
    }
    loadData();
    setEditingVaccine(null);
    setSelectedUserForVaccine(null);
    toast({ title: t('vaccineSavedToast'), description: t('vaccineSavedDescToast') });
  };

  const handleDeleteVaccine = (userId, vaccineId) => {
     if (window.confirm(t('confirmDeleteVaccine'))) {
      deleteVaccineFromUserInStorage(userId, vaccineId);
      loadData();
      toast({ title: t('vaccineDeletedToastAdmin'), description: t('vaccineDeletedDescToastAdmin') });
    }
  };
  
  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.password || !newUserForm.firstName || !newUserForm.documentId || !newUserForm.country || (newUserForm.role === 'medical_center' && !newUserForm.medicalCenterName)) {
      toast({ title: t('error'), description: t('requiredFieldsError'), variant: "destructive" });
      return;
    }
    
    const dataToRegister = { ...newUserForm };
    if (dataToRegister.role !== 'medical_center') {
      delete dataToRegister.medicalCenterName;
    }

    const result = await adminRegisterUser(dataToRegister);
    if (result.success) {
      toast({ title: t('userCreatedToast'), description: t('userCreatedDescToast') });
      setShowCreateUserModal(false);
      setNewUserForm({ firstName: '', lastName: '', email: '', password: '', documentId: '', birthDate: '', phone: '', role: 'user', country: '', medicalCenterName: '' });
      loadData();
    } else {
      toast({ title: t('createUserErrorToast'), description: result.error, variant: "destructive" });
    }
  };

  useEffect(() => {
    const filtered = allUsersData.filter(u => 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTermUsers.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTermUsers.toLowerCase()) ||
      u.documentId.includes(searchTermUsers) ||
      (u.country && u.country.toLowerCase().includes(searchTermUsers.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(searchTermUsers.toLowerCase()))
    );
    setDisplayUsers(filtered);
  }, [searchTermUsers, allUsersData]);

  const stats = [
    { title: t('registeredDependents'), value: allUsersData.length, icon: Users, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { title: t('myVaccines'), value: allUsersData.reduce((sum, u) => sum + (u.vaccines ? u.vaccines.length : 0), 0), icon: FileText, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  ];

  const openAddVaccineModal = (userId) => {
    setSelectedUserForVaccine(userId);
    setEditingVaccine({ vaccineName: '', dose: '', vaccinationDate: '', vaccinationPlace: '', healthProfessional: '', vaccineLot: '', vaccineProofUrl: '' });
  };
  
  const openEditVaccineModal = (userId, vaccine) => {
    setSelectedUserForVaccine(userId);
    setEditingVaccine({...vaccine});
  };

  const handleGenerateUnifiedCertificate = async (userId) => {
    const userToCertify = allUsersData.find(u => u.id === userId);
    if (!userToCertify || !userToCertify.vaccines || userToCertify.vaccines.length === 0) {
      toast({ title: t('error'), description: t('noVaccinesForCertificateUser'), variant: "destructive" });
      return;
    }
    
    const certificateData = {
      patientName: `${userToCertify.firstName} ${userToCertify.lastName}`,
      documentId: userToCertify.documentId,
      birthDate: userToCertify.birthDate,
      country: userToCertify.country,
      vaccines: userToCertify.vaccines,
      issueDate: new Date().toISOString(),
      qrCode: `https://vacun.org/verify/user/${userId}-${Date.now()}`,
      lang: i18n.language,
      t,
    };

    try {
      await generateCertificatePDF(certificateData);
      toast({ title: t('certificateGenerated'), description: t('certificateGeneratedForUserToast', { name: userToCertify.firstName }) });
    } catch (error) {
      toast({ title: t('pdfErrorToast'), description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-blue-700" />
            <span className="text-xl sm:text-2xl font-bold text-blue-800">Vacun.org</span>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">{t('roleAdmin').toUpperCase()}</span>
          </Link>
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('backToDashboard')}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800">{t('adminPageTitle')}</h1>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className={`shadow-lg border ${stat.borderColor} ${stat.bgColor} rounded-xl`}>
                <CardContent className="p-5 sm:p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-700 mb-0.5 sm:mb-1">{stat.title}</p>
                    <p className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${stat.color}`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <Card className="shadow-xl border-slate-200 bg-white rounded-xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-5 sm:p-6 bg-slate-50 rounded-t-xl">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-blue-800">{t('userManagement')}</CardTitle>
                <CardDescription className="text-slate-600 mt-1 text-sm sm:text-base">{t('userManagementDesc')}</CardDescription>
              </div>
              <Button onClick={() => setShowCreateUserModal(true)} className="bg-blue-700 hover:bg-blue-800 text-white text-sm sm:text-base self-start sm:self-center">
                <UserPlus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"/>{t('createUser')}
              </Button>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <div className="relative mb-5 sm:mb-6">
                <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <Input placeholder={t('searchUserPlaceholder')} value={searchTermUsers} onChange={(e) => setSearchTermUsers(e.target.value)} className="pl-10 sm:pl-12 py-2.5 sm:py-3 text-sm sm:text-base h-10 sm:h-11" />
              </div>
              <div className="space-y-4 sm:space-y-5 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
                {displayUsers.map(u => (
                  <UserCard 
                    key={u.id} 
                    user={u} 
                    onEdit={setEditingUser} 
                    onAddVaccine={openAddVaccineModal} 
                    onDelete={handleDeleteUser} 
                    onGenerateCertificate={handleGenerateUnifiedCertificate} 
                    roles={userRoles}
                    onEditVaccine={openEditVaccineModal}
                    onDeleteVaccine={handleDeleteVaccine}
                    t={t}
                  />
                ))}
                 {displayUsers.length === 0 && <p className="text-center text-slate-500 py-4 text-sm sm:text-base">{t('noUsersFound')}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {(editingUser) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-lg bg-white shadow-2xl max-h-[90vh] rounded-lg">
              <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-blue-800">{t('editUserTitle', { name: `${editingUser.firstName} ${editingUser.lastName}` })}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
                <div><Label className="font-medium text-slate-700 text-sm">{t('firstNameLabel')}</Label><Input value={editingUser.firstName} onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('lastNameLabel')}</Label><Input value={editingUser.lastName} onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('emailLabel')}</Label><Input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('countryLabel')}</Label>
                  <Select value={editingUser.country} onValueChange={(value) => setEditingUser({...editingUser, country: value })}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('countryPlaceholder')} /></SelectTrigger>
                    <SelectContent className="max-h-48 sm:max-h-52">{countries.map(c => <SelectItem key={c.code} value={c.name} className="text-sm">{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('documentIdLabel')}</Label><Input value={editingUser.documentId} onChange={(e) => setEditingUser({...editingUser, documentId: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('birthDateLabel')}</Label><Input type="date" value={editingUser.birthDate} onChange={(e) => setEditingUser({...editingUser, birthDate: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('phoneLabel')}</Label><Input value={editingUser.phone} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('roleLabelAdmin')}</Label>
                <Select value={editingUser.role} onValueChange={(value) => setEditingUser({...editingUser, role: value })}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{userRoles.map(role => <SelectItem key={role.value} value={role.value} className="text-sm">{role.label}</SelectItem>)}</SelectContent>
                </Select></div>
                {editingUser.role === 'medical_center' && (
                  <div><Label className="font-medium text-slate-700 text-sm">{t('medicalCenterNameLabelAdmin')}</Label><Input value={editingUser.medicalCenterName || ''} onChange={(e) => setEditingUser({...editingUser, medicalCenterName: e.target.value})} className="h-10 text-sm"/></div>
                )}
                <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-3">
                  <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={() => setEditingUser(null)}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm" onClick={() => handleSaveUser(editingUser)}><Save className="mr-1.5 h-4 w-4"/>{t('saveButton')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {(editingVaccine && selectedUserForVaccine) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-lg bg-white shadow-2xl max-h-[90vh] rounded-lg">
              <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-blue-800">{editingVaccine.id ? t('editVaccineModalTitle', {name: allUsersData.find(u=>u.id === selectedUserForVaccine)?.firstName}) : t('addVaccineModalTitle', {name: allUsersData.find(u=>u.id === selectedUserForVaccine)?.firstName})}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
                <div><Label className="font-medium text-slate-700 text-sm">{t('vaccineNameLabel')}</Label>
                <Select value={editingVaccine.vaccineName} onValueChange={(value) => setEditingVaccine({...editingVaccine, vaccineName: value})}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('selectVaccinePlaceholder')}/></SelectTrigger>
                    <SelectContent className="max-h-48 sm:max-h-52">{vaccineNames.map(v => <SelectItem key={v} value={v} className="text-sm">{v}</SelectItem>)}</SelectContent>
                </Select></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('doseLabel')}</Label>
                <Select value={editingVaccine.dose} onValueChange={(value) => setEditingVaccine({...editingVaccine, dose: value})}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('selectDosePlaceholder')}/></SelectTrigger>
                    <SelectContent className="max-h-48 sm:max-h-52">{vaccineDoses.map(d => <SelectItem key={d} value={d} className="text-sm">{d}</SelectItem>)}</SelectContent>
                </Select></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('vaccinationDateFormLabel')}</Label><Input type="date" value={editingVaccine.vaccinationDate} onChange={(e) => setEditingVaccine({...editingVaccine, vaccinationDate: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('vaccineLotFormLabel')}</Label><Input value={editingVaccine.vaccineLot} onChange={(e) => setEditingVaccine({...editingVaccine, vaccineLot: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('vaccinationPlaceFormLabel')}</Label><Input value={editingVaccine.vaccinationPlace} onChange={(e) => setEditingVaccine({...editingVaccine, vaccinationPlace: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('healthProfessionalLabel')}</Label><Input value={editingVaccine.healthProfessional} onChange={(e) => setEditingVaccine({...editingVaccine, healthProfessional: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('vaccineProofLabel')}</Label><Input type="file" accept="image/*,.pdf" className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" onChange={(e) => setEditingVaccine({...editingVaccine, vaccineProofUrl: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : (editingVaccine.vaccineProofUrl || '') })} />
                 {editingVaccine.vaccineProofUrl && (
                    <p className="text-xs text-blue-600 mt-1">{t('currentFile')}: <a href={editingVaccine.vaccineProofUrl} target="_blank" rel="noopener noreferrer" className="underline">Ver/Descargar</a></p>
                )}</div>
                <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-3">
                  <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={() => { setEditingVaccine(null); setSelectedUserForVaccine(null);}}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm" onClick={() => handleSaveVaccine(selectedUserForVaccine, editingVaccine)}><Save className="mr-1.5 h-4 w-4"/>{t('saveButton')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showCreateUserModal && (
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
                  <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={() => setShowCreateUserModal(false)}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm" onClick={handleCreateUser}><CheckCircle className="mr-1.5 h-4 w-4"/>{t('createButton')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;