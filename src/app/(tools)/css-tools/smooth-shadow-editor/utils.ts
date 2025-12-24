import { Moon, Sun, SunMoon } from 'lucide-react';
import { ColorService } from 'react-color-palette';

export interface ShadowsStoreValue {
  layers: number;
  blur: number;
  opacity: number;
  color: string;
  offsetX: number;
  offsetY: number;
  theme: 'light' | 'dark' | 'auto';
  rounded: 'none' | 'half' | 'full';
}

export const SHADOWS_DEFAULT_VALUE: ShadowsStoreValue = {
  layers: 5,
  blur: 34,
  opacity: 0.08,
  color: '#02050f',
  offsetX: 24,
  offsetY: 16,
  theme: 'auto',
  rounded: 'half',
};

export const THEME_CONFIG: Array<{
  label: string;
  icon: React.FC;
  value: ShadowsStoreValue['theme'];
}> = [
  {
    label: 'Auto',
    icon: SunMoon,
    value: 'auto',
  },
  {
    label: 'Light',
    icon: Sun,
    value: 'light',
  },
  {
    label: 'Dark',
    icon: Moon,
    value: 'dark',
  },
];

export const ROUNDED_CONFIG: Array<{
  label: string;
  value: ShadowsStoreValue['rounded'];
}> = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Half',
    value: 'half',
  },
  {
    label: 'Full',
    value: 'full',
  },
];

export function generateSmoothShadow({
  blur,
  color,
  layers,
  offsetX,
  offsetY,
  opacity,
}: ShadowsStoreValue) {
  const { r, g, b } = ColorService.convert('hex', color).rgb;

  const shadows: string[] = [];

  for (let i = 1; i <= layers; i++) {
    const ratio = i / layers;

    const x = Math.round(offsetX * ratio);
    const y = Math.round(offsetY * ratio);
    const bRadius = Math.round(blur * ratio);
    const a = +(opacity * ratio).toFixed(2);

    shadows.push(`${x}px ${y}px ${bRadius}px rgba(${r}, ${g}, ${b}, ${a})`);
  }

  return shadows.join(',\n ');
}

export function getShadowCss(value: ShadowsStoreValue) {
  const shadow = generateSmoothShadow(value);
  return `box-shadow: ${shadow};`;
}
