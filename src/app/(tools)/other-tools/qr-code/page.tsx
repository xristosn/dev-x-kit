'use client';

import QRCodeStyling, {
  type DotType,
  type Options as QrOptions,
  type Gradient,
  type CornerSquareType,
  type CornerDotType,
  type TypeNumber,
  type ErrorCorrectionLevel,
  type Mode,
} from 'qr-code-styling';
import { Container } from '@/components/container';
import { useEffect, useRef } from 'react';
import { useWebStorage } from '@/hooks/use-web-storage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cloneDeep } from 'lodash-es';
import FileUpload from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import {
  DataSchemaTypes,
  DataSchemaValueMap,
  getDefaultStringifiedValue,
  getParsedValue,
  getStringifiedValue,
} from './utils';
import { SimpleSelect } from './simple-select';
import { DATA_SCHEMA_COMPONENTS } from './data-schemas';
import { ClientOnly } from '@/components/client-only';
import { Skeleton } from '@/components/ui/skeleton';
import { ColorInput } from './color-input';
import { Download } from 'lucide-react';
import { InputWrapper } from '@/components/input-wrapper';

type StoreValue = QrOptions & { dataType: DataSchemaTypes };

const DEFAULT_VALUE: StoreValue = {
  width: 300,
  height: 300,
  dotsOptions: {
    type: 'rounded',
    color: '#000000',
    gradient: undefined,
  },
  cornersSquareOptions: {
    type: 'rounded',
    color: '#000000',
    gradient: undefined,
  },
  cornersDotOptions: {
    type: 'rounded',
    color: '#000000',
    gradient: undefined,
  },
  backgroundOptions: {
    color: '#FFFFFF',
    gradient: undefined,
    round: 0,
  },
  imageOptions: {
    margin: 4,
    hideBackgroundDots: true,
    imageSize: 0.25,
  },
  image: undefined,
  qrOptions: { typeNumber: 0, errorCorrectionLevel: 'Q', mode: 'Byte' },
  data: getDefaultStringifiedValue(DataSchemaTypes.Text),
  dataType: DataSchemaTypes.Text,
};

