import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { GradientEditor } from './gradient-editor';

vi.mock('react-color-palette');

vi.mock('@/components/circular-slider', () => ({
  CircularSlider: ({
    disabled: _disabled,
    onChange,
  }: {
    disabled?: boolean;
    onChange?: (v: number) => void;
  }) => (
    <div data-testid="circular-slider" data-disabled={_disabled ? 'true' : 'false'}>
      <button type="button" data-testid="circular-slider-set-180" onClick={() => onChange?.(180)}>
        set 180
      </button>
    </div>
  ),
}));

vi.mock('./hex-input', () => ({
  HexInput: ({ onChange }: { onChange?: (e: { target: { value: string } }) => void }) => (
    <input data-testid="hex-input-field" onChange={onChange} />
  ),
}));

vi.mock('./rgb-input', () => ({ RGBInput: () => <div data-testid="gradient-editor-rgb-input" /> }));

vi.mock('./hsv-input', () => ({ HSVInput: () => <div data-testid="gradient-editor-hsv-input" /> }));

vi.mock('../code-display', () => ({
  CodeDisplay: () => <div data-testid="code-display" />,
  CodeDisplayPreset: { JssToCss: 'jss-css', JssToTailwindV3: 'jss-tw', Jss: 'jss' },
}));

const makeStop = (id: string, color: string, offset: number) => ({ id, color, offset });

const initialValue = {
  type: 'linear' as const,
  rotation: 90,
  colorStops: [makeStop('a', '#ff0000', 0), makeStop('b', '#0000ff', 100)],
};

const renderEditor = (value: typeof initialValue = initialValue, output = true) => {
  const setValue = vi.fn();
  const utils = render(<GradientEditor value={value} setValue={setValue} output={output} />);
  return { user: userEvent.setup(), setValue, ...utils };
};

