'use client';

import { useState } from 'react';
import { Container } from '@/components/container';
import Compressor from 'compressorjs';
import {
  DEFAULT_IMAGE_RESIZER_STORE_VALUE,
  resizeImageCanvas,
  ResizeMode,
  SOCIAL_PRESETS,
} from './utils';
import { useWebStorage } from '@/hooks/use-web-storage';
import FileUpload from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputWrapper } from '@/components/input-wrapper';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { FitModeInput } from './fit-mode-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalize } from 'lodash-es';
import { Button } from '@/components/ui/button';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [value, setValue] = useWebStorage(
    'image-resizer',
    'infer',
    DEFAULT_IMAGE_RESIZER_STORE_VALUE
  );

  const onFileChange = (file: File) => {
    setFile(file);

    const url = URL.createObjectURL(file);

    const img = new Image();

    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
    };

    img.src = url;
  };

  const onWidthChange = (val: number) => {
    setWidth(val);
    if (value.lockAspectRatio && val && aspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const onHeightChange = (val: number) => {
    setHeight(val);
    if (value.lockAspectRatio && val && aspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const onResizeClick = async () => {
    if (!file) return;

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
  };

  return (
    <Container className="py-8 space-y-8">
      <FileUpload
        accept={{ 'image/*': [] }}
        maxSize={15 * 1024 * 1024}
        maxFiles={1}
        showFilesList={false}
        onDropAccepted={(files) => onFileChange(files[0])}
        dropZoneClassName={cn(
          'min-h-40',
          !file && 'h-[calc(75vh-var(--header-height)-(var(--spacing)*8))]'
        )}
      />

      {file && (
        <div className="bg-sidebar text-sidebar-foreground p-4 shadow-md rounded-lg flex flex-col gap-8">
          <Tabs
            value={value.mode}
            onValueChange={(v) => setValue((p) => ({ ...p, mode: v as ResizeMode }))}
          >
            <div className="flex flex-col gap-2 mb-6">
              <p className="text-muted-foreground text-sm">Resize Settings:</p>

              <TabsList>
                <TabsTrigger value="dimensions">By Dimensions</TabsTrigger>
                <TabsTrigger value="percentage">By Percentage</TabsTrigger>
                <TabsTrigger value="social">For Social</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dimensions">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper label="Width (px)" id="img-resize-w">
                    <Input
                      id="img-resize-w"
                      type="number"
                      min={1}
                      max={9999}
                      step={1}
                      value={width}
                      onChange={(e) => onWidthChange(Number(e.target.value))}
                    />
                  </InputWrapper>

                  <InputWrapper label="Height (px)" id="img-resize-h">
                    <Input
                      id="img-resize-h"
                      type="number"
                      min={1}
                      max={9999}
                      step={1}
                      value={height}
                      onChange={(e) => onHeightChange(Number(e.target.value))}
                    />
                  </InputWrapper>
                </div>

                <InputWrapper label="Lock Aspect Ratio" id="img-resize-lock">
                  <Switch
                    id="img-resize-lock"
                    checked={value.lockAspectRatio}
                    onCheckedChange={(checked) =>
                      setValue((p) => ({ ...p, lockAspectRatio: checked }))
                    }
                  />
                </InputWrapper>

                {!value.lockAspectRatio && width && height && (
                  <FitModeInput value={value} setValue={setValue} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="percentage">
              <InputWrapper label="Percentage" id="img-resize-percentage">
                <div className="flex gap-4 items-center">
                  <input
                    id="img-resize-percentage"
                    type="range"
                    min={1}
                    max={100}
                    step={1}
                    value={value.percentage}
                    onChange={(e) =>
                      setValue((p) => ({ ...p, percentage: Number(e.target.value) }))
                    }
                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />

                  <p className="text-sm text-center w-[6ch]">{value.percentage}%</p>
                </div>
              </InputWrapper>
            </TabsContent>

            <TabsContent value="social">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWrapper label="Platform">
                    <Select
                      value={value.socialPlatform}
                      onValueChange={(v) => setValue((p) => ({ ...p, socialPlatform: v }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(SOCIAL_PRESETS).map((p) => (
                          <SelectItem key={p} value={p}>
                            {capitalize(p)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </InputWrapper>

                  <InputWrapper label="Preset">
                    <Select
                      value={value.socialPreset.toString()}
                      onValueChange={(v) => setValue((p) => ({ ...p, socialPreset: Number(v) }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIAL_PRESETS[value.socialPlatform].map((preset, idx) => (
                          <SelectItem key={preset.name} value={idx.toString()}>
                            {preset.name} ({preset.width}x{preset.height})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </InputWrapper>
                </div>

                <FitModeInput value={value} setValue={setValue} />
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={onResizeClick} className="mx-auto h-14 px-8 text-xl">
            Resize Image
          </Button>
        </div>
      )}
    </Container>
  );
}
