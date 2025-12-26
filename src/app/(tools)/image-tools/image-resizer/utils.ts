export type ResizeMode = 'dimensions' | 'percentage' | 'social';

export type FitMode = 'cover' | 'fill' | 'contain';

export interface ImageResizerStoreValue {
  mode: ResizeMode;
  fit: FitMode;
  background: string;
  lockAspectRatio: boolean;
  socialPlatform: string;
  socialPreset: number;
  percentage: number;
}

export const DEFAULT_IMAGE_RESIZER_STORE_VALUE: ImageResizerStoreValue = {
  mode: 'dimensions',
  fit: 'cover',
  background: '#ffffff',
  lockAspectRatio: true,
  socialPlatform: 'facebook',
  socialPreset: 0,
  percentage: 80,
};

export const SOCIAL_PRESETS: Record<string, { name: string; width: number; height: number }[]> = {
  facebook: [
    { name: 'Profile', width: 170, height: 170 },
    { name: 'Cover', width: 851, height: 315 },
    { name: 'Post (Landscape)', width: 1200, height: 630 },
  ],
  instagram: [
    { name: 'Profile', width: 320, height: 320 },
    { name: 'Post (Square)', width: 1080, height: 1080 },
    { name: 'Story', width: 1080, height: 1920 },
  ],
  twitter: [
    { name: 'Profile', width: 400, height: 400 },
    { name: 'Header', width: 1500, height: 500 },
    { name: 'Post', width: 1200, height: 675 },
  ],
  youtube: [
    { name: 'Thumbnail', width: 1280, height: 720 },
    { name: 'Channel Art', width: 2560, height: 1440 },
  ],
};

export function resizeImageCanvas(
  file: File,
  width: number,
  height: number,
  fit: 'fill' | 'contain',
  background: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No context'));

      if (fit === 'contain') {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
        const scale = Math.min(width / img.width, height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }

      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob failed'))), file.type);
    };

    img.onerror = reject;

    img.src = URL.createObjectURL(file);
  });
}
