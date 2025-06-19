import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Building, Baby } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminStats = ({ users }) => {
  const { t } = useTranslation();

  const totalUsers = users.filter(u => !u.isDependent).length;
  const totalDependents = users.filter(u => u.isDependent).length;
  const totalMedicalCenters = users.filter(u => u.role === 'medical_center').length;
  const totalVaccines = users.reduce((sum, u) => sum + (u.vaccines ? u.vaccines.length : 0), 0);

  const stats = [
    { title: t('totalUsersStat'), value: totalUsers, icon: Users, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { title: t('totalDependentsStat'), value: totalDependents, icon: Baby, color: "text-indigo-600", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },
    { title: t('totalVaccinesStat'), value: totalVaccines, icon: FileText, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { title: t('totalMedicalCentersStat'), value: totalMedicalCenters, icon: Building, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
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
  );
};

export default AdminStats;