import { ClientOnly } from '@/components/client-only';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';

export interface InputSliderProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
  step: number;
  id?: string;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  value,
  setValue,
  min,
  max,
  step,
  id,
}) => {
  return (
    <div className="flex gap-4 items-center">
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => setValue(Math.min(max, Math.max(min, Number(e.target.value))))}
        min={min}
        max={max}
        step={step}
        className="w-36"
      />

      <ClientOnly fallback={<Skeleton className="h-1 w-full" />}>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(v) => setValue(v[0])}
        />
      </ClientOnly>
    </div>
  );
};
