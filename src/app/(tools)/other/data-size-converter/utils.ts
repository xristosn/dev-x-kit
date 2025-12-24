export enum DataSizeType {
  B = 'b',
  KB = 'kb',
  MB = 'mb',
  GB = 'gb',
  TB = 'tb',
  PB = 'pb',
}

export interface DataSizeStoreValue {
  type: DataSizeType;
  value: number;
  base: 1000 | 1024;
}

export const DEFAULT_DATA_SIZE_STORE_VALUE: DataSizeStoreValue = {
  type: DataSizeType.MB,
  value: 2,
  base: 1024,
};

export const DATA_SIZE_TYPES = [
  { value: DataSizeType.B, label: 'Bytes' },
  { value: DataSizeType.KB, label: 'Kilobytes' },
  { value: DataSizeType.MB, label: 'Megabytes' },
  { value: DataSizeType.GB, label: 'Gigabytes' },
  { value: DataSizeType.TB, label: 'Terabytes' },
  { value: DataSizeType.PB, label: 'Petabytes' },
];

export function convertDataSize(
  value: number,
  fromType: DataSizeType,
  toType: DataSizeType,
  base: 1000 | 1024 = 1024
): number {
  const types = DATA_SIZE_TYPES.map((type) => type.value);
  const fromIndex = types.indexOf(fromType);
  const toIndex = types.indexOf(toType);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Invalid data size type provided');
  }

  const difference = fromIndex - toIndex;

  const result = value * Math.pow(base, difference);

  if (Math.abs(result) < Number.EPSILON) {
    return 0;
  }

  return parseFloat(result.toFixed(10));
}
