'use client';

import * as cssConvert from 'css-unit-converter-js';
import { Container } from '@/components/container';
import { useWebStorage } from '@/hooks/use-web-storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ClientOnly } from '@/components/client-only';

const CONFIG = {
  units: [
    { key: 'px', label: 'Pixels (px)', type: 'absolute' },
    { key: 'rem', label: 'Root Em (rem)', type: 'relative' },
    { key: 'em', label: 'Em (em)', type: 'relative' },
    { key: 'vw', label: 'Viewport Width (vw)', type: 'relative' },
    { key: 'vh', label: 'Viewport Height (vh)', type: 'relative' },
    { key: '%', label: 'Percentage (%)', type: 'relative' },
    { key: 'pt', label: 'Points (pt)', type: 'absolute' },
    { key: 'in', label: 'Inches (in)', type: 'absolute' },
    { key: 'pc', label: 'Picas (pc)', type: 'absolute' },
    { key: 'cm', label: 'Centimeters (cm)', type: 'absolute' },
    { key: 'mm', label: 'Millimeters (mm)', type: 'absolute' },
  ],

  contextArguments: {
    remSize: {
      label: 'Root Font Size (px)',
      description: 'The base font size of the root element (html). Default is 16px.',
      min: 1,
      max: 100,
      defaultValue: 16,
    },
    emSize: {
      label: 'Parent/Element Font Size (px)',
      description: "The font size of the current element's parent. Default is 16px.",
      min: 1,
      max: 100,
      defaultValue: 16,
    },
    viewportWidth: {
      label: 'Viewport Width (px)',
      description: "The total width of the user's screen/browser window.",
      min: 320,
      max: 8192,
      defaultValue: 1920,
    },
    viewportHeight: {
      label: 'Viewport Height (px)',
      description: "The total height of the user's screen/browser window.",
      min: 320,
      max: 8192,
      defaultValue: 1080,
    },
    base: {
      label: 'Base Size for Percentage (%) (px)',
      description: 'The size (in px) that represents 100% of the value being converted.',
      min: 1,
      max: 2000,
      defaultValue: 100,
    },
  },

  conversions: {
    px: {
      rem: { func: 'pxToRem', context: ['remSize'] },
      em: { func: 'pxToEm', context: ['emSize'] },
      vw: { func: 'pxToVw', context: ['viewportWidth'] },
      vh: { func: 'pxToVh', context: ['viewportHeight'] },
      '%': { func: 'pxToPercentage', context: ['base'] },
      pt: { func: 'pxToPt', context: [] },
      in: { func: 'pxToIn', context: [] },
      pc: { func: 'pxToPc', context: [] },
      cm: { func: 'pxToCm', context: [] },
      mm: { func: 'pxToMm', context: [] },
    },

    rem: {
      px: { func: 'remToPx', context: ['remSize'] },
      em: { func: 'remToEm', context: ['remSize', 'emSize'] },
      vw: { func: 'remToVw', context: ['remSize', 'viewportWidth'] },
      vh: { func: 'remToVh', context: ['remSize', 'viewportHeight'] },
      '%': { func: 'remToPercentage', context: ['remSize', 'base'] },
      pt: { func: 'remToPt', context: ['remSize'] },
      in: { func: 'remToIn', context: ['remSize'] },
      pc: { func: 'remToPc', context: ['remSize'] },
      cm: { func: 'remToCm', context: ['remSize'] },
      mm: { func: 'remToMm', context: ['remSize'] },
    },

    em: {
      px: { func: 'emToPx', context: ['emSize'] },
      rem: { func: 'emToRem', context: ['emSize', 'remSize'] },
      vw: { func: 'emToVw', context: ['emSize', 'viewportWidth'] },
      vh: { func: 'emToVh', context: ['emSize', 'viewportHeight'] },
      '%': { func: 'emToPercentage', context: ['emSize', 'base'] },
      pt: { func: 'emToPt', context: ['emSize'] },
      in: { func: 'emToIn', context: ['emSize'] },
      pc: { func: 'emToPc', context: ['emSize'] },
      cm: { func: 'emToCm', context: ['emSize'] },
      mm: { func: 'emToMm', context: ['emSize'] },
    },

    vw: {
      px: { func: 'vwToPx', context: ['viewportWidth'] },
      rem: { func: 'vwToRem', context: ['viewportWidth', 'remSize'] },
      em: { func: 'vwToEm', context: ['viewportWidth', 'emSize'] },
      vh: { func: 'vwToVh', context: ['viewportWidth', 'viewportHeight'] },
      '%': { func: 'vwToPercentage', context: ['viewportWidth', 'base'] },
      pt: { func: 'vwToPt', context: ['viewportWidth'] },
      in: { func: 'vwToIn', context: ['viewportWidth'] },
      pc: { func: 'vwToPc', context: ['viewportWidth'] },
      cm: { func: 'vwToCm', context: ['viewportWidth'] },
      mm: { func: 'vwToMm', context: ['viewportWidth'] },
    },

    vh: {
      px: { func: 'vhToPx', context: ['viewportHeight'] },
      rem: { func: 'vhToRem', context: ['viewportHeight', 'remSize'] },
      em: { func: 'vhToEm', context: ['viewportHeight', 'emSize'] },
      vw: { func: 'vhToVw', context: ['viewportHeight', 'viewportWidth'] },
      '%': { func: 'vhToPercentage', context: ['viewportHeight', 'base'] },
      pt: { func: 'vhToPt', context: ['viewportHeight'] },
      in: { func: 'vhToIn', context: ['viewportHeight'] },
      pc: { func: 'vhToPc', context: ['viewportHeight'] },
      cm: { func: 'vhToCm', context: ['viewportHeight'] },
      mm: { func: 'vhToMm', context: ['viewportHeight'] },
    },

    '%': {
      px: { func: 'percentageToPx', context: ['base'] },
      rem: { func: 'percentageToRem', context: ['base', 'remSize'] },
      em: { func: 'percentageToEm', context: ['base', 'emSize'] },
      vw: { func: 'percentageToVw', context: ['base', 'viewportWidth'] },
      vh: { func: 'percentageToVh', context: ['base', 'viewportHeight'] },
      pt: { func: 'percentageToPt', context: ['base'] },
      in: { func: 'percentageToIn', context: ['base'] },
      pc: { func: 'percentageToPc', context: ['base'] },
      cm: { func: 'percentageToCm', context: ['base'] },
      mm: { func: 'percentageToMm', context: ['base'] },
    },

    pt: {
      px: { func: 'ptToPx', context: [] },
      rem: { func: 'ptToRem', context: ['remSize'] },
      em: { func: 'ptToEm', context: ['emSize'] },
      vw: { func: 'ptToVw', context: ['viewportWidth'] },
      vh: { func: 'ptToVh', context: ['viewportHeight'] },
      '%': { func: 'ptToPercentage', context: ['base'] },
      in: { func: 'ptToIn', context: [] },
      pc: { func: 'ptToPc', context: [] },
      cm: { func: 'ptToCm', context: [] },
      mm: { func: 'ptToMm', context: [] },
    },

    in: {
      px: { func: 'inToPx', context: [] },
      rem: { func: 'inToRem', context: ['remSize'] },
      em: { func: 'inToEm', context: ['emSize'] },
      vw: { func: 'inToVw', context: ['viewportWidth'] },
      vh: { func: 'inToVh', context: ['viewportHeight'] },
      '%': { func: 'inToPercentage', context: ['base'] },
      pt: { func: 'inToPt', context: [] },
      pc: { func: 'inToPc', context: [] },
      cm: { func: 'inToCm', context: [] },
      mm: { func: 'inToMm', context: [] },
    },

    pc: {
      px: { func: 'pcToPx', context: [] },
      rem: { func: 'pcToRem', context: ['remSize'] },
      em: { func: 'pcToEm', context: ['emSize'] },
      vw: { func: 'pcToVw', context: ['viewportWidth'] },
      vh: { func: 'pcToVh', context: ['viewportHeight'] },
      '%': { func: 'pcToPercentage', context: ['base'] },
      pt: { func: 'pcToPt', context: [] },
      in: { func: 'pcToIn', context: [] },
      cm: { func: 'pcToCm', context: [] },
      mm: { func: 'pcToMm', context: [] },
    },

    cm: {
      px: { func: 'cmToPx', context: [] },
      rem: { func: 'cmToRem', context: ['remSize'] },
      em: { func: 'cmToEm', context: ['emSize'] },
      vw: { func: 'cmToVw', context: ['viewportWidth'] },
      vh: { func: 'cmToVh', context: ['viewportHeight'] },
      '%': { func: 'cmToPercentage', context: ['base'] },
      pt: { func: 'cmToPt', context: [] },
      in: { func: 'cmToIn', context: [] },
      pc: { func: 'cmToPc', context: [] },
      mm: { func: 'cmToMm', context: [] },
    },

    mm: {
      px: { func: 'mmToPx', context: [] },
      rem: { func: 'mmToRem', context: ['remSize'] },
      em: { func: 'mmToEm', context: ['emSize'] },
      vw: { func: 'mmToVw', context: ['viewportWidth'] },
      vh: { func: 'mmToVh', context: ['viewportHeight'] },
      '%': { func: 'mmToPercentage', context: ['base'] },
      pt: { func: 'mmToPt', context: [] },
      in: { func: 'mmToIn', context: [] },
      pc: { func: 'mmToPc', context: [] },
      cm: { func: 'mmToCm', context: [] },
    },
  } as Record<string, Record<string, { func: string; context: string[] }>>,
};

