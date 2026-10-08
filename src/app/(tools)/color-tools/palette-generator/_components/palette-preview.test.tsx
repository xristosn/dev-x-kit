import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { PalettePreview, type PalettePreviewProps } from './palette-preview';

describe('<PalettePreview />', () => {
  const bgColor: PalettePreviewProps['bgColor'] = '#f2f2f2';
  const primaryColor: PalettePreviewProps['primaryColor'] = '#3b82f6';
  const palette = [
    '#fef3c7',
    '#ede9fe',
    '#10b981',
    '#f97316',
    '#06b6d4',
    '#ef4444',
    '#84cc16',
    '#a855f7',
    '#ec4899',
    '#14b8a6',
    '#f59e0b',
    '#6366f1',
  ];

  test('renders preview sections', () => {
    render(<PalettePreview bgColor={bgColor} primaryColor={primaryColor} palette={palette} />);
    expect(screen.getByTestId('palette-preview-typography-heading')).toBeInTheDocument();
    expect(screen.getByTestId('palette-preview-interactive-heading')).toBeInTheDocument();
    expect(screen.getByTestId('palette-preview-surfaces-heading')).toBeInTheDocument();
  });

  test('uses bgColor for background', () => {
    render(<PalettePreview bgColor={bgColor} primaryColor={primaryColor} palette={palette} />);
    expect(screen.getByTestId('palette-preview').style.backgroundColor).toBe('rgb(242, 242, 242)');
  });

  test('uses primaryColor for text', () => {
    render(<PalettePreview bgColor={bgColor} primaryColor={primaryColor} palette={palette} />);
    expect(screen.getByTestId('palette-preview').style.color).toBe('rgb(59, 130, 246)');
  });

  test('uses primary colors for the primary action button', () => {
    render(<PalettePreview bgColor={bgColor} primaryColor={primaryColor} palette={palette} />);
    const button = screen.getByTestId('palette-preview-primary-action');
    expect(button.style.backgroundColor).toBe('rgb(59, 130, 246)');
    expect(button.style.color).toBe('rgb(242, 242, 242)');
  });

  test('uses palette colors for borders and notice surface', () => {
    render(<PalettePreview bgColor={bgColor} primaryColor={primaryColor} palette={palette} />);
    expect(screen.getByTestId('palette-preview-interactive-heading').style.borderColor).toBe(
      'rgb(16, 185, 129)'
    );
    const notice = screen.getByTestId('palette-preview-important-notice');
    expect(notice.style.backgroundColor).toBe('rgb(254, 243, 199)');
    expect(notice.style.borderColor).toBe('rgb(16, 185, 129)');
  });
});
