export type BatchRecord = {
  uid: string;
  vaccineName: string;
  batchNo: string;
  manufactureDate: string;
  expiryDate: string;
  quantityDoses: number;
  dosesPerVial: number;
  unitId: string;
  slotId: string;
  status?: 'ok' | 'quarantined' | 'reserved';
  source: 'simulated';
};

export const batchSeeds: BatchRecord[] = [
  { uid: 'VG-B-2026-000417', vaccineName: 'Pentavalent (DTP-HepB-Hib)', batchNo: 'PT-417', manufactureDate: '2025-01-15', expiryDate: '2026-10-07', quantityDoses: 210, dosesPerVial: 10, unitId: 'ILR-01', slotId: 'A1', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000422', vaccineName: 'Pentavalent (DTP-HepB-Hib)', batchNo: 'PT-422', manufactureDate: '2025-03-08', expiryDate: '2026-10-28', quantityDoses: 180, dosesPerVial: 10, unitId: 'ILR-01', slotId: 'A2', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000431', vaccineName: 'Measles-Rubella', batchNo: 'MR-431', manufactureDate: '2025-04-18', expiryDate: '2026-11-14', quantityDoses: 160, dosesPerVial: 10, unitId: 'ILR-01', slotId: 'A3', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000439', vaccineName: 'BCG', batchNo: 'BCG-439', manufactureDate: '2024-11-02', expiryDate: '2026-12-12', quantityDoses: 90, dosesPerVial: 20, unitId: 'ILR-01', slotId: 'A4', status: 'reserved', source: 'simulated' },
  { uid: 'VG-B-2026-000442', vaccineName: 'OPV', batchNo: 'OPV-442', manufactureDate: '2025-02-17', expiryDate: '2026-09-15', quantityDoses: 140, dosesPerVial: 20, unitId: 'ILR-01', slotId: 'A5', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000455', vaccineName: 'Td', batchNo: 'TD-455', manufactureDate: '2025-08-22', expiryDate: '2027-01-18', quantityDoses: 150, dosesPerVial: 10, unitId: 'ILR-01', slotId: 'A6', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000467', vaccineName: 'Pentavalent (DTP-HepB-Hib)', batchNo: 'PT-467', manufactureDate: '2025-05-04', expiryDate: '2026-10-18', quantityDoses: 120, dosesPerVial: 10, unitId: 'Cold Room A', slotId: 'B1', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000470', vaccineName: 'Measles-Rubella', batchNo: 'MR-470', manufactureDate: '2025-09-03', expiryDate: '2026-12-22', quantityDoses: 95, dosesPerVial: 10, unitId: 'Cold Room A', slotId: 'B2', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000473', vaccineName: 'BCG', batchNo: 'BCG-473', manufactureDate: '2024-10-20', expiryDate: '2026-09-28', quantityDoses: 85, dosesPerVial: 20, unitId: 'Cold Room A', slotId: 'B3', status: 'quarantined', source: 'simulated' },
  { uid: 'VG-B-2026-000480', vaccineName: 'OPV', batchNo: 'OPV-480', manufactureDate: '2025-06-11', expiryDate: '2027-02-07', quantityDoses: 220, dosesPerVial: 20, unitId: 'Cold Room A', slotId: 'B4', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000486', vaccineName: 'Td', batchNo: 'TD-486', manufactureDate: '2025-02-05', expiryDate: '2026-11-02', quantityDoses: 170, dosesPerVial: 10, unitId: 'Cold Room A', slotId: 'B5', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000492', vaccineName: 'Pentavalent (DTP-HepB-Hib)', batchNo: 'PT-492', manufactureDate: '2025-10-22', expiryDate: '2027-04-10', quantityDoses: 130, dosesPerVial: 10, unitId: 'Cold Room A', slotId: 'B6', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000502', vaccineName: 'Measles-Rubella', batchNo: 'MR-502', manufactureDate: '2025-01-20', expiryDate: '2026-10-05', quantityDoses: 110, dosesPerVial: 10, unitId: 'Freezer-02', slotId: 'C1', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000509', vaccineName: 'BCG', batchNo: 'BCG-509', manufactureDate: '2024-09-29', expiryDate: '2026-10-11', quantityDoses: 60, dosesPerVial: 20, unitId: 'Freezer-02', slotId: 'C2', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000516', vaccineName: 'OPV', batchNo: 'OPV-516', manufactureDate: '2025-07-09', expiryDate: '2026-12-18', quantityDoses: 190, dosesPerVial: 20, unitId: 'Freezer-02', slotId: 'C3', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000521', vaccineName: 'Td', batchNo: 'TD-521', manufactureDate: '2025-12-16', expiryDate: '2027-03-01', quantityDoses: 80, dosesPerVial: 10, unitId: 'Freezer-02', slotId: 'C4', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000528', vaccineName: 'Pentavalent (DTP-HepB-Hib)', batchNo: 'PT-528', manufactureDate: '2024-08-17', expiryDate: '2026-08-22', quantityDoses: 105, dosesPerVial: 10, unitId: 'Freezer-02', slotId: 'C5', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000533', vaccineName: 'Measles-Rubella', batchNo: 'MR-533', manufactureDate: '2025-11-16', expiryDate: '2027-01-19', quantityDoses: 145, dosesPerVial: 10, unitId: 'Freezer-02', slotId: 'C6', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000541', vaccineName: 'BCG', batchNo: 'BCG-541', manufactureDate: '2025-03-02', expiryDate: '2026-12-03', quantityDoses: 78, dosesPerVial: 20, unitId: 'ILR-01', slotId: 'A7', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000548', vaccineName: 'Td', batchNo: 'TD-548', manufactureDate: '2025-09-14', expiryDate: '2026-12-08', quantityDoses: 116, dosesPerVial: 10, unitId: 'Cold Room A', slotId: 'B7', status: 'reserved', source: 'simulated' },
  { uid: 'VG-B-2026-000553', vaccineName: 'OPV', batchNo: 'OPV-553', manufactureDate: '2025-02-07', expiryDate: '2026-10-25', quantityDoses: 110, dosesPerVial: 20, unitId: 'Freezer-02', slotId: 'C7', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000562', vaccineName: 'Pentavalent (DTP-HepB-Hib)', batchNo: 'PT-562', manufactureDate: '2025-03-16', expiryDate: '2026-10-09', quantityDoses: 88, dosesPerVial: 10, unitId: 'ILR-01', slotId: 'A8', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000569', vaccineName: 'Td', batchNo: 'TD-569', manufactureDate: '2025-04-12', expiryDate: '2026-12-21', quantityDoses: 134, dosesPerVial: 10, unitId: 'Cold Room A', slotId: 'B8', status: 'ok', source: 'simulated' },
  { uid: 'VG-B-2026-000576', vaccineName: 'BCG', batchNo: 'BCG-576', manufactureDate: '2024-12-09', expiryDate: '2026-09-30', quantityDoses: 68, dosesPerVial: 20, unitId: 'Freezer-02', slotId: 'C8', status: 'quarantined', source: 'simulated' },
];

export const storageUnits = [
  { id: 'ILR-01', name: 'ILR-01', temperature: '4.2°C', status: 'Stable', health: 'Normal', unitType: 'Deep freezer' },
  { id: 'Cold Room A', name: 'Cold Room A', temperature: '4.8°C', status: 'Watch', health: 'Watch', unitType: 'Cold room' },
  { id: 'Freezer-02', name: 'Freezer-02', temperature: '−18°C', status: 'Stable', health: 'Normal', unitType: 'Freezer' },
];

export const emptySlots = {
  'ILR-01': ['A9', 'A10'],
  'Cold Room A': ['B9'],
  'Freezer-02': ['C9', 'C10'],
};
