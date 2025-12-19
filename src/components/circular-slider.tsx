'use client';

import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  disabled?: boolean;
}

export function CircularSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  size = 200,
  strokeWidth,
  className,
  disabled = false,
}: CircularSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const responsiveStrokeWidth = strokeWidth ?? Math.max(2, size * 0.06);
  const handleRadius = Math.max(4, responsiveStrokeWidth * 1.2);
  const inputFontSize = Math.max(12, size * 0.18);

  const padding = handleRadius + 2;
  const viewBoxSize = size + padding * 2;
  const center = viewBoxSize / 2;
  const radius = (size - responsiveStrokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const percentage = ((value - min) / (max - min)) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const calculateAngle = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    let angle = Math.atan2(deltaY, deltaX);
    angle = angle * (180 / Math.PI) + 90;

    if (angle < 0) angle += 360;

    const newValue = min + (angle / 360) * (max - min);
    onChange(Math.round(Math.max(min, Math.min(max, newValue))));
  };

  const handleMouseDown = () => {
    if (disabled) return;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        calculateAngle(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        calculateAngle(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, min, max, onChange]);

  const handleAngle = ((value - min) / (max - min)) * 360 - 90;
  const handleX = center + radius * Math.cos((handleAngle * Math.PI) / 180);
  const handleY = center + radius * Math.sin((handleAngle * Math.PI) / 180);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = Number.parseInt(inputValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
      setInputValue(clampedValue.toString());
    } else {
      setInputValue(value.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        disabled && 'opacity-50',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className={cn(
          'select-none overflow-visible',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
        style={{ display: 'block' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={responsiveStrokeWidth}
          className="text-muted opacity-60"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={responsiveStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />

        <circle
          cx={handleX}
          cy={handleY}
          r={handleRadius}
          fill="currentColor"
          className="text-primary drop-shadow-md"
        />
        <circle
          cx={handleX}
          cy={handleY}
          r={handleRadius * 0.5}
          fill="currentColor"
          className="text-background"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center pointer-events-auto">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setIsEditing(true)}
            disabled={disabled}
            style={{
              fontSize: `${inputFontSize}px`,
              width: `${Math.min(size * 0.5, 80)}px`,
            }}
            className="font-bold tabular-nums text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
          />
        </div>
      </div>
    </div>
  );
}
