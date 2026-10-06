import Compressor from 'compressorjs';
import { ImageResizerStoreValue, SOCIAL_PRESETS, resizeImageCanvas } from './utils';

type ResizeImageOptions = {
  file: File;
  width: number;
  height: number;
  originalSize: { width: number; height: number } | null;
  value: ImageResizerStoreValue;
};

export async function resizeImage({
  file,
  width,
  height,
  originalSize,
  value,
}: ResizeImageOptions) {
  let inputBlob: Blob | File = file;
  let targetWidth: number | undefined = width;
  let targetHeight: number | undefined = height;
  let resizeMode: Compressor.Options['resize'] = 'contain';

  if (value.mode === 'percentage' && originalSize) {
    targetWidth = Math.round(originalSize.width * (value.percentage / 100));
    targetHeight = Math.round(originalSize.height * (value.percentage / 100));
  } else if (value.mode === 'social') {
    const preset = SOCIAL_PRESETS[value.socialPlatform][value.socialPreset];
    targetWidth = preset.width;
    targetHeight = preset.height;
  }

  const isCustomFit =
    value.mode === 'social' ||
    (value.mode === 'dimensions' && !value.lockAspectRatio && width && height);

  if (isCustomFit) {
    if (value.fit === 'fill' || value.fit === 'contain') {
      if (targetWidth && targetHeight) {
        try {
          inputBlob = await resizeImageCanvas(
            file,
            targetWidth,
            targetHeight,
            value.fit,
            value.background
          );

          targetWidth = undefined;
          targetHeight = undefined;
        } catch (e) {
          console.error(e);
          return;
        }
      }
    } else if (value.fit === 'cover') {
      resizeMode = 'cover';
    }
  }

  const options: Compressor.Options = {
    quality: 1,
    resize: resizeMode,
    width: targetWidth,
    height: targetHeight,
    mimeType: file.type,
    retainExif: true,
    success(result) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(result);
      link.download = file.name;
      link.click();
    },
    error(err) {
      console.error(err.message);
    },
  };

  new Compressor(inputBlob, options);
}
