const latamTemplate = [
  { id: 'bcg', name: 'BCG', age: 'Recién nacido', keywords: ['bcg'] },
  { id: 'hepb-1', name: 'Hepatitis B', age: 'Recién nacido', keywords: ['hepatitis b', 'hepb'] },
  { id: 'penta-1', name: 'Pentavalente (DTP/Hib/HepB)', age: '2 meses', keywords: ['penta', 'quíntuple', 'hexavalente', 'dtp', 'hib'] },
  { id: 'polio-1', name: 'Polio (IPV)', age: '2 meses', keywords: ['polio', 'ipv'] },
  { id: 'rota-1', name: 'Rotavirus', age: '2 meses', keywords: ['rotavirus'] },
  { id: 'neumo-1', name: 'Neumococo', age: '2 meses', keywords: ['neumococo', 'pcv'] },
  { id: 'penta-2', name: 'Pentavalente (DTP/Hib/HepB)', age: '4 meses', keywords: ['penta', 'quíntuple', 'hexavalente', 'dtp', 'hib'] },
  { id: 'polio-2', name: 'Polio (IPV)', age: '4 meses', keywords: ['polio', 'ipv'] },
  { id: 'rota-2', name: 'Rotavirus', age: '4 meses', keywords: ['rotavirus'] },
  { id: 'neumo-2', name: 'Neumococo', age: '4 meses', keywords: ['neumococo', 'pcv'] },
  { id: 'penta-3', name: 'Pentavalente (DTP/Hib/HepB)', age: '6 meses', keywords: ['penta', 'quíntuple', 'hexavalente', 'dtp', 'hib'] },
  { id: 'polio-3', name: 'Polio (IPV/OPV)', age: '6 meses', keywords: ['polio', 'opv'] },
  { id: 'flu-1', name: 'Influenza', age: '6 meses', keywords: ['influenza', 'gripe', 'flu'] },
  { id: 'flu-2', name: 'Influenza (2a dosis)', age: '7 meses', keywords: ['influenza', 'gripe', 'flu'] },
  { id: 'srp-1', name: 'SRP (Sarampión, Rubéola, Paperas)', age: '12 meses', keywords: ['triple viral', 'srp', 'mmr'] },
  { id: 'hepa', name: 'Hepatitis A', age: '12 meses', keywords: ['hepatitis a', 'hepa'] },
  { id: 'neumo-ref', name: 'Neumococo (Refuerzo)', age: '12 meses', keywords: ['neumococo', 'pcv'] },
  { id: 'varicela-1', name: 'Varicela', age: '12-15 meses', keywords: ['varicela'] },
  { id: 'yellow', name: 'Fiebre Amarilla (si aplica)', age: '12 meses', keywords: ['fiebre amarilla'] },
  { id: 'dtp-ref1', name: 'DTP (Refuerzo)', age: '18 meses', keywords: ['dpt', 'dtp', 'penta', 'quíntuple', 'hexavalente'] },
  { id: 'polio-ref1', name: 'Polio (Refuerzo)', age: '18 meses', keywords: ['polio', 'opv'] },
  { id: 'dtp-ref2', name: 'DTP (Refuerzo)', age: '4-6 años', keywords: ['dpt', 'dtp'] },
  { id: 'polio-ref2', name: 'Polio (Refuerzo)', age: '4-6 años', keywords: ['polio', 'opv'] },
  { id: 'srp-ref', name: 'SRP (Refuerzo)', age: '4-6 años', keywords: ['triple viral', 'srp', 'mmr'] },
  { id: 'vph', name: 'VPH (Virus del Papiloma Humano)', age: 'Desde los 9 años', keywords: ['vph', 'hpv', 'papiloma'] },
  { id: 'tdap', name: 'Tdap (Difteria, Tétanos, Tos ferina)', age: 'Desde los 10 años', keywords: ['tdap', 'dtpa'] },
  { id: 'mening', name: 'Meningococo ACWY', age: 'Desde los 11 años', keywords: ['meningococo', 'mening'] },
  { id: 'flu-anual', name: 'Influenza (Anual)', age: 'Anual', keywords: ['influenza', 'gripe', 'flu'] }
];

const american_countries_codes = ['AG', 'AR', 'BS', 'BB', 'BZ', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DM', 'DO', 'EC', 'SV', 'GD', 'GT', 'GY', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'PY', 'PE', 'KN', 'LC', 'VC', 'SR', 'TT', 'US', 'UY', 'VE'];

const generatedSchedules = {};

american_countries_codes.forEach(code => {
    generatedSchedules[code] = latamTemplate.map(vaccine => ({
        ...vaccine,
        id: `${code.toLowerCase()}-${vaccine.id}`
    }));
});

export const schedules = {
  ...generatedSchedules,
  DEFAULT: [
    { id: 'gen-bcg', name: 'BCG (Tuberculosis)', age: 'Recién nacido', keywords: ['bcg', 'tuberculosis'] },
    { id: 'gen-hepb', name: 'Hepatitis B', age: 'Recién nacido', keywords: ['hepatitis b', 'hepb'] },
    { id: 'gen-polio-1', name: 'Polio (IPV/OPV)', age: '2 meses', keywords: ['polio', 'ipv', 'opv'] },
    { id: 'gen-penta-1', name: 'Pentavalente (DTP+Hib+HepB)', age: '2 meses', keywords: ['pentavalente', 'dtp', 'hib', 'hepb'] },
    { id: 'gen-rota-1', name: 'Rotavirus', age: '2 meses', keywords: ['rotavirus'] },
    { id: 'gen-neumo-1', name: 'Neumococo conjugada', age: '2 meses', keywords: ['neumococo'] },
    { id: 'gen-vph', name: 'VPH (Virus del Papiloma Humano)', age: 'Desde los 9 años', keywords: ['vph', 'hpv', 'papiloma'] },
    { id: 'gen-tdap', name: 'Tdap (Refuerzo)', age: 'Desde los 10 años', keywords: ['tdap'] },
  ],
};


export const getVaccineListForCountry = (countryCode) => {
  const schedule = schedules[countryCode] || schedules['DEFAULT'];
  const vaccineNames = schedule.map(vaccine => {
    const match = vaccine.name.match(/^([^(]+)/);
    return match ? match[1].trim() : vaccine.name;
  });
  return [...new Set(vaccineNames)];
};