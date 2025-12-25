interface QualityRangeProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

export const QualityRange: React.FC<QualityRangeProps> = ({ value, setValue }) => (
  <div className="w-full space-y-4">
    <div className="flex justify-between items-center">
      <label htmlFor="quality-slider" className="text-sm font-medium">
        Quality
      </label>
      <span className="text-sm text-muted-foreground font-mono">{Math.round(value * 100)}%</span>
    </div>

    <input
      id="quality-slider"
      type="range"
      min={0.1}
      max={0.99}
      step={0.01}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-runnable-track]:bg-secondary [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-track]:bg-secondary [&::-moz-range-thumb]:bg-primary"
    />
  </div>
);
