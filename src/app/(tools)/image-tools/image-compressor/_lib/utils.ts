export type ConvertedFile = {
  name: string;
  size: number;
  url?: string;
  error?: string;
  sizeSavedRatio?: number;
};

export const CompressionState = {
  None: 0,
  Active: 1,
  Ended: 2,
} as const;

export type CompressionState = (typeof CompressionState)[keyof typeof CompressionState];

export type ImageCompressStoreValue = {
  quality: number;
};

export const DEFAULT_IMAGE_COMPRESS_STORE_VALUE: ImageCompressStoreValue = {
  quality: 0.8,
};

export const MAX_FILES = 15;