describe('<GradientEditor />', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('rendering', () => {
    test('renders preview and slider panels', () => {
      renderEditor();
      expect(screen.getByTestId('gradient-editor-preview')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-editor-slider')).toBeInTheDocument();
    });

    test('renders presets section with at least one preset', () => {
      renderEditor();
      expect(screen.getByTestId('gradient-editor-preset-0')).toBeInTheDocument();
    });

    test('renders output section by default and hides it when output=false', () => {
      renderEditor();
      expect(screen.getByTestId('code-display')).toBeInTheDocument();
      expect(screen.getByTestId('gradient-editor-download-png')).toBeInTheDocument();
      // Re-render with output=false in a separate test to avoid global state conflicts
    });

    test('hides output section when output=false', () => {
      renderEditor(initialValue, false);
      expect(screen.queryByTestId('code-display')).not.toBeInTheDocument();
    });
  });

  describe('type toggle', () => {
    test('clicking Linear dispatches setValue', async () => {
      const { user, setValue } = renderEditor();
      await user.click(screen.getByTestId('gradient-editor-type-linear'));
      expect(setValue).toHaveBeenCalled();
    });

    test('clicking Radial dispatches setValue', async () => {
      const { user, setValue } = renderEditor();
      await user.click(screen.getByTestId('gradient-editor-type-radial'));
      expect(setValue).toHaveBeenCalled();
    });

    test('circular slider is enabled when type is linear', () => {
      renderEditor();
      expect(screen.getByTestId('circular-slider')).toHaveAttribute('data-disabled', 'false');
    });

    test('circular slider is disabled when type is radial', () => {
      renderEditor({
        ...initialValue,
        type: 'radial',
        colorStops: [makeStop('a', '#000', 0)],
      } as unknown as typeof initialValue);
      expect(screen.getByTestId('circular-slider')).toHaveAttribute('data-disabled', 'true');
    });

    test('circular slider onChange updates rotation via setValue', async () => {
      const { user, setValue } = renderEditor();
      await user.click(screen.getByTestId('circular-slider-set-180'));
      const updater = setValue.mock.calls.at(-1)![0];
      const result = updater({ type: 'linear', rotation: 0, colorStops: [] });
      expect(result.rotation).toBe(180);
    });
  });

  describe('stop management', () => {
    test('renders a stop row for each colorStop', () => {
      renderEditor();
      const list = screen.getByTestId('gradient-editor-stops');
      // Match only rows with id='a' or id='b'. Avoid swallowing nested testids
      const rows = within(list).getAllByTestId(/^gradient-editor-stop-[a-z]$/);
      expect(rows).toHaveLength(2);
    });

    test('delete button is disabled when only one stop exists', () => {
      renderEditor({ type: 'linear', rotation: 0, colorStops: [makeStop('a', '#000', 0)] });
      expect(screen.getByTestId('gradient-editor-stop-delete')).toBeDisabled();
    });

    test('Add stop button dispatches setValue with 3 stops', async () => {
      const { user, setValue } = renderEditor();
      await user.click(screen.getByTestId('gradient-editor-add-stop'));
      // Get the first setValue call from the click (filter out render-time calls)
      const clickCalls = setValue.mock.calls.filter((args) => typeof args[0] === 'function');
      const updater = clickCalls[0][0];
      const result = updater({
        type: 'linear',
        rotation: 0,
        colorStops: [makeStop('a', '#ff0000', 0), makeStop('b', '#0000ff', 100)],
      });
      expect(result.colorStops).toHaveLength(3);
      expect(
        result.colorStops
          .map((s: { offset: number }) => s.offset)
          .sort((a: number, b: number) => a - b)
      ).toEqual([0, 50, 100]);
    });

    test('delete button removes the stop via setValue', async () => {
      const { user, setValue } = renderEditor({
        type: 'linear',
        rotation: 0,
        colorStops: [
          makeStop('a', '#ff0000', 0),
          makeStop('b', '#0000ff', 50),
          makeStop('c', '#00ff00', 100),
        ],
      });
      const list = screen.getByTestId('gradient-editor-stops');
      const row = within(list).getByTestId('gradient-editor-stop-b');
      await user.click(within(row).getByTestId('gradient-editor-stop-delete'));
      const updater = setValue.mock.calls.at(-1)![0];
      const result = updater({
        type: 'linear',
        rotation: 0,
        colorStops: [
          makeStop('a', '#ff0000', 0),
          makeStop('b', '#0000ff', 50),
          makeStop('c', '#00ff00', 100),
        ],
      });
      expect(result.colorStops.map((s: { id: string }) => s.id)).toEqual(['a', 'c']);
    });
  });

  describe('offset editing', () => {
    test('offset number input dispatches setValue on change', async () => {
      const { user, setValue } = renderEditor();
      const list = screen.getByTestId('gradient-editor-stops');
      const row = within(list).getByTestId('gradient-editor-stop-a');
      const input = within(row).getByTestId('gradient-editor-stop-offset') as HTMLInputElement;
      expect(input.value).toBe('0');
      await user.clear(input);
      await user.type(input, '42');
      expect(setValue).toHaveBeenCalled();
    });
  });

  describe('download', () => {
    let capturedLinks: { download: string }[] = [];
    // Store the original so we can restore after each test
    const origCreateElement = document.createElement.bind(document);

    beforeEach(() => {
      capturedLinks = [];
      document.createElement = ((tag: string) => {
        const el = origCreateElement(tag);
        if (tag === 'a') {
          capturedLinks.push(el as HTMLAnchorElement);
        }
        return el;
      }) as typeof document.createElement;
    });

    afterEach(() => {
      document.createElement = origCreateElement;
    });

    test.each(['png', 'jpeg', 'webp'] as const)(
      'clicking to .%s creates a download link',
      async (format) => {
        const { user } = renderEditor();
        await user.click(screen.getByTestId(`gradient-editor-download-${format}`));
        expect(capturedLinks.length).toBeGreaterThan(0);
        expect(capturedLinks[capturedLinks.length - 1].download).toBe('gradient_300x150');
      }
    );

    test('changing width/height updates the download filename', async () => {
      const { user } = renderEditor();
      const widthInput = screen.getByTestId('gradient-editor-width') as HTMLInputElement;
      await user.clear(widthInput);
      await user.type(widthInput, '500');
      await user.click(screen.getByTestId('gradient-editor-download-png'));
      expect(capturedLinks[capturedLinks.length - 1].download).toBe('gradient_500x150');
    });
  });
});
