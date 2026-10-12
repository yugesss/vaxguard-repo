import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assignFefoIssueOrder,
  FEFO_STATUS,
  getDaysLeft,
  getFefoStatus,
  sortFefoRecords,
} from './fefo.ts';

test('tie-break sorts by earlier manufacture date, then smaller quantity', () => {
  const records = [
    { uid: 'VG-B-2026-000100', vaccineName: 'Pentavalent', batchNo: 'B100', manufactureDate: '2025-01-15', expiryDate: '2026-12-31', quantityDoses: 200, unitId: 'ILR-01', slotId: 'A1', dosesPerVial: 10, source: 'simulated' },
    { uid: 'VG-B-2026-000101', vaccineName: 'Pentavalent', batchNo: 'B101', manufactureDate: '2025-01-10', expiryDate: '2026-12-31', quantityDoses: 120, unitId: 'ILR-01', slotId: 'A2', dosesPerVial: 10, source: 'simulated' },
    { uid: 'VG-B-2026-000102', vaccineName: 'Pentavalent', batchNo: 'B102', manufactureDate: '2025-01-10', expiryDate: '2026-12-31', quantityDoses: 80, unitId: 'ILR-01', slotId: 'A3', dosesPerVial: 10, source: 'simulated' },
  ];

  const sorted = sortFefoRecords(records, new Date('2026-01-01T00:00:00+05:30'));
  assert.deepEqual(sorted.map((record) => record.uid), [
    'VG-B-2026-000102',
    'VG-B-2026-000101',
    'VG-B-2026-000100',
  ]);
});

test('expired batches are pinned to the top and excluded from issue order numbering', () => {
  const records = [
    { uid: 'VG-B-2026-000200', vaccineName: 'MR', batchNo: 'MR-02', manufactureDate: '2024-01-10', expiryDate: '2026-09-30', quantityDoses: 95, unitId: 'ILR-01', slotId: 'A3', dosesPerVial: 10, source: 'simulated' },
    { uid: 'VG-B-2026-000201', vaccineName: 'OPV', batchNo: 'OPV-01', manufactureDate: '2025-02-08', expiryDate: '2026-11-30', quantityDoses: 120, unitId: 'ILR-01', slotId: 'A4', dosesPerVial: 20, source: 'simulated' },
  ];

  const ordered = assignFefoIssueOrder(records, new Date('2026-10-05T00:00:00+05:30'));
  assert.equal(ordered[0].uid, 'VG-B-2026-000200');
  assert.equal(ordered[0].issueOrder, null);
  assert.equal(ordered[1].issueOrder, 1);
});

test('same-day expiry counts as 0 days left', () => {
  assert.equal(getDaysLeft('2026-10-05', new Date('2026-10-05T00:00:00+05:30')), 0);
  assert.equal(getFefoStatus(0), FEFO_STATUS.critical);
});

test('invalid records are marked as invalid and do not crash', () => {
  const invalid = [
    { uid: 'VG-B-2026-000300', vaccineName: 'BCG', batchNo: 'BCG-01', manufactureDate: '2027-02-01', expiryDate: '2026-12-31', quantityDoses: 50, unitId: 'ILR-01', slotId: 'A5', dosesPerVial: 20, source: 'simulated' },
  ];

  const sorted = sortFefoRecords(invalid, new Date('2026-10-05T00:00:00+05:30'));
  assert.equal(sorted[0].status, FEFO_STATUS.invalid);
});

test('month and leap-year boundary calculation stays correct', () => {
  assert.equal(getDaysLeft('2024-02-29', new Date('2024-02-28T00:00:00+05:30')), 1);
  assert.equal(getDaysLeft('2024-03-01', new Date('2024-02-29T00:00:00+05:30')), 1);
});