export default function QrCodeGenerator() {
  const [value, setValue, reset] = useWebStorage<StoreValue>('qr-code-gen', 'local', DEFAULT_VALUE);
  const formRef = useRef<HTMLFormElement>(null);
  const qrCode = useRef(typeof window !== 'undefined' ? new QRCodeStyling(value) : null);
  const previewRef = useRef<HTMLDivElement>(null);
  const DataComponent = DATA_SCHEMA_COMPONENTS[value.dataType];

  const onDataSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    if (!formRef.current.checkValidity()) return;

    const data = new FormData(formRef.current);
    const dataObj: Record<string, unknown> = {};
    data.forEach((value, key) => (dataObj[key] = value));

    setValue((p) => ({
      ...p,
      data: getStringifiedValue(
        p.dataType,
        dataObj as unknown as DataSchemaValueMap[DataSchemaTypes]
      ),
    }));
  };

  useEffect(() => {
    if (previewRef.current && qrCode.current) {
      setValue((p) => ({ ...p, image: undefined }));
      qrCode.current.append(previewRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update(cloneDeep(value));
    }
  }, [value]);

  return (
    <Container>
      <div className="flex flex-col lg:flex-row gap-8 h-full max-w-[inherit]">
        <div className="flex flex-col gap-4 w-full h-full">
          <Accordion
            type="single"
            collapsible
            defaultValue="data-schema"
            className='h-auto *:*:data-[slot="accordion-content"]:px-2'
          >
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
                    <DataComponent value={getParsedValue(value.dataType, value.data as string)} />

                    <Button type="submit" className="ml-auto">
                      Save
                    </Button>
                  </form>
                </ClientOnly>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sizing">
              <AccordionTrigger>Sizing</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <InputWrapper label="Width" id="qr-w">
                    <Input
                      id="qr-w"
                      type="number"
                      value={value.width || 100}
                      onChange={(e) =>
                        setValue((p) => ({
                          ...p,
                          width: Math.max(100, Number(e.target.value)),
                        }))
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
                        setValue((p) => ({
                          ...p,
                          height: Math.max(100, Number(e.target.value)),
                        }))
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
                    onChange={(e) =>
                      setValue((p) => ({
                        ...p,
                        margin: Number(e.target.value),
                      }))
                    }
                    min={0}
                    max={9999}
                  />
                </InputWrapper>
              </AccordionContent>
            </AccordionItem>

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
                      maxSize={5 * 1024 * 1024}
                      maxFiles={1}
                      accept={{ 'image/*': [] }}
                      onDropAccepted={(f) =>
                        setValue((p) => ({
                          ...p,
                          image: URL.createObjectURL(f[0]),
                        }))
                      }
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
                        imageOptions: {
                          ...(p.imageOptions || {}),
                          hideBackgroundDots: e,
                        },
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

            <AccordionItem value="dots-styling">
              <AccordionTrigger>Dots Styling</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                <InputWrapper label="Style">
                  <SimpleSelect
                    value={value.dotsOptions?.type || 'rounded'}
                    setValue={(v) =>
                      setValue((p) => ({
                        ...p,
                        dotsOptions: {
                          ...(p.dotsOptions || {}),
                          type: v as DotType,
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
                      dotsOptions: {
                        ...(p.dotsOptions || {}),
                        color: v as string,
                      },
                    }))
                  }
                  gradient={value.dotsOptions?.gradient}
                  setGradient={(v) =>
                    setValue((p) => ({
                      ...p,
                      dotsOptions: {
                        ...(p.dotsOptions || {}),
                        gradient: v as Gradient,
                      },
                    }))
                  }
                />
              </AccordionContent>
            </AccordionItem>

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
                      cornersSquareOptions: {
                        ...(p.cornersSquareOptions || {}),
                        color: v as string,
                      },
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

            <AccordionItem value="corner-dot-styling">
              <AccordionTrigger>Corner Dot Styling</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                <InputWrapper label="Style">
                  <SimpleSelect
                    value={value.cornersDotOptions?.type || 'rounded'}
                    setValue={(v) =>
                      setValue((p) => ({
                        ...p,
                        cornersDotOptions: {
                          ...(p.cornersDotOptions || {}),
                          type: v as CornerDotType,
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
                      cornersDotOptions: {
                        ...(p.cornersDotOptions || {}),
                        color: v as string,
                      },
                    }))
                  }
                  gradient={value.cornersDotOptions?.gradient}
                  setGradient={(v) =>
                    setValue((p) => ({
                      ...p,
                      cornersDotOptions: {
                        ...(p.cornersDotOptions || {}),
                        gradient: v as Gradient,
                      },
                    }))
                  }
                />
              </AccordionContent>
            </AccordionItem>

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
                      backgroundOptions: {
                        ...(p.backgroundOptions || {}),
                        color: v as string,
                      },
                    }))
                  }
                  gradient={value.backgroundOptions?.gradient}
                  setGradient={(v) =>
                    setValue((p) => ({
                      ...p,
                      backgroundOptions: {
                        ...(p.backgroundOptions || {}),
                        gradient: v as Gradient,
                      },
                    }))
                  }
                />
              </AccordionContent>
            </AccordionItem>

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
                        qrOptions: {
                          ...(p.qrOptions || {}),
                          mode: v as Mode,
                        },
                      }))
                    }
                    format
                  />
                </InputWrapper>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button className="mx-auto" variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>

        <div className="max-w-full lg:sticky top-1">
          <div className="flex flex-col gap-8 bg-card p-4 rounded-xl shadow-sm mx-auto w-full">
            <div
              ref={previewRef}
              className="[&>canvas]:max-w-72 [&>canvas]:w-full [&>canvas]:max-h-72 w-full"
            />

            <div className="flex flex-wrap gap-4 max-w-72">
              <p className="flex gap-4 text-lg items-center justify-center w-full">
                <Download /> Download to:
              </p>

              <div className="grid grid-cols-2 gap-4 items-center justify-between w-full">
                <Button onClick={() => qrCode.current?.download({ extension: 'png' })}>.png</Button>
                <Button onClick={() => qrCode.current?.download({ extension: 'jpeg' })}>
                  .jpeg
                </Button>
                <Button onClick={() => qrCode.current?.download({ extension: 'svg' })}>.svg</Button>
                <Button onClick={() => qrCode.current?.download({ extension: 'webp' })}>
                  .webp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
