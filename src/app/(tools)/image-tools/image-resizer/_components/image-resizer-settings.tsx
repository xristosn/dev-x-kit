'use client';

import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageResizerStoreValue, ResizeMode, SOCIAL_PRESETS } from '../_lib/utils';
import { FitModeInput } from './fit-mode-input';
import { capitalize } from 'lodash-es';

type ImageResizerSettingsProps = {
  value: ImageResizerStoreValue;
  setValue: React.Dispatch<React.SetStateAction<ImageResizerStoreValue>>;
  width: number;
  height: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onResizeClick: () => void;
};

export function ImageResizerSettings({
  value,
  setValue,
  width,
  height,
  onWidthChange,
  onHeightChange,
  onResizeClick,
}: ImageResizerSettingsProps) {
  return (
    <div className="bg-sidebar text-sidebar-foreground p-4 shadow-md rounded-lg flex flex-col gap-8">
      <Tabs
        value={value.mode}
        onValueChange={(v) => setValue((p) => ({ ...p, mode: v as ResizeMode }))}
      >
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-muted-foreground text-sm">Resize Settings:</p>

          <TabsList data-testid="image-resizer-mode-tabs">
            <TabsTrigger data-testid="image-resizer-mode-dimensions" value="dimensions">
              By Dimensions
            </TabsTrigger>
            <TabsTrigger data-testid="image-resizer-mode-percentage" value="percentage">
              By Percentage
            </TabsTrigger>
            <TabsTrigger data-testid="image-resizer-mode-social" value="social">
              For Social
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dimensions">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper label="Width (px)" id="img-resize-w">
                <Input
                  id="img-resize-w"
                  data-testid="image-resizer-width"
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
                  data-testid="image-resizer-height"
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
                data-testid="image-resizer-lock-aspect-ratio"
                checked={value.lockAspectRatio}
                onCheckedChange={(checked) => setValue((p) => ({ ...p, lockAspectRatio: checked }))}
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
                data-testid="image-resizer-percentage"
                type="range"
                min={1}
                max={100}
                step={1}
                value={value.percentage}
                onChange={(e) => setValue((p) => ({ ...p, percentage: Number(e.target.value) }))}
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
                  onValueChange={(v) =>
                    setValue((p) => ({ ...p, socialPlatform: v ?? p.socialPlatform }))
                  }
                >
                  <SelectTrigger className="w-full" data-testid="image-resizer-social-platform">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SOCIAL_PRESETS).map((platform) => (
                      <SelectItem
                        key={platform}
                        value={platform}
                        data-testid={`image-resizer-platform-${platform}`}
                      >
                        {capitalize(platform)}
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
                  <SelectTrigger className="w-full" data-testid="image-resizer-social-preset">
                    <SelectValue placeholder="Preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PRESETS[value.socialPlatform].map((preset, idx) => (
                      <SelectItem
                        key={preset.name}
                        value={idx.toString()}
                        data-testid={`image-resizer-preset-${idx}`}
                      >
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

      <Button
        data-testid="image-resizer-resize"
        onClick={onResizeClick}
        className="mx-auto h-14 px-8 text-xl"
      >
        Resize Image
      </Button>
    </div>
  );
}
