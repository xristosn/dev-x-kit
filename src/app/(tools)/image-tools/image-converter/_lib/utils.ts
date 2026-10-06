export type ImageConverterStoreValue = {
  to: string;
  opaqueColor: string;
};

export const DEFAULT_IMAGE_CONVERTER_STORE_VALUE: ImageConverterStoreValue = {
  to: 'image/webp',
  opaqueColor: '#ffffff',
};

export const ConversionState = {
  None: 0,
  Active: 1,
  Ended: 2,
} as const;

export type ConversionState = (typeof ConversionState)[keyof typeof ConversionState];

export type ConvertedFile = {
  name: string;
  size: number;
  url?: string;
  error?: string;
};

export const MAX_FILES = 15;

export const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];

export const OPAQUE_MIME_TYPES = ['image/jpeg', 'image/bmp'];

export const MIME_TYPE_LABELS: Record<string, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'image/gif': 'GIF',
  'image/avif': 'AVIF',
  'image/svg+xml': 'SVG',
  'image/bmp': 'BMP',
  'image/tiff': 'TIFF',
  'image/x-icon': 'ICO',
};
