'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import FileUpload from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/client-only';
import { Skeleton } from '@/components/ui/skeleton';
import { InputWrapper } from '@/components/input-wrapper';
import { SimpleSelect } from './simple-select';
import { ColorInput } from './color-input';
import { DataSchemaTypes, getParsedValue, getDefaultStringifiedValue } from '../_lib/utils';
import type { StoreValue } from '../_lib/constants';
import type {
  DotType,
  Gradient,
  CornerSquareType,
  CornerDotType,
  TypeNumber,
  ErrorCorrectionLevel,
  Mode,
} from 'qr-code-styling';

type QrFormProps = {
  value: StoreValue;
  setValue: (v: React.SetStateAction<StoreValue>) => void;
  reset: () => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  onDataSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  DataComponent: React.FC<{ value: unknown }>;
};

type QrSectionProps = Pick<QrFormProps, 'value' | 'setValue'>;

const DataSchemaSection: React.FC<
  QrSectionProps & Pick<QrFormProps, 'formRef' | 'onDataSubmit' | 'DataComponent'>
> = ({ value, setValue, formRef, onDataSubmit, DataComponent }) => {
  return (
    <AccordionItem value="data-schema">
      <AccordionTrigger>Data schema</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <InputWrapper label="Data Type">
          <SimpleSelect
            collection={Object.values(DataSchemaTypes)}
            value={value.dataType}
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                dataType: v as DataSchemaTypes,
                data: getDefaultStringifiedValue(v as DataSchemaTypes),
              }))
            }
          />
        </InputWrapper>

        <ClientOnly fallback={<Skeleton className="w-full h-20" />}>
          <form ref={formRef} onSubmit={onDataSubmit} className="flex flex-col gap-4">
            <DataComponent
              key={`${value.dataType}:${value.data}`}
              value={getParsedValue(value.dataType, value.data as string)}
            />
            <Button type="submit" className="ml-auto">
              Save
            </Button>
          </form>
        </ClientOnly>
      </AccordionContent>
    </AccordionItem>
  );
};

const SizingSection: React.FC<QrSectionProps> = ({ value, setValue }) => {
  return (
    <AccordionItem value="sizing">
      <AccordionTrigger data-testid="qr-sizing-trigger">Sizing</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InputWrapper label="Width" id="qr-w">
            <Input
              data-testid="qr-width"
              id="qr-w"
              type="number"
              value={value.width || 100}
              onChange={(e) =>
                setValue((p) => ({ ...p, width: Math.max(100, Number(e.target.value)) }))
              }
              min={100}
              max={9999}
            />
          </InputWrapper>
          <InputWrapper label="Height" id="qr-h">
            <Input
              id="qr-h"
              type="number"
              value={value.height || 100}
              onChange={(e) =>
                setValue((p) => ({ ...p, height: Math.max(100, Number(e.target.value)) }))
              }
              min={100}
              max={9999}
            />
          </InputWrapper>
        </div>
        <InputWrapper label="Margin" id="qr-m">
          <Input
            id="qr-m"
            type="number"
            value={(value.margin || 0)?.toString()}
            onChange={(e) => setValue((p) => ({ ...p, margin: Number(e.target.value) }))}
            min={0}
            max={9999}
          />
        </InputWrapper>
      </AccordionContent>
    </AccordionItem>
  );
};

const ImageOptionsSection: React.FC<QrSectionProps> = ({ value, setValue }) => {
  return (
    <AccordionItem value="image-options">
      <AccordionTrigger>Image options</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        {value.image ? (
          <div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setValue((p) => ({ ...p, image: undefined }))}
            >
              Clear Image
            </Button>
          </div>
        ) : (
          <InputWrapper label="Center Image">
            <FileUpload
              enableImageClipboard
              maxSize={5 * 1024 * 1024}
              maxFiles={1}
              accept={{ 'image/*': [] }}
              onDropAccepted={(f) => setValue((p) => ({ ...p, image: URL.createObjectURL(f[0]) }))}
              showFilesList={false}
            />
          </InputWrapper>
        )}
        <InputWrapper label="Hide background dots" id="qr-hide-dots">
          <Switch
            id="qr-hide-dots"
            checked={value.imageOptions?.hideBackgroundDots || false}
            onCheckedChange={(e) =>
              setValue((p) => ({
                ...p,
                imageOptions: { ...(p.imageOptions || {}), hideBackgroundDots: e },
              }))
            }
          />
        </InputWrapper>
        <InputWrapper label="Image size ratio" id="qr-img-size">
          <Input
            id="qr-img-size"
            type="number"
            value={value.imageOptions?.imageSize || 0}
            onChange={(e) =>
              setValue((p) => ({
                ...p,
                imageOptions: {
                  ...(p.imageOptions || {}),
                  imageSize: Math.max(0, Number(e.target.value)),
                },
              }))
            }
            min={0}
            max={1}
            step={0.1}
          />
        </InputWrapper>
        <InputWrapper label="Image margin" id="qr-img-m">
          <Input
            id="qr-img-m"
            type="number"
            value={(value.imageOptions?.margin || 0)?.toString()}
            onChange={(e) =>
              setValue((p) => ({
                ...p,
                imageOptions: {
                  ...(p.imageOptions || {}),
                  margin: Math.max(0, Number(e.target.value)),
                },
              }))
            }
            min={0}
            max={9999}
          />
        </InputWrapper>
      </AccordionContent>
    </AccordionItem>
  );
};

