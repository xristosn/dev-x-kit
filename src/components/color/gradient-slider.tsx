'use client';

import type React from 'react';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GradientValue } from '@/types/gradient';
import { GradientPreview } from './gradient-preview';
import { v4 as uuid } from 'uuid';
import { moveGradientStop, sortStops } from './utils';

type GradientSliderProps = {
  value: GradientValue;
  setValue: React.Dispatch<React.SetStateAction<GradientValue>>;
  setCurrentStopId: React.Dispatch<React.SetStateAction<string>>;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

export const GradientSlider: React.FC<GradientSliderProps> = ({
  value,
  setValue,
  min = 0,
  max = 100,
  step = 1,
  className,
  setCurrentStopId,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const valueToPercent = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const onThumbMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIndex(index);
    setCurrentStopId(value.colorStops[index].id);
  };

  const onThumbTouchStart = (index: number) => (e: React.TouchEvent) => {
    e.preventDefault();
    setDraggingIndex(index);
    setCurrentStopId(value.colorStops[index].id);
  };

  const calculateValueFromClick = (clientX: number) => {
    if (!sliderRef.current) return null;

    const track = sliderRef.current;
    const { left, width } = track.getBoundingClientRect();

    let clickPosition = clientX - left;

    if (clickPosition < 0) clickPosition = 0;
    if (clickPosition > width) clickPosition = width;

    const percentage = clickPosition / width;
    const value = 100 * percentage;

    return Math.round(value);
  };

  const onTrackClick = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.target instanceof HTMLElement && e.target.getAttribute('data-slot') === 'thumb') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const newOffset = calculateValueFromClick(e.clientX);

    if (newOffset === null) return;

    setValue((p) => ({
      ...p,
      colorStops: [...p.colorStops, { id: uuid(), color: '#ffffff', offset: newOffset }].sort(
        sortStops
      ),
    }));
  };

  const updateThumbPosition = (clientX: number) => {
    if (draggingIndex === null || !sliderRef.current) return;

    const { left, width } = sliderRef.current.getBoundingClientRect();
    const newStops = moveGradientStop(value.colorStops, draggingIndex, {
      clientX,
      left,
      width,
      min,
      max,
      step,
    });

    setValue((p) => ({
      ...p,
      colorStops: newStops,
    }));
  };

  useEffect(() => {
    if (draggingIndex === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateThumbPosition(e.clientX);
    };

    const handleMouseUp = () => {
      setDraggingIndex(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingIndex]);

  return (
    <div data-testid="gradient-slider" className={cn('relative w-full', className)}>
      <div
        ref={sliderRef}
        data-testid="gradient-slider-track"
        className="relative w-full cursor-pointer"
        onPointerDown={onTrackClick}
      >
        <GradientPreview
          data-testid="gradient-slider-preview"
          value={value}
          className="h-8 rounded-sm"
        />

        {value.colorStops.map(({ offset: value, color }, index) => {
          const percent = valueToPercent(value);

          return (
            <div
              key={index}
              data-testid={`gradient-slider-thumb-${index}`}
              data-slot="thumb"
              className={cn(
                'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
                'w-2 h-8 rounded-xs border-2 border-background outline-2 outline-foreground',
                'cursor-grab active:cursor-grabbing',
                'transition-transform hover:scale-110',
                draggingIndex === index && 'scale-110 cursor-grabbing'
              )}
              style={{
                left: `${percent}%`,
                backgroundColor: color,
              }}
              onMouseDown={onThumbMouseDown(index)}
              onTouchStart={onThumbTouchStart(index)}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              aria-label={`Thumb ${index + 1}`}
              tabIndex={0}
            />
          );
        })}
      </div>
    </div>
  );
};
