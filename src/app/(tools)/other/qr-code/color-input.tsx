import { GRADIENT_PRESETS } from '@/lib/constants';
import { ColorPopover } from '@/components/color/color-popover';
import { ColorService, IColor } from 'react-color-palette';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GradientValue } from '@/types/gradient';
import { MousePointerClick } from 'lucide-react';
import { GradientPreview } from '@/components/color/gradient-preview';
import { GradientEditor } from '@/components/color/gradient-editor';
import { Gradient } from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import { SimpleSelect } from './simple-select';
import { InputWrapper } from '@/components/input-wrapper';

export function ColorInput({
  color,
  gradient,
  setColor,
  setGradient,
}: {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  gradient: Gradient | undefined;
  setGradient: React.Dispatch<React.SetStateAction<Gradient | undefined>>;
}) {
  const [open, setOpen] = useState(false);
  const wasOpenRef = useRef(false);
  const [prevGradient, setPrevGradient] = useState(
    (gradient as GradientValue) || GRADIENT_PRESETS[0]
  );
  const isGradient = Boolean(gradient);

  useEffect(() => {
    if (!open && wasOpenRef.current) setGradient(prevGradient);

    wasOpenRef.current = open;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="flex flex-col gap-4">
      <InputWrapper label="Color type">
        <SimpleSelect
          collection={['Single color', 'Gradient']}
          value={isGradient ? 'Gradient' : 'Single color'}
          setValue={(v) => {
            if (v === 'Gradient' && !isGradient) {
              setGradient(prevGradient);
            } else {
              setGradient(undefined);
            }
          }}
        />
      </InputWrapper>

      {isGradient ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <p className="text-sm text-left mb-2">Gradient</p>
            <GradientPreview
              value={gradient as GradientValue}
              className="min-h-10 flex items-center justify-center cursor-pointer border shadow-sm"
            >
              <div className="p-1 bg-card rounded-full">
                <MousePointerClick />
              </div>
            </GradientPreview>
          </DialogTrigger>

          <DialogContent className="max-h-[90%] overflow-auto min-w-[90%] lg:min-w-auto lg:w-90% lg:max-w-[1000px]">
            <DialogHeader>
              <DialogTitle>Gradient</DialogTitle>
            </DialogHeader>

            <GradientEditor value={prevGradient} setValue={setPrevGradient} output={false} />
          </DialogContent>
        </Dialog>
      ) : (
        <ColorPopover
          label="Color"
          value={ColorService.convert('hex', color)}
          setValue={(v) => setColor((v as IColor).hex)}
        />
      )}
    </div>
  );
}
