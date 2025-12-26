'use client';

import { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import { Download, Trash2 } from 'lucide-react';

import { Container } from '@/components/container';
import FileUpload from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import 'react-image-crop/dist/ReactCrop.css';
import { useWebStorage } from '@/hooks/use-web-storage';

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
    <Container>
      {!imgSrc ? (
        <FileUpload
          accept={{ 'image/*': [] }}
          maxSize={15 * 1024 * 1024}
          maxFiles={1}
          showFilesList={false}
          onDropAccepted={(files) => onFileChange(files[0])}
          dropZoneClassName={cn(
            'min-h-40',
            'h-[calc(75vh-var(--header-height)-(var(--spacing)*8))]'
          )}
        />
      ) : (
        <div className="flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="lock-aspect-ratio"
                checked={value.lockAspectRatio}
                onCheckedChange={(checked) => {
                  setValue((p) => ({ ...p, lockAspectRatio: checked }));
                  if (checked && crop && crop.width && crop.height) {
                    setAspectRatio(crop.width / crop.height);
                  }
                }}
              />
              <label
                htmlFor="lock-aspect-ratio"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lock Aspect Ratio
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setImgSrc('');
                  setCrop(undefined);
                  setValue((p) => ({ ...p, lockAspectRatio: false }));
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button size="sm" onClick={onDownloadCropClick}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="h-full alpha-grid flex items-center justify-center">
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                aspect={value.lockAspectRatio ? aspectRatio : undefined}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                className="max-h-[70vh]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </ReactCrop>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