const DotsStylingSection: React.FC<QrSectionProps> = ({ value, setValue }) => {
  return (
    <AccordionItem value="dots-styling">
      <AccordionTrigger>Dots Styling</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <InputWrapper label="Style">
          <SimpleSelect
            value={value.dotsOptions?.type || 'rounded'}
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                dotsOptions: { ...(p.dotsOptions || {}), type: v as DotType },
              }))
            }
            collection={
              [
                'classy',
                'classy-rounded',
                'dots',
                'extra-rounded',
                'rounded',
                'square',
              ] as DotType[]
            }
            format
          />
        </InputWrapper>
        <ColorInput
          color={value.dotsOptions?.color || '#000000'}
          setColor={(v) =>
            setValue((p) => ({
              ...p,
              dotsOptions: { ...(p.dotsOptions || {}), color: v as string },
            }))
          }
          gradient={value.dotsOptions?.gradient}
          setGradient={(v) =>
            setValue((p) => ({
              ...p,
              dotsOptions: { ...(p.dotsOptions || {}), gradient: v as Gradient },
            }))
          }
        />
      </AccordionContent>
    </AccordionItem>
  );
};

const CornerBorderStylingSection: React.FC<QrSectionProps> = ({ value, setValue }) => {
  return (
    <AccordionItem value="corner-border-styling">
      <AccordionTrigger>Corner Border Styling</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <InputWrapper label="Style">
          <SimpleSelect
            value={value.cornersSquareOptions?.type || 'rounded'}
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                cornersSquareOptions: {
                  ...(p.cornersSquareOptions || {}),
                  type: v as CornerSquareType,
                },
              }))
            }
            collection={
              [
                'classy',
                'classy-rounded',
                'dots',
                'extra-rounded',
                'rounded',
                'square',
              ] as CornerSquareType[]
            }
            format
          />
        </InputWrapper>
        <ColorInput
          color={value.cornersSquareOptions?.color || '#000000'}
          setColor={(v) =>
            setValue((p) => ({
              ...p,
              cornersSquareOptions: { ...(p.cornersSquareOptions || {}), color: v as string },
            }))
          }
          gradient={value.cornersSquareOptions?.gradient}
          setGradient={(v) =>
            setValue((p) => ({
              ...p,
              cornersSquareOptions: {
                ...(p.cornersSquareOptions || {}),
                gradient: v as Gradient,
              },
            }))
          }
        />
      </AccordionContent>
    </AccordionItem>
  );
};

const CornerDotStylingSection: React.FC<QrSectionProps> = ({ value, setValue }) => {
  return (
    <AccordionItem value="corner-dot-styling">
      <AccordionTrigger>Corner Dot Styling</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <InputWrapper label="Style">
          <SimpleSelect
            value={value.cornersDotOptions?.type || 'rounded'}
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                cornersDotOptions: { ...(p.cornersDotOptions || {}), type: v as CornerDotType },
              }))
            }
            collection={
              [
                'classy',
                'classy-rounded',
                'dots',
                'extra-rounded',
                'rounded',
                'square',
              ] as CornerDotType[]
            }
            format
          />
        </InputWrapper>
        <ColorInput
          color={value.cornersDotOptions?.color || '#000000'}
          setColor={(v) =>
            setValue((p) => ({
              ...p,
              cornersDotOptions: { ...(p.cornersDotOptions || {}), color: v as string },
            }))
          }
          gradient={value.cornersDotOptions?.gradient}
          setGradient={(v) =>
            setValue((p) => ({
              ...p,
              cornersDotOptions: { ...(p.cornersDotOptions || {}), gradient: v as Gradient },
            }))
          }
        />
      </AccordionContent>
    </AccordionItem>
  );
};

