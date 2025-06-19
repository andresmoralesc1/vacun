import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import UserCardAdmin from './UserCardAdmin';

const UserManagementCard = ({ users, onAddUser, onEditUser, onDeleteUser, onAddVaccine, onEditVaccine, onDeleteVaccine, onGenerateCertificate }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayUsers, setDisplayUsers] = useState([]);

  useEffect(() => {
    const filtered = users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.documentId && u.documentId.includes(searchTerm)) ||
      (u.country && u.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.role && t(u.isConvertedDependent ? 'role_dependent_user' : `role_${u.role}`).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setDisplayUsers(filtered);
  }, [searchTerm, users, t]);

  const userRoles = [
    { value: 'user', label: t('role_user') },
    { value: 'dependent_user', label: t('role_dependent_user') },
    { value: 'medical_center', label: t('role_medical_center') },
    { value: 'admin', label: t('role_admin') }
  ];

  return (
    <Card className="shadow-xl border-slate-200 bg-white rounded-xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-5 sm:p-6 bg-slate-50 rounded-t-xl">
        <div>
          <CardTitle className="text-xl sm:text-2xl text-blue-800">{t('userManagement')}</CardTitle>
          <CardDescription className="text-slate-600 mt-1 text-sm sm:text-base">{t('userManagementDescAll')}</CardDescription>
        </div>
        <Button onClick={onAddUser} className="bg-blue-700 hover:bg-blue-800 text-white text-sm sm:text-base self-start sm:self-center">
          <UserPlus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />{t('createUser')}
        </Button>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <div className="relative mb-5 sm:mb-6">
          <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <Input placeholder={t('searchUserPlaceholderAll')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 sm:pl-12 py-2.5 sm:py-3 text-sm sm:text-base h-10 sm:h-11" />
        </div>
        <div className="space-y-4 sm:space-y-5 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
          {displayUsers.map(u => (
            <UserCardAdmin
              key={u.id}
              user={u}
              onEdit={onEditUser}
              onAddVaccine={onAddVaccine}
              onDelete={onDeleteUser}
              onGenerateCertificate={onGenerateCertificate}
              roles={userRoles}
              onEditVaccine={onEditVaccine}
              onDeleteVaccine={onDeleteVaccine}
            />
          ))}
          {displayUsers.length === 0 && <p className="text-center text-slate-500 py-4 text-sm sm:text-base">{t('noUsersFound')}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementCard;