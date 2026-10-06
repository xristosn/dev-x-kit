import { Button } from '@/components/ui/button';
import { QualityRange } from './quality-range';

type ImageCompressorSetupProps = {
  fileCount: number;
  quality: number;
  setQuality: (quality: number) => void;
  onOptimize: () => void;
};

export function ImageCompressorSetup({
  fileCount,
  quality,
  setQuality,
  onOptimize,
}: ImageCompressorSetupProps) {
  return (
    <div className="flex flex-col items-center gap-8 my-12 max-w-md mx-auto w-full">
      <QualityRange value={quality} setValue={setQuality} />

      <Button
        size="lg"
        className="text-xl font-bold h-12 w-full"
        variant="outline"
        data-testid="image-compressor-convert"
        onClick={onOptimize}
      >
        Convert {fileCount} file{fileCount === 1 ? '' : 's'}
      </Button>
    </div>
  );
}