const BackgroundStylingSection: React.FC<QrSectionProps> = ({ value, setValue }) => {
  return (
    <AccordionItem value="bg-styling">
      <AccordionTrigger>Background Styling</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <InputWrapper label="Rounded" id="qr-bg-rounded">
          <Input
            id="qr-bg-rounded"
            type="number"
            value={value.backgroundOptions?.round || 0}
            onChange={(e) =>
              setValue((p) => ({
                ...p,
                backgroundOptions: {
                  ...(p.backgroundOptions || {}),
                  round: Math.min(Number(e.target.value), 1),
                },
              }))
            }
            min={0}
            max={1}
            step={0.1}
          />
        </InputWrapper>
        <ColorInput
          color={value.backgroundOptions?.color || '#000000'}
          setColor={(v) =>
            setValue((p) => ({
              ...p,
              backgroundOptions: { ...(p.backgroundOptions || {}), color: v as string },
            }))
          }
          gradient={value.backgroundOptions?.gradient}
          setGradient={(v) =>
            setValue((p) => ({
              ...p,
              backgroundOptions: { ...(p.backgroundOptions || {}), gradient: v as Gradient },
            }))
          }
        />
      </AccordionContent>
    </AccordionItem>
  );
};

const QrOptionsSection: React.FC<QrSectionProps> = ({ value, setValue }) => {
  return (
    <AccordionItem value="qr-options">
      <AccordionTrigger>QR options</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <InputWrapper
          label="Type"
          id="qr-opts-type"
          helperText="Higher numbers create larger grids with more capacity. Setting it to 0 enables auto-detection, where the smallest version that fits your data is chosen."
        >
          <Input
            id="qr-opts-type"
            type="number"
            value={value.qrOptions?.typeNumber || 0}
            onChange={(e) =>
              setValue((p) => ({
                ...p,
                qrOptions: {
                  ...(p.qrOptions || {}),
                  typeNumber: Math.min(40, Number(e.target.value)) as TypeNumber,
                },
              }))
            }
            min={0}
            max={40}
            step={1}
          />
        </InputWrapper>
        <InputWrapper
          label="Error correction level"
          helperText="Defines damage tolerance: L (7%), M (15%), Q (25%), or H (30%). Higher levels allow scanning if dirty but increase code density."
        >
          <SimpleSelect
            collection={['H', 'L', 'M', 'Q'] as ErrorCorrectionLevel[]}
            value={value.qrOptions?.errorCorrectionLevel || 'Q'}
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                qrOptions: {
                  ...(p.qrOptions || {}),
                  errorCorrectionLevel: v as ErrorCorrectionLevel,
                },
              }))
            }
            format
          />
        </InputWrapper>
        <InputWrapper
          label="Mode"
          helperText='Defines data encoding: Numeric (0-9), Alphanumeric (A-Z, 0-9, symbols), Byte (UTF-8/Standard), or Kanji. Use the simplest mode to save space. Defaulting to "Byte" covers 99% of use cases correctly.'
        >
          <SimpleSelect
            collection={['Alphanumeric', 'Byte', 'Kanji', 'Numeric'] as Mode[]}
            value={value.qrOptions?.mode || 'Byte'}
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                qrOptions: { ...(p.qrOptions || {}), mode: v as Mode },
              }))
            }
            format
          />
        </InputWrapper>
      </AccordionContent>
    </AccordionItem>
  );
};

export const QrForm: React.FC<QrFormProps> = ({
  value,
  setValue,
  reset,
  formRef,
  onDataSubmit,
  DataComponent,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Accordion defaultValue={['data-schema']}>
        <DataSchemaSection
          value={value}
          setValue={setValue}
          formRef={formRef}
          onDataSubmit={onDataSubmit}
          DataComponent={DataComponent}
        />
        <SizingSection value={value} setValue={setValue} />
        <ImageOptionsSection value={value} setValue={setValue} />
        <DotsStylingSection value={value} setValue={setValue} />
        <CornerBorderStylingSection value={value} setValue={setValue} />
        <CornerDotStylingSection value={value} setValue={setValue} />
        <BackgroundStylingSection value={value} setValue={setValue} />
        <QrOptionsSection value={value} setValue={setValue} />
      </Accordion>
      <Button data-testid="qr-reset" className="mx-auto" variant="outline" onClick={reset}>
        Reset
      </Button>
    </div>
  );
};
