'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FitMode, ImageResizerStoreValue } from './utils';
import { Label } from '@/components/ui/label';
import { InputWrapper } from '@/components/input-wrapper';
import { ColorPopover } from '@/components/color/color-popover';
import { ColorService, IColor } from 'react-color-palette';

export interface FitModeInputProps {
  value: ImageResizerStoreValue;
  setValue: React.Dispatch<React.SetStateAction<ImageResizerStoreValue>>;
}

export const FitModeInput: React.FC<FitModeInputProps> = ({ value, setValue }) => (
  <>
    <InputWrapper label="Fit Mode" id="img-resize-fitmode">
      <RadioGroup
        id="img-resize-fitmode"
        value={value.fit}
        onValueChange={(v) => setValue((p) => ({ ...p, fit: v as FitMode }))}
        className="flex gap-8"
      >
        <div className="flex items-center gap-4">
          <RadioGroupItem value="cover" id="img-resize-cover" />
          <Label htmlFor="img-resize-cover">Crop</Label>
        </div>

        <div className="flex items-center gap-4">
          <RadioGroupItem value="contain" id="img-resize-contain" />
          <Label htmlFor="img-resize-contain">Pad</Label>
        </div>

        <div className="flex items-center gap-4">
          <RadioGroupItem value="fill" id="img-resize-fill" />
          <Label htmlFor="img-resize-fill">Distort</Label>
        </div>
      </RadioGroup>
    </InputWrapper>

    {value.fit === 'contain' && (
      <InputWrapper
        label="Background Color"
        helperText="Choose a color to fill the background when padding the image."
      >
        <ColorPopover
          value={ColorService.convert('hex', value.background)}
          setValue={(v) => setValue((p) => ({ ...p, background: (v as IColor).hex }))}
        />
      </InputWrapper>
    )}
  </>
);
