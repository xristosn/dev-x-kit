export interface ImagePlaceholderStoreValue {
  backgroundColor: string;
  width: number;
  height: number;
  text: string;
}

export const DEFAULT_IMAGE_PLACEHOLDER_STORE_VALUE: ImagePlaceholderStoreValue = {
  backgroundColor: '#000000',
  width: 200,
  height: 200,
  text: '',
};

export function generatePlaceholderImage(
  backgroundColor: string,
  width: number,
  height: number,
  text?: string
): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error(new Error('Could not get 2D context from canvas'));
    return '';
  }

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = getContrastColor(backgroundColor);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSize = Math.min(width, height) / 5;
  ctx.font = `${fontSize}px Arial`;

  const displayText = text || `${width}x${height}`;
  ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
}

function getContrastColor(hexcolor: string): string {
  const color = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const y = (r * 299 + g * 587 + b * 114) / 1000;

  return y >= 128 ? '#000000' : '#FFFFFF';
}

export function downloadImage(dataUrl: string, format: 'jpeg' | 'webp'): void {
  const link = document.createElement('a');
  link.download = `placeholder.${format}`;
  link.href = dataUrl;
  link.click();
}
