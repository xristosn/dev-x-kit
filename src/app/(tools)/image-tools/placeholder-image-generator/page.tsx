'use client';

import { ClientOnly } from '@/components/client-only';
import { ColorPopover } from '@/components/color/color-popover';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebStorage } from '@/hooks/use-web-storage';
import {
  DEFAULT_IMAGE_PLACEHOLDER_STORE_VALUE,
  downloadImage,
  generatePlaceholderImage,
} from './_lib/utils';

const FAQS = [
  {
    title: 'What happens if I leave the text field blank?',
    description:
      'The image displays its dimensions as text, such as 640x360. Enter your own text to replace that label. Text is limited to 200 characters.',
  },
  {
    title: 'What image dimensions can I generate?',
    description:
      'Set the width and height independently from 1 to 9,999 pixels. The preview updates as you change either value.',
  },
  {
    title: 'Do the JPEG and WebP buttons change the image format?',
    description:
      'The generated image data is PNG. The JPEG and WebP buttons currently reuse that PNG data and change only the downloaded filename extension, so use the PNG option when you need a correctly labeled PNG file.',
  },
] satisfies readonly FaqItem[];

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
    <>
      <div className="flex flex-col gap-4 p-4 rounded-xl bg-card shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputWrapper label="Color">
            <ColorPopover
              value={value.backgroundColor}
              setValue={(nextColor) =>
                setValue((p) => ({
                  ...p,
                  backgroundColor:
                    typeof nextColor === 'function' ? nextColor(p.backgroundColor) : nextColor,
                }))
              }
            />
          </InputWrapper>

          <InputWrapper label="Width (Pixels)" id="img-placeholder-w">
            <Input
              data-testid="placeholder-image-width"
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
              data-testid="placeholder-image-height"
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
            data-testid="placeholder-image-text"
            type="text"
            minLength={0}
            maxLength={200}
            value={value.text}
            onChange={(e) => setValue((p) => ({ ...p, text: e.target.value }))}
            placeholder="Defaults to Width x Height"
          />
        </InputWrapper>
      </div>

      <div className="bg-card shadow-md rounded-xl p-4 flex flex-col gap-4 flex-1 min-h-72">
        <h5 className="text-lg">Placeholder</h5>

        <div className="w-full flex-1 editor-height-half flex items-center justify-center alpha-grid">
          <ClientOnly>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-testid="placeholder-image-preview"
              src={imageDataUri}
              width={value.width}
              height={value.height}
              alt="Placeholder"
              className="object-contain max-w-full max-h-full mx-auto"
            />
          </ClientOnly>
        </div>
      </div>

      <div className="bg-card shadow-md rounded-xl p-4 flex flex-col gap-4">
        <h5 className="text-lg">Download</h5>

        <div className="flex gap-4">
          <ClientOnly>
            <Button
              nativeButton={false}
              render={
                <a
                  data-testid="placeholder-image-download-png"
                  href={imageDataUri}
                  download="placeholder.png"
                >
                  PNG
                </a>
              }
            />
          </ClientOnly>

          <Button
            data-testid="placeholder-image-download-jpeg"
            onClick={() => downloadImage(imageDataUri, 'jpeg')}
          >
            JPEG
          </Button>

          <Button
            data-testid="placeholder-image-download-webp"
            onClick={() => downloadImage(imageDataUri, 'webp')}
          >
            WEBP
          </Button>
        </div>
      </div>

      <FaqSection items={FAQS} />
    </>
  );
}
