export interface ConvertedFile {
  name: string;
  size: number;
  url?: string;
  error?: string;
  sizeSavedRatio?: number;
}

export enum CompressionState {
  None,
  Active,
  Ended,
}

export interface ImageCompressStoreValue {
  quality: number;
}

export const DEFAULT_IMAGE_COMPRESS_STORE_VALUE: ImageCompressStoreValue = {
  quality: 0.8,
};

export const MAX_FILES = 15;
