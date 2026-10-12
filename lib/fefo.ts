export const FEFO_CRITICAL_DAYS = 7;
export const FEFO_HIGH_DAYS = 30;
export const FEFO_NORMAL_DAYS = 90;

export const FEFO_STATUS = {
  expired: 'expired',
  critical: 'critical',
  high: 'high',
  normal: 'normal',
  low: 'low',
  invalid: 'invalid',
} as const;

export function parseIsoDate(dateValue) {
  if (!dateValue) return null;
  const value = String(dateValue);
  const parsed = new Date(`${value}T00:00:00+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function startOfDayInIst(date = new Date()) {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getDaysLeft(expiryDate, today = new Date()) {
  const expiry = parseIsoDate(expiryDate);
  if (!expiry) return null;

  const current = startOfDayInIst(today);
  const expiryDay = startOfDayInIst(expiry);
  return Math.floor((expiryDay.getTime() - current.getTime()) / 86400000);
}

export function getFefoStatus(daysLeft) {
  if (daysLeft == null) return FEFO_STATUS.invalid;
  if (daysLeft < 0) return FEFO_STATUS.expired;
  if (daysLeft <= FEFO_CRITICAL_DAYS) return FEFO_STATUS.critical;
  if (daysLeft <= FEFO_HIGH_DAYS) return FEFO_STATUS.high;
  if (daysLeft <= FEFO_NORMAL_DAYS) return FEFO_STATUS.normal;
  return FEFO_STATUS.low;
}

export function formatFefoDate(dateValue) {
  const date = parseIsoDate(dateValue);
  if (!date) return 'Invalid date';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export function formatDaysLeft(daysLeft) {
  if (daysLeft == null) return '—';
  if (daysLeft < 0) return `${Math.abs(daysLeft)} d ago`;
  if (daysLeft === 0) return '0 d';
  return `${daysLeft} d`;
}

export function buildFefoRecord(record, today = new Date()) {
  const manufactureDate = parseIsoDate(record.manufactureDate);
  const expiryDate = parseIsoDate(record.expiryDate);
  const isValid = Boolean(manufactureDate && expiryDate && manufactureDate.getTime() < expiryDate.getTime());
  const daysLeft = isValid ? getDaysLeft(record.expiryDate, today) : null;
  const status = isValid ? getFefoStatus(daysLeft) : FEFO_STATUS.invalid;

  return {
    ...record,
    manufactureDate: record.manufactureDate,
    expiryDate: record.expiryDate,
    daysLeft,
    status,
    isValid,
    issueOrder: null,
    notice: status === FEFO_STATUS.expired ? 'Remove from use' : null,
  };
}

export function sortFefoRecords(records, today = new Date()) {
  return [...records]
    .map((record) => buildFefoRecord(record, today))
    .sort((left, right) => {
      const leftInvalid = !left.isValid;
      const rightInvalid = !right.isValid;

      if (leftInvalid && rightInvalid) {
        return left.uid.localeCompare(right.uid);
      }
      if (leftInvalid !== rightInvalid) {
        return rightInvalid ? -1 : 1;
      }

      const leftExpired = left.daysLeft < 0;
      const rightExpired = right.daysLeft < 0;
      if (leftExpired !== rightExpired) {
        return leftExpired ? -1 : 1;
      }

      if (left.daysLeft !== right.daysLeft) {
        return left.daysLeft - right.daysLeft;
      }

      const leftManufacture = parseIsoDate(left.manufactureDate)?.getTime() ?? Infinity;
      const rightManufacture = parseIsoDate(right.manufactureDate)?.getTime() ?? Infinity;
      if (leftManufacture !== rightManufacture) {
        return leftManufacture - rightManufacture;
      }

      if (left.quantityDoses !== right.quantityDoses) {
        return left.quantityDoses - right.quantityDoses;
      }

      return left.uid.localeCompare(right.uid);
    });
}

export function assignFefoIssueOrder(records, today = new Date()) {
  const sorted = sortFefoRecords(records, today)
    .map((record) => ({
      ...record,
      issueOrder: record.daysLeft < 0 ? null : 0,
    }));

  let currentOrder = 0;
  sorted.forEach((record) => {
    if (record.daysLeft >= 0) {
      currentOrder += 1;
      record.issueOrder = currentOrder;
    }
  });

  return sorted;
}
