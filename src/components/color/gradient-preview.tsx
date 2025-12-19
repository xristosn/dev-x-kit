'use client';

import { cn } from '@/lib/utils';
import { GradientValue } from '@/types/gradient';
import { useEffect, useRef } from 'react';
import { getGradientColor } from './utils';

export interface GradientPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  value: GradientValue;
}

export const GradientPreview: React.FC<GradientPreviewProps> = ({ className, value, ...rest }) => {
  const gradientRef = useRef<HTMLDivElement>(null);

  const updateGradientColor = () => {
    if (!gradientRef.current) return;

    gradientRef.current.style.background = getGradientColor(value);
  };

  useEffect(() => {
    if (!gradientRef.current) return;

    updateGradientColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <div {...rest} ref={gradientRef} className={cn('rounded-xl bg-card', className)} />;
};
