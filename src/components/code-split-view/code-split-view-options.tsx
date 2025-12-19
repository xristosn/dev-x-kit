import { ConvertOption, ConvertOptions } from '@/types/convert';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cloneDeep, get, set } from 'lodash-es';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Fragment } from 'react/jsx-runtime';
import { Separator } from '../ui/separator';
import { Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export interface CodeSplitViewOptionsProps {
  config: ConvertOptions;
  value: Record<string, unknown>;
  setValue: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  resetOptions: () => void;
}

export const CodeSplitViewOptions: React.FC<CodeSplitViewOptionsProps> = ({
  config,
  value,
  setValue,
  resetOptions,
}) => {
  const onPropChange = (name: string, value: unknown) => {
    setValue((p) => set(cloneDeep(p), name, value));
  };

  const renderOption = (prop: ConvertOption, parentDisabled = false) => {
    const currentValue = get(value, prop.name) ?? '';
    const isDisabled = parentDisabled || false;

    if (prop.type === 'radio') {
      return (
        <div key={prop.name} className="flex flex-col gap-2">
          <p>{prop.label}</p>

          <RadioGroup
            value={(currentValue as string) || ''}
            onValueChange={(v) => onPropChange(prop.name, v)}
            disabled={isDisabled}
          >
            {prop.values.map((v) => (
              <div key={v.value} className="flex items-start gap-3">
                <RadioGroupItem value={v.value} id={`${prop.name}-${v.value}`} />

                <Label
                  htmlFor={`${prop.name}-${v.value}`}
                  className="flex flex-col gap-1 items-start"
                >
                  <span>{v.label}</span>

                  {v.helperText && (
                    <span className="text-xs text-muted-foreground">{v.helperText}</span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }

    if (prop.type === 'switch') {
      const shouldDisableChildren = isDisabled || (prop.reverse ? !!currentValue : !currentValue);

      return (
        <div className="flex flex-col gap-2" key={prop.name}>
          <div className="flex items-center space-x-2">
            <Switch
              id={prop.name}
              disabled={isDisabled}
              checked={(currentValue as boolean) || false}
              onCheckedChange={(checked) => onPropChange(prop.name, checked)}
            />
            <Label htmlFor={prop.name}>{prop.label}</Label>
          </div>

          {!!prop.children?.length && (
            <div className="flex flex-col gap-1">
              {prop.children.map((o) => renderOption(o, shouldDisableChildren))}
            </div>
          )}
        </div>
      );
    }

    if (prop.type === 'text' || prop.type === 'number') {
      return (
        <div key={prop.name} className="grid w-full items-center gap-2">
          <Label htmlFor={prop.name}>{prop.label}</Label>

          <Input
            {...(prop.type === 'number' ? { min: prop.min, max: prop.max, step: prop.step } : {})}
            id={prop.name}
            type={prop.type}
            value={currentValue.toString()}
            onChange={(e) =>
              onPropChange(
                prop.name,
                prop.type === 'number' ? Number(e.target.value) : e.target.value
              )
            }
            placeholder={prop.placeholder}
            disabled={isDisabled}
          />

          {prop.helperText && <p className="text-xs text-muted-foreground">{prop.helperText}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="sm" variant="outline">
              <p>
                <Settings />
                Options
              </p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Options</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>

      <DialogContent className="lg:max-w-2xl px-4">
        <DialogHeader>
          <DialogTitle className="">Options</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[80vh] overflow-auto -mx-4 px-4 pb-1">
          {config
            .map((o) => renderOption(o))
            .filter(Boolean)
            .map((el, idx) =>
              idx === 0 ? (
                el
              ) : (
                <Fragment key={el?.key}>
                  <Separator />
                  {el}
                </Fragment>
              )
            )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={resetOptions}>
            Reset
          </Button>

          <DialogClose asChild>
            <Button variant="outline">Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
