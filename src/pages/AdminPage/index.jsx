import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { generateCertificatePDF } from '@/utils/pdfGenerator';

import AdminHeader from './AdminHeader';
import AdminStats from './AdminStats';
import UserManagementCard from './UserManagementCard';
import EditUserModal from './EditUserModal';
import CreateUserModal from './CreateUserModal';
import VaccineModalAdmin from './VaccineModalAdmin';


const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const { 
    register, updateUser, deleteUser, 
    addVaccineToUser, updateVaccineForUser, deleteVaccineForUser
  } = useAuth(); 

  const [allUsersData, setAllUsersData] = useState([]); 
  const [editingUser, setEditingUser] = useState(null);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [selectedUserForVaccine, setSelectedUserForVaccine] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const loadData = useCallback(() => {
    const storedUsers = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    setAllUsersData(storedUsers.map(u => ({...u, vaccines: u.vaccines || [] })));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(t('confirmDeleteUser'))) {
      const result = await deleteUser(userToDelete.id);
      if (result.success) {
        loadData();
        toast({ title: t('userDeletedToast'), description: t('userDeletedDescToast') });
      } else {
        toast({ title: t('deleteErrorToast'), description: result.error, variant: "destructive" });
      }
    }
  };

  const handleSaveVaccine = async (user, vaccineToSave) => {
    let result;
    const isEditing = !!vaccineToSave.id;

    if (isEditing) {
      result = await updateVaccineForUser(user.id, vaccineToSave.id, vaccineToSave, 'admin');
    } else {
      result = await addVaccineToUser(user.id, vaccineToSave, 'admin');
    }

    if(result.success) {
      loadData();
      setEditingVaccine(null);
      setSelectedUserForVaccine(null);
      toast({ title: t('vaccineSavedToast'), description: t('vaccineSavedDescToast') });
    } else {
      toast({ title: t('error'), description: result.error, variant: "destructive" });
    }
  };

  const handleDeleteVaccine = async (user, vaccineId) => {
    if (window.confirm(t('confirmDeleteVaccine'))) {
      const result = await deleteVaccineForUser(user.id, vaccineId, 'admin');
      if (result.success) {
        loadData();
        toast({ title: t('vaccineDeletedToastAdmin'), description: t('vaccineDeletedDescToastAdmin') });
      } else {
        toast({ title: t('error'), description: result.error, variant: "destructive" });
      }
    }
  };
  
  const handleCreateUser = async (newUserForm) => {
    const result = await register(newUserForm);
    if (result.success) {
      toast({ title: t('userCreatedToast'), description: t('userCreatedDescToast') });
      setShowCreateUserModal(false);
      loadData();
      return true;
    } else {
      toast({ title: t('createUserErrorToast'), description: result.error, variant: "destructive" });
      return false;
    }
  };

  const handleGenerateUnifiedCertificate = async (userToCertify) => {
    if (!userToCertify || !userToCertify.vaccines || userToCertify.vaccines.length === 0) {
      toast({ title: t('error'), description: t('noVaccinesForCertificateUser'), variant: "destructive" });
      return;
    }
    
    const qrCodeUrl = `https://vacun.org/verify/user/${userToCertify.id}-${Date.now()}`;

    const certificateData = {
      patientName: `${userToCertify.firstName} ${userToCertify.lastName}`,
      documentId: userToCertify.documentId,
      birthDate: userToCertify.birthDate,
      country: userToCertify.country,
      vaccines: userToCertify.vaccines,
      issueDate: new Date().toISOString(),
      qrCode: qrCodeUrl,
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

  const openAddVaccineModal = (user) => {
    setSelectedUserForVaccine(user);
    setEditingVaccine({ vaccineName: '', dose: '', vaccinationDate: '', vaccinationPlace: '', healthProfessional: '', vaccineLot: '', vaccineProofUrl: '' });
  };
  
  const openEditVaccineModal = (user, vaccine) => {
    setSelectedUserForVaccine(user);
    setEditingVaccine({...vaccine});
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800">{t('adminPageTitle')}</h1>
        </motion.div>

        <AdminStats users={allUsersData} />
        
        <UserManagementCard
          users={allUsersData}
          onAddUser={() => setShowCreateUserModal(true)}
          onEditUser={setEditingUser}
          onDeleteUser={handleDeleteUser}
          onAddVaccine={openAddVaccineModal}
          onEditVaccine={openEditVaccineModal}
          onDeleteVaccine={handleDeleteVaccine}
          onGenerateCertificate={handleGenerateUnifiedCertificate}
        />
      </div>

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {showCreateUserModal && (
        <CreateUserModal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onCreate={handleCreateUser}
        />
      )}
      
      {(editingVaccine && selectedUserForVaccine) && (
        <VaccineModalAdmin
          isOpen={!!(editingVaccine && selectedUserForVaccine)}
          user={selectedUserForVaccine}
          vaccine={editingVaccine}
          onClose={() => { setEditingVaccine(null); setSelectedUserForVaccine(null);}}
          onSave={handleSaveVaccine}
        />
      )}
    </div>
  );
};

export default AdminPage;