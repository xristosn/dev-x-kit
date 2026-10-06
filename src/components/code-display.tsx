'use client';

import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash-es';
import { ClientOnly } from '@/components/client-only';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { Spinner } from './ui/spinner';
import { CopyIconButton } from './copy-button';
import { isActionError, type ActionError } from '@/lib/action-error';
import { jssToCss, jssToTailwindV3 } from '@/lib/actions/convert/jss';
import { CODE_DISPLAY_DEBOUNCE_MS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const CodeDisplayPreset = {
  JssToCss: 0,
  JssToTailwindV3: 1,
  Jss: 2,
} as const;

export type CodeDisplayPreset = (typeof CodeDisplayPreset)[keyof typeof CodeDisplayPreset];

type OutputConfig = {
  language: string;
  convert: (code: string) => Promise<string | ActionError> | string;
};

const PRESETS: Record<CodeDisplayPreset, OutputConfig> = {
  [CodeDisplayPreset.JssToCss]: {
    language: 'CSS',
    convert: (jss) => jssToCss(jss, { rawOutput: true }),
  },
  [CodeDisplayPreset.JssToTailwindV3]: {
    language: 'Tailwind V3',
    convert: (jss) => jssToTailwindV3(jss, { rawOutput: true }),
  },
  [CodeDisplayPreset.Jss]: {
    language: 'JSS',
    convert: (code) => code.replace(/\\n/g, ' '),
  },
};

export type CodeDisplayProps = {
  code: string;
  outputs: Array<OutputConfig | CodeDisplayPreset>;
  codeWrapperClassName?: string;
};

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  outputs: originalOutputs,
  codeWrapperClassName,
}) => {
  const outputs = useMemo(
    () => originalOutputs.map((o) => (typeof o === 'number' ? PRESETS[o] : o)),
    [originalOutputs]
  );
  const [selectedOutputLanguage, setSelectedOutputLanguage] = useState(outputs[0]?.language);

  return (
    <CodeDisplayOutput
      key={code}
      code={code}
      outputs={outputs}
      selectedOutputLanguage={selectedOutputLanguage}
      onOutputLanguageChange={(language) =>
        setSelectedOutputLanguage(language ?? selectedOutputLanguage)
      }
      codeWrapperClassName={codeWrapperClassName}
    />
  );
};

type CodeDisplayOutputProps = {
  code: string;
  outputs: OutputConfig[];
  selectedOutputLanguage: string | undefined;
  onOutputLanguageChange: (language: string | null) => void;
  codeWrapperClassName?: string;
};

const CodeDisplayOutput: React.FC<CodeDisplayOutputProps> = ({
  code,
  outputs,
  selectedOutputLanguage,
  onOutputLanguageChange,
  codeWrapperClassName,
}) => {
  const [results, setResults] = useState<Record<string, string | ActionError>>({});
  const result = selectedOutputLanguage !== undefined ? results[selectedOutputLanguage] : undefined;
  const output = typeof result === 'string' ? result : '';
  const isLoading =
    selectedOutputLanguage !== undefined && !Object.hasOwn(results, selectedOutputLanguage);

  const convert = useMemo(
    () =>
      debounce(
        async (outputLanguage: string, currentCode: string, currentOutputs: OutputConfig[]) => {
          try {
            const convertFn = currentOutputs.find((o) => o.language === outputLanguage)?.convert;

            if (!convertFn) throw new Error('Output language not found.');

            const result = await convertFn(currentCode);

            if (isActionError(result) && result.kind === 'unexpected') {
              console.error('[Conversion Failed] Reference ID:', result.referenceId);
            }

            setResults((prev) => ({ ...prev, [outputLanguage]: result }));
          } catch {
            setResults((prev) => ({ ...prev, [outputLanguage]: '' }));
          }
        },
        CODE_DISPLAY_DEBOUNCE_MS
      ),
    []
  );

  useEffect(() => {
    return () => {
      convert.cancel();
    };
  }, [convert]);

  useEffect(() => {
    if (selectedOutputLanguage !== undefined && !Object.hasOwn(results, selectedOutputLanguage)) {
      convert(selectedOutputLanguage, code, outputs);
    }
  }, [selectedOutputLanguage, results, code, outputs, convert]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-sidebar text-sidebar-foreground p-4">
      <div className="flex justify-between items-center">
        <Select
          data-testid="code-display-select"
          value={selectedOutputLanguage}
          onValueChange={onOutputLanguageChange}
        >
          <SelectTrigger data-testid="code-display-select-trigger">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {outputs.map((output) => (
              <SelectItem
                key={output.language}
                data-testid={`code-display-option-${output.language}`}
                value={output.language}
              >
                {output.language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ClientOnly fallback={<Skeleton className="size-8" />}>
          <CopyIconButton
            data-testid="code-display-copy"
            variant="outline"
            value={output}
            disabled={!output || isLoading}
          />
        </ClientOnly>
      </div>

      <div className={cn('relative h-40 max-h-40 overflow-x-auto', codeWrapperClassName)}>
        {isLoading ? (
          <div
            data-testid="code-display-loading"
            className="w-full h-full flex items-center justify-center"
          >
            <Spinner className="size-8" />
          </div>
        ) : (
          <div data-testid="code-display-result" className="relative font-mono text-sm">
            <pre data-testid="code-display-output" className="whitespace-pre-wrap">
              {output}
            </pre>
            {isActionError(result) && (
              <div data-testid="code-display-error" className="mt-2 text-destructive">
                <p>{result.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
