import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { GradientValue } from '@/types/gradient';
import { GradientSlider } from './gradient-slider';

vi.mock('uuid');

const makeStop = (id: string, color: string, offset: number) => ({ id, color, offset });

const initialValue = {
  type: 'linear' as const,
  rotation: 90,
  colorStops: [makeStop('a', '#ff0000', 0), makeStop('b', '#0000ff', 100)],
};

const mockTrackRect = (left = 100, width = 200) => {
  const track = screen.getByTestId('gradient-slider-track');
  Object.defineProperty(track, 'getBoundingClientRect', {
    value: () => ({
      left,
      top: 50,
      width,
      height: 32,
      right: left + width,
      bottom: 82,
      x: left,
      y: 50,
    }),
    configurable: true,
  });
};

const setup = (value = initialValue) => {
  const setValue = vi.fn();
  const setCurrentStopId = vi.fn();
  const user = userEvent.setup();
  render(<GradientSlider value={value} setValue={setValue} setCurrentStopId={setCurrentStopId} />);
  return { user, setValue, setCurrentStopId };
};

const lastUpdater = (setValue: ReturnType<typeof vi.fn>) => {
  const fn = setValue.mock.calls.at(-1)?.[0];
  if (typeof fn !== 'function') throw new Error('last setValue call was not a function updater');
  return fn;
};

describe('<GradientSlider />', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('rendering', () => {
    test('renders the outer slider container', () => {
      setup();
      expect(screen.getByTestId('gradient-slider')).toBeInTheDocument();
    });

    test('renders the gradient preview', () => {
      setup();
      expect(screen.getByTestId('gradient-slider-preview')).toBeInTheDocument();
    });

    test('renders a thumb for each color stop', () => {
      setup();
      expect(screen.getByTestId('gradient-slider-thumb-0')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-slider-thumb-1')).toBeInTheDocument();
    });

    test('renders thumbs at correct left positions based on offset', () => {
      setup();
      const thumb0 = screen.getByTestId('gradient-slider-thumb-0');
      const thumb1 = screen.getByTestId('gradient-slider-thumb-1');
      expect(thumb0).toHaveStyle({ left: '0%' });
      expect(thumb1).toHaveStyle({ left: '100%' });
    });

    test('renders correct number of thumbs for a single stop', () => {
      setup({ type: 'linear', rotation: 0, colorStops: [makeStop('x', '#00ff00', 50)] });
      expect(screen.getByTestId('gradient-slider-thumb-0')).toBeInTheDocument();
      expect(screen.queryByTestId('gradient-slider-thumb-1')).not.toBeInTheDocument();
    });
  });

  describe('clicking the track', () => {
    test('dispatches setValue to add a new stop at clicked position', async () => {
      const { user, setValue } = setup();
      mockTrackRect(100, 200);
      await user.click(screen.getByTestId('gradient-slider-track'));
      expect(setValue).toHaveBeenCalled();
    });

    test('new stop has an id (from uuid)', async () => {
      const { user, setValue } = setup();
      mockTrackRect(100, 200);
      await user.click(screen.getByTestId('gradient-slider-track'));
      const updater = lastUpdater(setValue);
      const result = updater(initialValue);
      expect(result.colorStops.some((s: { id: string }) => s.id === 'mock-uuid')).toBe(true);
    });

    test('new stop color defaults to #ffffff', async () => {
      const { user, setValue } = setup();
      mockTrackRect(100, 200);
      await user.click(screen.getByTestId('gradient-slider-track'));
      const updater = lastUpdater(setValue);
      const result = updater(initialValue);
      const newStop = result.colorStops.find((s: { id: string }) => s.id === 'mock-uuid');
      expect(newStop?.color).toBe('#ffffff');
    });
  });

  describe('clicking a thumb', () => {
    test('calls setCurrentStopId with the clicked stop id', async () => {
      const { user, setCurrentStopId } = setup();
      await user.click(screen.getByTestId('gradient-slider-thumb-0'));
      expect(setCurrentStopId).toHaveBeenCalledWith('a');
    });

    test('calls setCurrentStopId with second stop id', async () => {
      const { user, setCurrentStopId } = setup();
      await user.click(screen.getByTestId('gradient-slider-thumb-1'));
      expect(setCurrentStopId).toHaveBeenCalledWith('b');
    });
  });

  describe('aria attributes', () => {
    test('thumb has correct aria attributes', () => {
      setup();
      const thumb0 = screen.getByTestId('gradient-slider-thumb-0');
      expect(thumb0).toHaveAttribute('role', 'slider');
      expect(thumb0).toHaveAttribute('aria-valuemin', '0');
      expect(thumb0).toHaveAttribute('aria-valuemax', '100');
      expect(thumb0).toHaveAttribute('aria-valuenow', '0');
      expect(thumb0).toHaveAttribute('aria-label', 'Thumb 1');
    });
  });

  describe('percent ↔ value conversion', () => {
    test('offset 0 maps to left 0%', () => {
      setup();
      expect(screen.getByTestId('gradient-slider-thumb-0')).toHaveStyle({ left: '0%' });
    });

    test('offset 50 maps to left 50%', () => {
      setup({ type: 'linear', rotation: 0, colorStops: [makeStop('x', '#000', 50)] });
      expect(screen.getByTestId('gradient-slider-thumb-0')).toHaveStyle({ left: '50%' });
    });

    test('offset 25 maps to left 25%', () => {
      setup({ type: 'linear', rotation: 0, colorStops: [makeStop('x', '#000', 25)] });
      expect(screen.getByTestId('gradient-slider-thumb-0')).toHaveStyle({ left: '25%' });
    });
  });

  describe('dragging', () => {
    test('moves a stop across its neighbor through the controlled slider', async () => {
      const user = userEvent.setup();
      const setCurrentStopId = vi.fn();

      function ControlledSlider() {
        const [value, setValue] = useState<GradientValue>({
          type: 'linear',
          rotation: 45,
          colorStops: [
            makeStop('a', '#ff0000', 20),
            makeStop('b', '#00ff00', 50),
            makeStop('c', '#0000ff', 80),
          ],
        });

        return (
          <>
            <GradientSlider value={value} setValue={setValue} setCurrentStopId={setCurrentStopId} />
            <output data-testid="gradient-slider-value">{JSON.stringify(value)}</output>
          </>
        );
      }

      render(<ControlledSlider />);
      mockTrackRect(100, 200);
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: screen.getByTestId('gradient-slider-thumb-1'),
          coords: { clientX: 200 },
        },
        { target: screen.getByTestId('gradient-slider-track'), coords: { clientX: 120 } },
        { keys: '[/MouseLeft]' },
      ]);

      expect(screen.getByTestId('gradient-slider-value')).toHaveTextContent(
        JSON.stringify({
          type: 'linear',
          rotation: 45,
          colorStops: [
            makeStop('b', '#00ff00', 10),
            makeStop('a', '#ff0000', 20),
            makeStop('c', '#0000ff', 80),
          ],
        })
      );
      expect(screen.getByTestId('gradient-slider-thumb-0')).toHaveAttribute('aria-valuenow', '10');
      expect(setCurrentStopId).toHaveBeenCalledWith('b');
    });
  });
});
