import { getBase64FileType } from '@/lib/actions/get-base64-file-type';

export type DecodeResult = {
  size: number;
  mimeType: string;
  fileUrl: string;
  displayName: string;
  preview: boolean;
};

const COMMON_MIME_DISPLAY_MAP: Record<string, string> = {
  'text/plain': 'Text File',
  'text/html': 'HTML Document',
  'application/pdf': 'PDF Document',
  'application/rtf': 'Rich Text Format (RTF)',
  'application/msword': 'Microsoft Word (DOC)',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'Microsoft Word (DOCX)',
  'application/vnd.ms-excel': 'Microsoft Excel (XLS)',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel (XLSX)',
  'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (PPT)',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'Microsoft PowerPoint (PPTX)',
  'text/csv': 'CSV File',

  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/gif': 'GIF Image',
  'image/bmp': 'Bitmap Image (BMP)',
  'image/webp': 'WebP Image',
  'image/svg+xml': 'SVG Vector Image',
  'image/tiff': 'TIFF Image',

  'audio/mpeg': 'MP3 Audio',
  'audio/wav': 'WAV Audio',
  'audio/ogg': 'Ogg Audio',
  'audio/aac': 'AAC Audio',

  'video/mp4': 'MP4 Video',
  'video/webm': 'WebM Video',
  'video/quicktime': 'QuickTime Video (MOV)',
  'video/x-msvideo': 'AVI Video',

  'application/zip': 'ZIP Archive',
  'application/x-rar-compressed': 'RAR Archive',
  'application/gzip': 'GZ Compressed File',
  'application/x-tar': 'TAR Archive',

  'application/json': 'JSON Data',
  'application/xml': 'XML Data',
  'application/octet-stream': 'Binary/Unknown File',
};

const SUPPORTED_PREVIEW_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',

  'application/xml',
  'application/json',

  'video/mp4',
  'video/webm',
  'video/ogg',

  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
];

function parseDataUri(dataUri: string) {
  if (!dataUri.startsWith('data:')) return null;

  const parts = dataUri.split(',');

  if (parts.length !== 2) return null;

  const match = parts[0].match(/:(.*?);/);
  if (!match) return null;

  return {
    mimeType: match[1],
    rawBase64: parts[1],
  };
}

function b64ToBlob(rawBase64: string, mimeType: string) {
  const binaryString = atob(rawBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

export async function base64ToFile(base64Input: string): Promise<DecodeResult> {
  if (!base64Input) {
    throw new Error('Input data cannot be empty.');
  }

  let rawBase64Data: string;
  let fileType: string;

  const uriData = parseDataUri(base64Input);

  if (uriData) {
    rawBase64Data = uriData.rawBase64;
    fileType = uriData.mimeType;
  } else {
    rawBase64Data = base64Input;
    fileType = await getBase64FileType(rawBase64Data);
  }

  const blob = b64ToBlob(rawBase64Data, fileType);

  return {
    size: blob.size,
    mimeType: blob.type,
    fileUrl: URL.createObjectURL(blob),
    displayName: COMMON_MIME_DISPLAY_MAP[blob.type] || blob.type,
    preview: SUPPORTED_PREVIEW_MIME_TYPES.includes(blob.type),
  };
}
