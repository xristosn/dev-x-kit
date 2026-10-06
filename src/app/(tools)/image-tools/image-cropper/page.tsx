'use client';

import { useRef, useState } from 'react';
import { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';

import { FaqSection, type FaqItem } from '@/components/faq-section';
import FileUpload from '@/components/ui/file-upload';
import { useWebStorage } from '@/hooks/use-web-storage';
import { cn } from '@/lib/utils';

import 'react-image-crop/dist/ReactCrop.css';
import { ImageCropperControls } from './_components/image-cropper-controls';
import { ImageCropperEditor } from './_components/image-cropper-editor';

const FAQS = [
  {
    title: 'Does the crop start at a 16:9 aspect ratio?',
    description:
      'Yes. When an image loads, the crop selection starts centered at 16:9. Aspect-ratio locking is initially off, so you can adjust the selection freely.',
  },
  {
    title: 'What happens when I lock the aspect ratio?',
    description:
      'Locking preserves the ratio of the current crop selection. It does not reset the selection to 16:9. Leave the lock off if you want to adjust width and height independently.',
  },
  {
    title: 'What format and filename does the crop download use?',
    description:
      'The selected area is exported as a PNG named cropped-image.png, regardless of the original image format. Complete a crop selection before clicking Download.',
  },
] satisfies readonly FaqItem[];

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  const [value, setValue] = useWebStorage('img-cropper', 'infer', { lockAspectRatio: false });
  const imgRef = useRef<HTMLImageElement>(null);

  function onFileChange(file: File) {
    if (!file) return;

    setCrop(undefined);
    setValue((p) => ({ ...p, lockAspectRatio: false }));

    const reader = new FileReader();

    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));

    reader.readAsDataURL(file);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
    setAspectRatio(16 / 9);
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const crop = completedCrop;
    if (!image || !crop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const previewUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'cropped-image.png';
      anchor.href = previewUrl;
      anchor.click();
      URL.revokeObjectURL(previewUrl);
    }, 'image/png');
  }

  return (
    <>
      {!imgSrc ? (
        <FileUpload
          enableImageClipboard
          accept={{ 'image/*': [] }}
          maxSize={15 * 1024 * 1024}
          maxFiles={1}
          showFilesList={false}
          inputTestId="image-cropper-file-input"
          onDropAccepted={(files) => onFileChange(files[0])}
          dropZoneClassName={cn('editor-height')}
        />
      ) : (
        <div className="flex flex-col gap-4 h-full">
          <ImageCropperControls
            lockAspectRatio={value.lockAspectRatio}
            onLockAspectRatioChange={(checked) => {
              setValue((p) => ({ ...p, lockAspectRatio: checked }));
              if (checked && crop && crop.width && crop.height) {
                const image = imgRef.current;
                const scaleX = crop.unit === '%' && image ? image.width : 1;
                const scaleY = crop.unit === '%' && image ? image.height : 1;
                setAspectRatio((crop.width * scaleX) / (crop.height * scaleY));
              }
            }}
            onReset={() => {
              setImgSrc('');
              setCrop(undefined);
              setValue((p) => ({ ...p, lockAspectRatio: false }));
            }}
            onDownload={onDownloadCropClick}
          />

          <ImageCropperEditor
            imgSrc={imgSrc}
            crop={crop}
            aspectRatio={aspectRatio}
            lockAspectRatio={value.lockAspectRatio}
            imgRef={imgRef}
            onCropChange={setCrop}
            onCropComplete={setCompletedCrop}
            onImageLoad={onImageLoad}
          />
        </div>
      )}

      <FaqSection items={FAQS} />
    </>
  );
}