interface StorageValue {
  unit: string;
  size: number;
  context: Record<string, number>;
}

const DEFAULT_VALUE: StorageValue = {
  unit: 'px',
  size: 16,
  context: Object.entries(CONFIG.contextArguments).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.defaultValue,
    }),
    {} as Record<string, number>
  ),
};

export default function CssUnitConverter() {
  const [value, setValue] = useWebStorage<StorageValue>(
    'css-unit-converter',
    'local',
    DEFAULT_VALUE
  );
  const [conversion, setConversions] = useState(
    getConversion(value.unit, value.size, value.context) as Record<string, number>
  );

  const currentUnit = CONFIG.units.find((u) => u.key === value.unit);

  const requiredContextKeys = (() => {
    if (!CONFIG.conversions[value.unit]) return [];

    const allContexts = Object.values(CONFIG.conversions[value.unit]).flatMap((c) => c.context);

    return Array.from(new Set(allContexts));
  })();

  const contextInputs = requiredContextKeys.map((key) => {
    const config = CONFIG.contextArguments[key as keyof (typeof CONFIG)['contextArguments']];

    if (!config) return null;

    return (
      <div key={key} className="flex flex-col gap-2">
        <Label htmlFor={`context-${key}`} className="text-sm">
          {config.label}
        </Label>

        <Input
          id={`context-${key}`}
          type="number"
          min={config.min}
          max={config.max}
          value={value.context[key] || config.defaultValue}
          onChange={(e) =>
            setValue((v) => ({
              ...v,
              context: { ...v.context, [key]: Number(e.target.value) },
            }))
          }
          placeholder={config.defaultValue.toString()}
          className="text-md h-10"
        />
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
    );
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConversions(getConversion(value.unit, value.size, value.context));
  }, [value.unit, value.size, value.context]);

  return (
    <Container className="gap-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center mx-auto">
        <h4 className="text-3xl">Convert</h4>

        <Select value={value.unit} onValueChange={(v) => setValue((p) => ({ ...p, unit: v }))}>
          <SelectTrigger className="w-80 text-xl h-20 min-h-12">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {CONFIG.units.map((unit) => (
              <SelectItem key={unit.key} value={unit.key}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentUnit && (
        <ClientOnly fallback={<div className="h-full" />}>
          <div className="flex flex-col gap-12 my-auto">
            <div className="flex flex-col gap-4">
              <Label htmlFor="size-input" className="text-lg">
                {currentUnit.label}
              </Label>
              <Input
                id="size-input"
                type="number"
                min={0}
                value={value.size}
                onChange={(e) => setValue((v) => ({ ...v, size: Number(e.target.value) }))}
                className="text-xl h-12"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {Object.keys(CONFIG.conversions[value.unit]).map((targetUnitKey) => {
                const unit = CONFIG.units.find((u) => u.key === targetUnitKey);

                if (!unit) return null;

                const unitValue = `${conversion[targetUnitKey]}${targetUnitKey}`;

                return (
                  <div
                    key={targetUnitKey}
                    className="flex flex-col gap-4 bg-card p-4 shadow-sm rounded-xl"
                  >
                    <div className="flex gap-2 items-center justify-between">
                      <p className="text-sm">{unit.label}</p>
                      <CopyButton content={unitValue} />
                    </div>

                    <p className="text-2xl text-center">{unitValue}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {!!requiredContextKeys.length && (
            <div className="flex flex-col gap-4">
              <h5 className="text-xl font-semibold">Conversion Context</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {contextInputs}
              </div>
            </div>
          )}
        </ClientOnly>
      )}
    </Container>
  );
}

function getConversion(inputUnit: string, inputSize: number, contextArgs: Record<string, number>) {
  const contextMap: Record<string, number> = {
    remSize: contextArgs.remSize,
    emSize: contextArgs.emSize,
    viewportWidth: contextArgs.viewportWidth,
    viewportHeight: contextArgs.viewportHeight,
    base: contextArgs.base,
  };

  return Object.entries(CONFIG.conversions[inputUnit]).reduce(
    (prev, [unit, config]) => {
      const args = [inputSize, ...config.context.map((key) => contextMap[key])];
      const convertedValue = cssConvert[config.func as keyof typeof cssConvert](
        ...(args as [number, number, number])
      );

      return {
        ...prev,
        [unit]: convertedValue,
      };
    },
    {} as Record<string, number>
  );
}
