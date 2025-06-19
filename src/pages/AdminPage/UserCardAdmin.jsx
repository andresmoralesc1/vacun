import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Download, FilePlus, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VaccineListAdmin = ({ user, onEditVaccine, onDeleteVaccine }) => {
  const { t } = useTranslation();
  return (
    <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 pl-2 sm:pl-4 border-t border-slate-200">
      <h4 className="text-xs font-semibold text-slate-500 mb-1">{t('registeredVaccines')}</h4>
      {(user.vaccines || []).map(vac => (
        <div key={vac.id} className="text-xs sm:text-sm text-slate-700 flex justify-between items-center py-1 border-b border-slate-100 last:border-b-0">
          <div className="truncate max-w-[calc(100%-60px)]">
            <span className="font-medium">{vac.vaccineName}</span> ({vac.dose})
            <span className="text-xs text-slate-500 ml-1.5 sm:ml-2">{t('vaccinationDateLabel')}: {vac.vaccinationDate ? new Date(vac.vaccinationDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex gap-0.5 sm:gap-1">
            <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500 hover:text-blue-600" onClick={() => onEditVaccine(user, vac)}><Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></Button>
            <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 text-slate-500 hover:text-red-600" onClick={() => onDeleteVaccine(user, vac.id)}><Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4"/></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const UserCardAdmin = ({ user, onEdit, onAddVaccine, onDelete, onGenerateCertificate, roles, onEditVaccine, onDeleteVaccine }) => {
  const { t } = useTranslation();
  
  const getRoleInfo = (role, isConvertedDependent) => {
    if (isConvertedDependent) return { label: t('role_dependent_user'), style: 'bg-yellow-100 text-yellow-700' };
    switch (role) {
      case 'admin': return { label: t('role_admin'), style: 'bg-purple-100 text-purple-700' };
      case 'medical_center': return { label: t('role_medical_center'), style: 'bg-green-100 text-green-700' };
      default: return { label: t('role_user'), style: 'bg-sky-100 text-sky-700' };
    }
  };
  
  const roleInfo = getRoleInfo(user.role, user.isConvertedDependent);

  return (
    <div className="p-4 sm:p-5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
        <div className="flex-1 mb-2 sm:mb-0">
          <p className="text-base sm:text-lg font-semibold text-blue-700">{user.firstName} {user.lastName}
            <span className={`text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ml-2 ${roleInfo.style}`}>
              {roleInfo.label}
            </span>
          </p>
          <p className="text-xs sm:text-sm text-slate-600 truncate max-w-xs sm:max-w-md">{user.email}</p>
          <p className="text-xs sm:text-sm text-slate-500">ID: {user.documentId} | {t('countryLabel')}: {user.country || 'N/A'}</p>
          {user.isConvertedDependent && user.mainAccountId && (
             <p className="text-xs sm:text-sm text-slate-500 italic">{t('associatedWithAccount')}: {user.mainAccountId}</p>
          )}
          {(user.role === 'user') && <p className="text-xs sm:text-sm text-blue-600 font-medium">{t('userVaccinesCount')}: {user.vaccines?.length || 0}</p>}
          {user.role === 'medical_center' && user.medicalCenterName && <p className="text-xs sm:text-sm text-green-600 font-medium">{t('medicalCenterNameLabel')}: {user.medicalCenterName}</p>}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 self-start sm:self-center">
          <Button size="sm" variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100 text-xs" onClick={() => onEdit(user)}><Edit className="mr-1 h-3.5 w-3.5"/>{t('editButton')}</Button>
          {(user.role === 'user') && (
            <>
              <Button size="sm" variant="outline" className="border-sky-300 text-sky-600 hover:bg-sky-50 text-xs" onClick={() => onAddVaccine(user)}><FilePlus className="mr-1 h-3.5 w-3.5"/>{t('addVaccineShort')}</Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => onGenerateCertificate(user)}><Download className="mr-1 h-3.5 w-3.5"/>{t('certificateButton')}</Button>
            </>
          )}
          { user.id !== 'admin-0' && 
            <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 text-xs" onClick={() => onDelete(user)}><Trash2 className="mr-1 h-3.5 w-3.5"/>{t('deleteButton')}</Button>
          }
        </div>
      </div>
      {(user.role === 'user') && user.vaccines && user.vaccines.length > 0 && (
        <VaccineListAdmin user={user} onEditVaccine={onEditVaccine} onDeleteVaccine={onDeleteVaccine} />
      )}
    </div>
  );
};

export default UserCardAdmin;