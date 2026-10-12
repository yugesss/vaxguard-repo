import { batchSeeds, storageUnits } from '../data/batches.ts';

export function useBatches() {
  const batches = batchSeeds;
  const units = storageUnits;

  const groupedByUnit = units.reduce((acc, unit) => {
    acc[unit.id] = batches.filter((batch) => batch.unitId === unit.id);
    return acc;
  }, {});

  return {
    batches,
    units,
    loading: false,
    error: null,
    slotMap: groupedByUnit,
  };
}
