import { ColorService } from 'react-color-palette';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { colorToRgbString, colorToHsvString } from '@/components/color/utils';
import { CopyIconButton } from '@/components/copy-button';

export interface ColorDialogProps extends React.PropsWithChildren {
  color: string;
  name: string;
}

export const ColorDialog: React.FC<ColorDialogProps> = ({ color, children, name }) => {
  const hexColor = ColorService.convert('hex', color);
  const colors = [
    { label: 'HEX', color },
    { label: 'RGB', color: colorToRgbString(hexColor.rgb) },
    { label: 'HSV', color: colorToHsvString(hexColor.hsv) },
  ];

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <div className="w-full h-40 rounded-md border mt-4" style={{ backgroundColor: color }} />

        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {colors.map(({ label, color }) => (
            <div key={color} className="flex gap-2 items-center justify-between">
              <p className="w-20">{label}</p>
              <code>{color}</code>
              <CopyIconButton value={color} size="icon-sm" variant="outline" className="ml-auto" />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
