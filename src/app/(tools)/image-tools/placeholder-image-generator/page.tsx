'use client';

import { Container } from '@/components/container';
import { useWebStorage } from '@/hooks/use-web-storage';
import {
  DEFAULT_IMAGE_PLACEHOLDER_STORE_VALUE,
  downloadImage,
  generatePlaceholderImage,
} from './utils';
import { InputWrapper } from '@/components/input-wrapper';
import { ColorPopover } from '@/components/color/color-popover';
import { ColorService, IColor } from 'react-color-palette';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/client-only';

export default function PlaceholderImageGenerator() {
  const [value, setValue] = useWebStorage(
    'img-placeholder-gen',
    'infer',
    DEFAULT_IMAGE_PLACEHOLDER_STORE_VALUE
  );

  const imageDataUri = generatePlaceholderImage(
    value.backgroundColor,
    value.width,
    value.height,
    value.text
  );

  return (
    <Container>
      <div className="flex flex-col gap-4 p-4 rounded-xl bg-card shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputWrapper label="Color">
            <ColorPopover
              value={ColorService.convert('hex', value.backgroundColor)}
              setValue={(v) => setValue((p) => ({ ...p, backgroundColor: (v as IColor).hex }))}
            />
          </InputWrapper>

          <InputWrapper label="Width (Pixels)" id="img-placeholder-w">
            <Input
              id="img-placeholder-w"
              type="number"
              min={1}
              max={9999}
              value={value.width}
              onChange={(e) =>
                setValue((p) => ({
                  ...p,
                  width: Math.min(9999, Math.max(1, Number(e.target.value))),
                }))
              }
            />
          </InputWrapper>

          <InputWrapper label="Height (Pixels)" id="img-placeholder-h">
            <Input
              id="img-placeholder-h"
              type="number"
              min={1}
              max={9999}
              value={value.height}
              onChange={(e) =>
                setValue((p) => ({
                  ...p,
                  height: Math.min(9999, Math.max(1, Number(e.target.value))),
                }))
              }
            />
          </InputWrapper>
        </div>

        <InputWrapper label="Text">
          <Input
            type="text"
            minLength={0}
            maxLength={200}
            value={value.text}
            onChange={(e) => setValue((p) => ({ ...p, text: e.target.value }))}
            placeholder="Defaults to Width x Height"
          />
        </InputWrapper>
      </div>

      <div className="bg-card shadow-md rounded-xl p-4 flex flex-col gap-4 h-full">
        <h5 className="text-lg">Placeholder</h5>

        <div className="h-full w-full flex items-center justify-center">
          <ClientOnly>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUri}
              width={value.width}
              height={value.height}
              alt="Placeholder"
              className="object-contain max-w-full mx-auto max-h-[45vh]"
            />
          </ClientOnly>
        </div>
      </div>

      <div className="bg-card shadow-md rounded-xl p-4 flex flex-col gap-4">
        <h5 className="text-lg">Download</h5>

        <div className="flex gap-4">
          <ClientOnly>
            <Button asChild>
              <a href={imageDataUri} download="placeholder.png">
                PNG
              </a>
            </Button>
          </ClientOnly>

          <Button onClick={() => downloadImage(imageDataUri, 'jpeg')}>JPEG</Button>

          <Button onClick={() => downloadImage(imageDataUri, 'webp')}>WEBP</Button>
        </div>
      </div>
    </Container>
  );
}
