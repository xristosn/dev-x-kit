'use client';

import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash-es';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Spinner } from './ui/spinner';
import { CopyIconButton } from './copy-button';
import { ActionError } from '@/types/action-error';
import { jssToCss, jssToTailwindV3 } from '@/lib/actions/convert/jss';
import { cn } from '@/lib/utils';

export enum CodeDisplayPreset {
  JssToCss,
  JssToTailwindV3,
  Jss,
}

interface OutputConfig {
  language: string;
  convert: (code: string) => Promise<string | ActionError> | string;
}

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

export interface CodeDisplayProps {
  code: string;
  outputs: Array<OutputConfig | CodeDisplayPreset>;
  codeWrapperClassName?: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  outputs: originalOutputs,
  codeWrapperClassName,
}) => {
  const outputs = originalOutputs.map((o) => (typeof o === 'number' ? PRESETS[o] : o));
  const [selectedOutputLanguage, setSelectedOutputLanguage] = useState(outputs[0]?.language);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});

  const result = results[selectedOutputLanguage];

  const convert = useMemo(
    () =>
      debounce(
        async (outputLanguage: string, currentCode: string, currentOutputs: OutputConfig[]) => {
          setIsLoading(true);

          try {
            const convertFn = currentOutputs.find((o) => o.language === outputLanguage)?.convert;

            if (!convertFn) throw new Error('Output language not found.');

            const result = await convertFn(currentCode);

            if (typeof result === 'object') throw new Error(result.message);

            setResults((prev) => ({ ...prev, [outputLanguage]: result }));
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        },
        300
      ),
    []
  );

  useEffect(() => {
    return () => {
      convert.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!results[selectedOutputLanguage]) {
      setIsLoading(true);
      convert(selectedOutputLanguage, code, outputs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutputLanguage, results, code, outputs]);

  useEffect(() => {
    setResults({});
  }, [code]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-sidebar text-sidebar-foreground p-4">
      <div className="flex justify-between items-center">
        <Select value={selectedOutputLanguage} onValueChange={setSelectedOutputLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {outputs.map((output) => (
              <SelectItem key={output.language} value={output.language}>
                {output.language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <CopyIconButton variant="outline" value={result || ''} disabled={!result || isLoading} />
      </div>

      <div className={cn('relative h-40 max-h-40 overflow-x-auto', codeWrapperClassName)}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : (
          <div className="relative font-mono text-sm">
            <pre className="whitespace-pre-wrap">{result || ''}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
