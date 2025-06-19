import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

const generateTemporaryPassword = (documentId) => {
  return `vacun${documentId}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('vacun_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (loginIdentifier, password) => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userAccount = users.find(u => (u.email === loginIdentifier || u.documentId === loginIdentifier) && u.password === password);
    
    if (userAccount) {
      const userWithoutPassword = { ...userAccount };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('vacun_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Credenciales inválidas o usuario no encontrado.' };
  };

  const register = async (userData) => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    
    if (userData.email && users.find(u => u.email === userData.email)) {
      return { success: false, error: 'El email ya está registrado' };
    }

    if (users.find(u => u.documentId === userData.documentId)) {
      return { success: false, error: 'El documento ya está registrado' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      email: userData.email || `${userData.documentId}@vacun.org`, 
      role: userData.role || (userData.email === 'admin@vacun.org' ? 'admin' : 'user'),
      createdAt: new Date().toISOString(),
      vaccines: [],
      dependents: [], 
      healthProfessionals: userData.role === 'medical_center' ? [] : undefined,
      isConvertedDependent: userData.isConvertedDependent || false,
      mainAccountId: userData.mainAccountId || null,
    };

    users.push(newUser);
    localStorage.setItem('vacun_users', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    
    if (userData.role !== 'medical_center' && userData.role !== 'admin' && !userData.isConvertedDependent) { 
      setUser(userWithoutPassword);
      localStorage.setItem('vacun_user', JSON.stringify(userWithoutPassword));
    }

    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vacun_user');
  };

  const updateUser = (updatedUserData) => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = users.findIndex(u => u.id === updatedUserData.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUserData };
      localStorage.setItem('vacun_users', JSON.stringify(users));
      
      const userWithoutPassword = { ...users[userIndex] };
      delete userWithoutPassword.password;
      
      if (user && user.id === updatedUserData.id) {
        setUser(userWithoutPassword);
        localStorage.setItem('vacun_user', JSON.stringify(userWithoutPassword));
      }
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Usuario no encontrado' };
  };

  const deleteUser = (userIdToDelete) => {
    let users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const initialLength = users.length;
    users = users.filter(u => u.id !== userIdToDelete);
    
    if (users.length < initialLength) {
      localStorage.setItem('vacun_users', JSON.stringify(users));
      if (user && user.id === userIdToDelete) {
        logout();
      }
      return { success: true };
    }
    return { success: false, error: 'Usuario no encontrado' };
  };


  const addVaccineToUser = (userId, vaccineData, actingUserRole = 'user') => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      const vaccineWithId = { ...vaccineData, id: Date.now().toString() };
      users[userIndex].vaccines = [...(users[userIndex].vaccines || []), vaccineWithId];
      localStorage.setItem('vacun_users', JSON.stringify(users));
      
      if (user && user.id === userId && (actingUserRole === 'user' || actingUserRole === 'dependent_converted')) {
        const updatedCurrentUser = { ...users[userIndex] };
        delete updatedCurrentUser.password;
        setUser(updatedCurrentUser);
        localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
      }
      return { success: true, vaccine: vaccineWithId };
    }
    return { success: false, error: 'Usuario no encontrado' };
  };

  const updateVaccineForUser = (userId, vaccineId, updatedVaccineData, actingUserRole = 'user') => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      const vaccineIndex = users[userIndex].vaccines.findIndex(v => v.id === vaccineId);
      if (vaccineIndex !== -1) {
        users[userIndex].vaccines[vaccineIndex] = { ...users[userIndex].vaccines[vaccineIndex], ...updatedVaccineData };
        localStorage.setItem('vacun_users', JSON.stringify(users));

        if (user && user.id === userId && (actingUserRole === 'user' || actingUserRole === 'dependent_converted')) {
          const updatedCurrentUser = { ...users[userIndex] };
          delete updatedCurrentUser.password;
          setUser(updatedCurrentUser);
          localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
        }
        return { success: true };
      }
      return { success: false, error: 'Vacuna no encontrada' };
    }
    return { success: false, error: 'Usuario no encontrado' };
  };

  const deleteVaccineForUser = (userId, vaccineId, actingUserRole = 'user') => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].vaccines = users[userIndex].vaccines.filter(v => v.id !== vaccineId);
      localStorage.setItem('vacun_users', JSON.stringify(users));

      if (user && user.id === userId && (actingUserRole === 'user' || actingUserRole === 'dependent_converted')) {
        const updatedCurrentUser = { ...users[userIndex] };
        delete updatedCurrentUser.password;
        setUser(updatedCurrentUser);
        localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
      }
      return { success: true };
    }
    return { success: false, error: 'Usuario no encontrado' };
  };

  const addDependentToUser = async (mainUserId, dependentData) => {
    const tempPassword = generateTemporaryPassword(dependentData.documentId);
    const dependentAsUserData = {
      ...dependentData,
      email: `${dependentData.documentId}@vacun.org`, 
      password: tempPassword,
      role: 'user',
      isConvertedDependent: true,
      mainAccountId: mainUserId,
      dependents: [], 
    };

    const registrationResult = await register(dependentAsUserData);

    if (registrationResult.success) {
      const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const mainUserIndex = users.findIndex(u => u.id === mainUserId);
      if (mainUserIndex !== -1) {
        users[mainUserIndex].dependents = [...(users[mainUserIndex].dependents || []), registrationResult.user.id];
        localStorage.setItem('vacun_users', JSON.stringify(users));
        if (user && user.id === mainUserId) {
          const updatedCurrentUser = { ...users[mainUserIndex] };
          delete updatedCurrentUser.password;
          setUser(updatedCurrentUser);
          localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
        }
      }
      return { success: true, user: registrationResult.user, tempPassword: tempPassword };
    } else {
      return { success: false, error: registrationResult.error || 'No se pudo registrar el familiar como usuario.' };
    }
  };
  
  const updateDependentForUser = async (mainUserId, dependentId, updatedDependentData) => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const dependentUserIndex = users.findIndex(u => u.id === dependentId && u.mainAccountId === mainUserId);

    if (dependentUserIndex !== -1) {
      const { relationship, ...userDataToUpdate } = updatedDependentData; 
      users[dependentUserIndex] = { ...users[dependentUserIndex], ...userDataToUpdate, relationship: updatedDependentData.relationship };
      localStorage.setItem('vacun_users', JSON.stringify(users));
      
      if (user && user.id === mainUserId) {
         const mainUser = users.find(u => u.id === mainUserId);
         if(mainUser){
            const updatedCurrentUser = { ...mainUser };
            delete updatedCurrentUser.password;
            setUser(updatedCurrentUser);
            localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
         }
      }
      return { success: true, user: users[dependentUserIndex] };
    }
    return { success: false, error: 'Familiar (usuario) no encontrado para actualizar.' };
  };

  const deleteDependentForUser = async (mainUserId, dependentId) => {
    const deletionResult = await deleteUser(dependentId); 

    if (deletionResult.success) {
      const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
      const mainUserIndex = users.findIndex(u => u.id === mainUserId);
      if (mainUserIndex !== -1) {
        users[mainUserIndex].dependents = (users[mainUserIndex].dependents || []).filter(id => id !== dependentId);
        localStorage.setItem('vacun_users', JSON.stringify(users));
        if (user && user.id === mainUserId) {
          const updatedCurrentUser = { ...users[mainUserIndex] };
          delete updatedCurrentUser.password;
          setUser(updatedCurrentUser);
          localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
        }
      }
      return { success: true };
    }
    return { success: false, error: 'No se pudo eliminar el familiar (usuario).' };
  };
  
  const addVaccineToDependent = async (mainUserId, dependentId, vaccineData) => {
    return addVaccineToUser(dependentId, vaccineData, 'dependent_converted');
  };

  const updateVaccineForDependent = async (mainUserId, dependentId, vaccineId, updatedVaccineData) => {
    return updateVaccineForUser(dependentId, vaccineId, updatedVaccineData, 'dependent_converted');
  };

  const deleteVaccineForDependent = async (mainUserId, dependentId, vaccineId) => {
    return deleteVaccineForUser(dependentId, vaccineId, 'dependent_converted');
  };

  const addHealthProfessionalToMedicalCenter = (medicalCenterId, professionalData) => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const medicalCenterIndex = users.findIndex(u => u.id === medicalCenterId && u.role === 'medical_center');

    if (medicalCenterIndex !== -1) {
      const professionalWithId = { ...professionalData, id: `prof-${Date.now().toString()}` };
      users[medicalCenterIndex].healthProfessionals = [...(users[medicalCenterIndex].healthProfessionals || []), professionalWithId];
      localStorage.setItem('vacun_users', JSON.stringify(users));

      if (user && user.id === medicalCenterId) {
        const updatedCurrentUser = { ...users[medicalCenterIndex] };
        delete updatedCurrentUser.password;
        setUser(updatedCurrentUser);
        localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
      }
      return { success: true, professional: professionalWithId };
    }
    return { success: false, error: 'Centro médico no encontrado' };
  };

  const updateHealthProfessionalForMedicalCenter = (medicalCenterId, professionalId, updatedProfessionalData) => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const medicalCenterIndex = users.findIndex(u => u.id === medicalCenterId && u.role === 'medical_center');

    if (medicalCenterIndex !== -1) {
      const professionalIndex = users[medicalCenterIndex].healthProfessionals.findIndex(p => p.id === professionalId);
      if (professionalIndex !== -1) {
        users[medicalCenterIndex].healthProfessionals[professionalIndex] = { ...users[medicalCenterIndex].healthProfessionals[professionalIndex], ...updatedProfessionalData };
        localStorage.setItem('vacun_users', JSON.stringify(users));

        if (user && user.id === medicalCenterId) {
          const updatedCurrentUser = { ...users[medicalCenterIndex] };
          delete updatedCurrentUser.password;
          setUser(updatedCurrentUser);
          localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
        }
        return { success: true };
      }
      return { success: false, error: 'Profesional no encontrado' };
    }
    return { success: false, error: 'Centro médico no encontrado' };
  };

  const deleteHealthProfessionalForMedicalCenter = (medicalCenterId, professionalId) => {
    const users = JSON.parse(localStorage.getItem('vacun_users') || '[]');
    const medicalCenterIndex = users.findIndex(u => u.id === medicalCenterId && u.role === 'medical_center');

    if (medicalCenterIndex !== -1) {
      users[medicalCenterIndex].healthProfessionals = users[medicalCenterIndex].healthProfessionals.filter(p => p.id !== professionalId);
      localStorage.setItem('vacun_users', JSON.stringify(users));

      if (user && user.id === medicalCenterId) {
        const updatedCurrentUser = { ...users[medicalCenterIndex] };
        delete updatedCurrentUser.password;
        setUser(updatedCurrentUser);
        localStorage.setItem('vacun_user', JSON.stringify(updatedCurrentUser));
      }
      return { success: true };
    }
    return { success: false, error: 'Centro médico no encontrado' };
  };


  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    deleteUser,
    addVaccineToUser,
    updateVaccineForUser,
    deleteVaccineForUser,
    addDependentToUser,
    updateDependentForUser,
    deleteDependentForUser,
    addVaccineToDependent,
    updateVaccineForDependent,
    deleteVaccineForDependent,
    addHealthProfessionalToMedicalCenter,
    updateHealthProfessionalForMedicalCenter,
    deleteHealthProfessionalForMedicalCenter,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};