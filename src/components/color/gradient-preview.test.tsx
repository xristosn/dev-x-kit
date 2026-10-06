import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { GradientValue } from '@/types/gradient';
import { GradientPreview } from './gradient-preview';

const linearGradient: GradientValue = {
  type: 'linear',
  rotation: 90,
  colorStops: [
    { id: 'start', color: '#ff0000', offset: 0 },
    { id: 'end', color: '#0000ff', offset: 100 },
  ],
};

describe('<GradientPreview />', () => {
  it('renders the background from the gradient value', () => {
    render(<GradientPreview data-testid="gradient-preview" value={linearGradient} />);

    expect(screen.getByTestId('gradient-preview').style.background).toContain('linear-gradient');
    expect(screen.getByTestId('gradient-preview').style.background).toContain('rgb(255, 0, 0)');
  });

  it('updates the background when the gradient value changes', () => {
    const { rerender } = render(
      <GradientPreview data-testid="gradient-preview" value={linearGradient} />
    );
    const updatedGradient: GradientValue = {
      type: 'radial',
      rotation: 0,
      colorStops: [{ id: 'only', color: '#00ff00', offset: 0 }],
    };

    rerender(<GradientPreview data-testid="gradient-preview" value={updatedGradient} />);

    expect(screen.getByTestId('gradient-preview').style.background).toBe('rgb(0, 255, 0)');
  });

  it('forwards div attributes', () => {
    render(
      <GradientPreview
        data-testid="gradient-preview"
        title="Current gradient"
        value={linearGradient}
      />
    );

    expect(screen.getByTestId('gradient-preview')).toHaveAttribute('title', 'Current gradient');
  });
});
