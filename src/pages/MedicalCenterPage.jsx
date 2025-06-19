import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Users, FileText, Download, Search, Edit, PlusCircle, UserPlus, FilePlus, Save, XCircle, CheckCircle, Globe, LogOut, Hotel as Hospital, UserCog, Trash2, Briefcase as BriefcaseMedical } from 'lucide-react';
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

const MedicalCenterPage = () => {
  const { t, i18n } = useTranslation();
  const { user: medicalCenterUser, register, addVaccineToUser, logout, addHealthProfessionalToMedicalCenter, updateHealthProfessionalForMedicalCenter, deleteHealthProfessionalForMedicalCenter } = useAuth();
  const navigate = useNavigate();

  const [allUsersData, setAllUsersData] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [searchTermUsers, setSearchTermUsers] = useState('');
  
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [selectedUserForVaccine, setSelectedUserForVaccine] = useState(null);

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    firstName: '', lastName: '', email: '', password: '', documentId: '', birthDate: '', phone: '', role: 'user', country: ''
  });

  const [showManageProfessionalsModal, setShowManageProfessionalsModal] = useState(false);
  const [healthProfessionals, setHealthProfessionals] = useState([]);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [newProfessionalForm, setNewProfessionalForm] = useState({ fullName: '', documentId: '', registrationNumber: '' });


  const vaccineDoses = ['1ra Dosis', '2da Dosis', '3ra Dosis', 'Refuerzo', 'Dosis Única', 'Refuerzo Anual'];
  const vaccineNames = [
    'COVID-19 (Pfizer-BioNTech)', 'COVID-19 (Moderna)', 'COVID-19 (AstraZeneca)', 
    'COVID-19 (Johnson & Johnson)', 'Influenza (Gripe)', 'Hepatitis B', 'Hepatitis A', 
    'Tétanos', 'Fiebre Amarilla', 'Sarampión', 'Rubéola', 'Paperas', 'Varicela', 
    'Neumococo', 'Meningococo', 'HPV (Virus del Papiloma Humano)', 'Otra'
  ];

  useEffect(() => {
    loadData();
    if (medicalCenterUser && medicalCenterUser.healthProfessionals) {
      setHealthProfessionals(medicalCenterUser.healthProfessionals);
    }
  }, [medicalCenterUser]);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const regularUsers = storedUsers.filter(u => u.role === 'user').map(u => ({
      ...u,
      vaccines: u.vaccines || []
    }));
    setAllUsersData(regularUsers);
    setDisplayUsers(regularUsers);
    if (medicalCenterUser && medicalCenterUser.healthProfessionals) {
      setHealthProfessionals(medicalCenterUser.healthProfessionals);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserForm.email || !newUserForm.password || !newUserForm.firstName || !newUserForm.documentId || !newUserForm.country) {
      toast({ title: t('error'), description: t('requiredFieldsError'), variant: "destructive" });
      return;
    }
    const result = await register({ ...newUserForm, role: 'user' }); 
    if (result.success) {
      toast({ title: t('patientCreatedToast'), description: t('patientCreatedDescToast') });
      setShowCreateUserModal(false);
      setNewUserForm({ firstName: '', lastName: '', email: '', password: '', documentId: '', birthDate: '', phone: '', role: 'user', country: '' });
      loadData();
    } else {
      toast({ title: t('errorCreatingPatientToast'), description: result.error, variant: "destructive" });
    }
  };

  const handleSaveVaccine = async (userId, vaccineToSave) => {
    const result = await addVaccineToUser(userId, vaccineToSave, 'medical_center');
    if (result.success) {
      loadData();
      setEditingVaccine(null);
      setSelectedUserForVaccine(null);
      toast({ title: t('vaccineRegisteredForPatientToast'), description: t('vaccineRegisteredForPatientDescToast') });
      
      const patient = allUsersData.find(u => u.id === userId);
      if (patient) {
        await handleGenerateSingleVaccineCertificate(patient, result.vaccine);
      }

    } else {
      toast({ title: t('errorRegisteringVaccineToast'), description: result.error, variant: "destructive" });
    }
  };

  const handleGenerateSingleVaccineCertificate = async (patient, vaccine) => {
    if (!patient || !vaccine) {
      toast({ title: t('error'), description: t('insufficientDataForCertificate'), variant: "destructive" });
      return;
    }
    const certificateData = {
      patientName: `${patient.firstName} ${patient.lastName}`,
      documentId: patient.documentId,
      birthDate: patient.birthDate,
      country: patient.country,
      vaccines: [vaccine], 
      issueDate: new Date().toISOString(),
      qrCode: `https://vacun.org/verify/vaccine/${vaccine.id}-${Date.now()}`,
      lang: i18n.language,
      t: t,
    };
    try {
      await generateCertificatePDF(certificateData);
      toast({ title: t('individualCertificateGeneratedToast'), description: t('individualCertificateGeneratedDescToast', { vaccineName: vaccine.vaccineName, patientName: patient.firstName }) });
    } catch (error) {
      toast({ title: t('errorGeneratingIndividualPDF'), description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    const filtered = allUsersData.filter(u => 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTermUsers.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTermUsers.toLowerCase()) ||
      u.documentId.includes(searchTermUsers) ||
      (u.country && u.country.toLowerCase().includes(searchTermUsers.toLowerCase()))
    );
    setDisplayUsers(filtered);
  }, [searchTermUsers, allUsersData]);

  const openAddVaccineModal = (userId) => {
    setSelectedUserForVaccine(userId);
    setEditingVaccine({ 
      vaccineName: '', 
      dose: '', 
      vaccinationDate: '', 
      vaccinationPlace: medicalCenterUser?.medicalCenterName || '', 
      healthProfessional: '', 
      vaccineLot: '', 
      vaccineProofUrl: '' 
    });
  };

  const handleSaveProfessional = async () => {
    if (!newProfessionalForm.fullName || !newProfessionalForm.documentId || !newProfessionalForm.registrationNumber) {
      toast({ title: t('error'), description: t('allFieldsProfessionalRequired'), variant: "destructive" });
      return;
    }
    let result;
    if (editingProfessional) {
      result = await updateHealthProfessionalForMedicalCenter(medicalCenterUser.id, editingProfessional.id, newProfessionalForm);
    } else {
      result = await addHealthProfessionalToMedicalCenter(medicalCenterUser.id, newProfessionalForm);
    }

    if (result.success) {
      toast({ 
        title: editingProfessional ? t('professionalUpdatedToast') : t('professionalAddedToast'), 
        description: editingProfessional ? t('professionalUpdatedDescToast') : t('professionalAddedDescToast') 
      });
      setNewProfessionalForm({ fullName: '', documentId: '', registrationNumber: '' });
      setEditingProfessional(null);
      loadData(); 
    } else {
      toast({ title: t('error'), description: result.error, variant: "destructive" });
    }
  };

  const handleEditProfessional = (prof) => {
    setEditingProfessional(prof);
    setNewProfessionalForm({ fullName: prof.fullName, documentId: prof.documentId, registrationNumber: prof.registrationNumber });
  };

  const handleDeleteProfessional = async (profId) => {
    if (window.confirm(t('confirmDeleteProfessional'))) {
      const result = await deleteHealthProfessionalForMedicalCenter(medicalCenterUser.id, profId);
      if (result.success) {
        toast({ title: t('professionalDeletedToast'), description: t('professionalDeletedDescToast') });
        loadData();
      } else {
        toast({ title: t('error'), description: result.error, variant: "destructive" });
      }
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Hospital className="h-7 w-7 sm:h-8 sm:w-8 text-green-700" />
            <span className="text-xl sm:text-2xl font-bold text-green-800">Vacun.org</span>
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{t('roleMedicalCenter').toUpperCase()}</span>
          </Link>
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm" onClick={() => setShowManageProfessionalsModal(true)}>
              <UserCog className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('manageProfessionalsButton')}
            </Button>
            <span className="text-sm text-slate-700 hidden sm:inline">{t('medicalCenterHeaderName', { name: medicalCenterUser?.medicalCenterName || medicalCenterUser?.email })}</span>
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm" onClick={handleLogout}>
              <LogOut className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800">{t('medicalCenterPageTitle')}</h1>
          <p className="text-slate-600 mt-1">{t('medicalCenterPageSubtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <Card className="shadow-xl border-slate-200 bg-white rounded-xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-5 sm:p-6 bg-slate-50 rounded-t-xl">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-green-800">{t('patientManagement')}</CardTitle>
                <CardDescription className="text-slate-600 mt-1 text-sm sm:text-base">{t('patientManagementDesc')}</CardDescription>
              </div>
              <Button onClick={() => setShowCreateUserModal(true)} className="bg-green-700 hover:bg-green-800 text-white text-sm sm:text-base self-start sm:self-center">
                <UserPlus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"/>{t('registerPatientButton')}
              </Button>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <div className="relative mb-5 sm:mb-6">
                <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <Input placeholder={t('searchPatientPlaceholder')} value={searchTermUsers} onChange={(e) => setSearchTermUsers(e.target.value)} className="pl-10 sm:pl-12 py-2.5 sm:py-3 text-sm sm:text-base h-10 sm:h-11" />
              </div>
              <div className="space-y-4 sm:space-y-5 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
                {displayUsers.map(u => (
                  <div key={u.id} className="p-4 sm:p-5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <p className="text-base sm:text-lg font-semibold text-green-700">{u.firstName} {u.lastName}</p>
                        <p className="text-xs sm:text-sm text-slate-600 truncate max-w-xs sm:max-w-md">{u.email}</p>
                        <p className="text-xs sm:text-sm text-slate-500">ID: {u.documentId} | {t('countryLabel')}: {u.country || 'N/A'}</p>
                        <p className="text-xs sm:text-sm text-green-600 font-medium">{t('registeredVaccinesCount', { count: u.vaccines?.length || 0 })}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 self-start sm:self-center">
                        <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50 text-xs" onClick={() => openAddVaccineModal(u.id)}><FilePlus className="mr-1 h-3.5 w-3.5"/>{t('registerVaccineButton')}</Button>
                      </div>
                    </div>
                  </div>
                ))}
                 {displayUsers.length === 0 && <p className="text-center text-slate-500 py-4 text-sm sm:text-base">{t('noPatientsFound')}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {showCreateUserModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-lg bg-white shadow-2xl max-h-[90vh] rounded-lg">
              <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg"><CardTitle className="text-lg sm:text-xl text-green-800">{t('registerNewPatientTitle')}</CardTitle></CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
                <div><Label className="font-medium text-slate-700 text-sm">{t('firstNameLabel')}*</Label><Input value={newUserForm.firstName} onChange={(e) => setNewUserForm({...newUserForm, firstName: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('lastNameLabel')}</Label><Input value={newUserForm.lastName} onChange={(e) => setNewUserForm({...newUserForm, lastName: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('emailLabel')}*</Label><Input type="email" value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('tempPasswordLabel')}</Label><Input type="password" value={newUserForm.password} onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('countryLabel')}*</Label>
                  <Select value={newUserForm.country} onValueChange={(value) => setNewUserForm({...newUserForm, country: value })}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('countryPlaceholder')} /></SelectTrigger>
                    <SelectContent className="max-h-48 sm:max-h-52">{countries.map(c => <SelectItem key={c.code} value={c.name} className="text-sm">{c.name}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('documentIdLabel')}*</Label><Input value={newUserForm.documentId} onChange={(e) => setNewUserForm({...newUserForm, documentId: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('birthDateLabel')}</Label><Input type="date" value={newUserForm.birthDate} onChange={(e) => setNewUserForm({...newUserForm, birthDate: e.target.value})} className="h-10 text-sm"/></div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('phoneLabel')}</Label><Input value={newUserForm.phone} onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})} className="h-10 text-sm"/></div>
                <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-3">
                  <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={() => setShowCreateUserModal(false)}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm" onClick={handleCreateUser}><CheckCircle className="mr-1.5 h-4 w-4"/>{t('registerPatientModalButton')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {(editingVaccine && selectedUserForVaccine) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-lg bg-white shadow-2xl max-h-[90vh] rounded-lg">
              <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-green-800">{t('registerVaccineForPatientTitle', { name: allUsersData.find(u=>u.id === selectedUserForVaccine)?.firstName })}</CardTitle>
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
                <div><Label className="font-medium text-slate-700 text-sm">{t('healthProfessionalLabel')}</Label>
                  <Select value={editingVaccine.healthProfessional} onValueChange={(value) => setEditingVaccine({...editingVaccine, healthProfessional: value})}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue placeholder={t('selectProfessionalPlaceholder')}/></SelectTrigger>
                      <SelectContent className="max-h-48 sm:max-h-52">
                        {(healthProfessionals || []).map(prof => <SelectItem key={prof.id} value={prof.fullName} className="text-sm">{prof.fullName}</SelectItem>)}
                        <SelectItem value={medicalCenterUser?.firstName + ' ' + medicalCenterUser?.lastName} className="text-sm italic">{t('myselfOption', { name: `${medicalCenterUser?.firstName} ${medicalCenterUser?.lastName}` })}</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div><Label className="font-medium text-slate-700 text-sm">{t('vaccineProofLabel')}</Label><Input type="file" accept="image/*,.pdf" className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" onChange={(e) => setEditingVaccine({...editingVaccine, vaccineProofUrl: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : '' })} /></div>
                <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-3">
                  <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 text-xs sm:text-sm" onClick={() => { setEditingVaccine(null); setSelectedUserForVaccine(null);}}><XCircle className="mr-1.5 h-4 w-4"/>{t('cancelButton')}</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm" onClick={() => handleSaveVaccine(selectedUserForVaccine, editingVaccine)}><Save className="mr-1.5 h-4 w-4"/>{t('registerVaccineButton')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showManageProfessionalsModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl bg-white shadow-2xl max-h-[90vh] rounded-lg">
              <CardHeader className="bg-slate-50 p-4 sm:p-5 rounded-t-lg flex justify-between items-center">
                <CardTitle className="text-lg sm:text-xl text-green-800">{t('manageHealthProfessionalsTitle')}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => {setShowManageProfessionalsModal(false); setEditingProfessional(null); setNewProfessionalForm({ fullName: '', documentId: '', registrationNumber: '' });}}><XCircle className="h-5 w-5 text-slate-500"/></Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div><Label className="font-medium text-slate-700 text-sm">{t('fullNameLabel')}</Label><Input value={newProfessionalForm.fullName} onChange={(e) => setNewProfessionalForm({...newProfessionalForm, fullName: e.target.value})} className="h-10 text-sm"/></div>
                  <div><Label className="font-medium text-slate-700 text-sm">{t('professionalDocIdLabel')}</Label><Input value={newProfessionalForm.documentId} onChange={(e) => setNewProfessionalForm({...newProfessionalForm, documentId: e.target.value})} className="h-10 text-sm"/></div>
                  <div><Label className="font-medium text-slate-700 text-sm">{t('professionalRegNoLabel')}</Label><Input value={newProfessionalForm.registrationNumber} onChange={(e) => setNewProfessionalForm({...newProfessionalForm, registrationNumber: e.target.value})} className="h-10 text-sm"/></div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm self-end h-10" onClick={handleSaveProfessional}>
                    {editingProfessional ? <><Save className="mr-1.5 h-4 w-4"/>{t('updateButton')}</> : <><PlusCircle className="mr-1.5 h-4 w-4"/>{t('addButton')}</>}
                  </Button>
                </div>
                {editingProfessional && <Button variant="outline" size="sm" onClick={() => {setEditingProfessional(null); setNewProfessionalForm({ fullName: '', documentId: '', registrationNumber: '' });}}>{t('cancelEditButton')}</Button>}
                <hr className="my-4"/>
                <h3 className="text-md font-semibold text-slate-700">{t('registeredProfessionals')}</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(healthProfessionals || []).length === 0 && <p className="text-sm text-slate-500">{t('noProfessionalsRegistered')}</p>}
                  {(healthProfessionals || []).map(prof => (
                    <div key={prof.id} className="flex justify-between items-center p-2 border rounded-md bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{prof.fullName}</p>
                        <p className="text-xs text-slate-600">ID: {prof.documentId} | Reg: {prof.registrationNumber}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 hover:text-blue-600" onClick={() => handleEditProfessional(prof)}><Edit className="h-4 w-4"/></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 hover:text-red-600" onClick={() => handleDeleteProfessional(prof.id)}><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default MedicalCenterPage;