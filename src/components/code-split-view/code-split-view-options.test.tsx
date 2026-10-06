import type { ConvertOptions } from '@/types/convert';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { CodeSplitViewOptions } from './code-split-view-options';

describe('<CodeSplitViewOptions />', () => {
  // Real config used across tests. Mirrors real-world converter options
  const mockConfig: ConvertOptions = [
    {
      type: 'radio',
      name: 'format',
      label: 'Format',
      values: [
        { value: 'json', label: 'JSON' },
        { value: 'xml', label: 'XML', helperText: 'Extensible Markup Language' },
      ],
    },
    {
      type: 'switch',
      name: 'enabled',
      label: 'Enable',
      children: [{ type: 'text', name: 'prefix', label: 'Prefix', placeholder: 'e.g. x_' }],
    },
    {
      type: 'switch',
      name: 'reversed',
      label: 'Reversed Mode',
      reverse: true,
      children: [{ type: 'text', name: 'reversedValue', label: 'Reversed Value' }],
    },
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      placeholder: 'Enter name',
    },
    {
      type: 'number',
      name: 'count',
      label: 'Count',
      min: 0,
      max: 100,
      step: 1,
    },
  ];

  const defaultValue = {
    format: 'json',
    enabled: false,
    prefix: '',
    reversed: false,
    reversedValue: '',
    name: 'default-name',
    count: 10,
  };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // Shared mutable state so setValue mock actually updates component
  let sharedValue: Record<string, unknown> = {};

  function setup(props?: Partial<React.ComponentProps<typeof CodeSplitViewOptions>>) {
    sharedValue = props?.value ?? defaultValue;
    const setValue = vi.fn((fnOrVal: unknown) => {
      if (typeof fnOrVal === 'function') {
        sharedValue = (fnOrVal as (prev: typeof sharedValue) => typeof sharedValue)(sharedValue);
      } else {
        sharedValue = fnOrVal as Record<string, unknown>;
      }
    });
    const resetOptions = vi.fn();

    const utils = render(
      <CodeSplitViewOptions
        config={mockConfig}
        value={sharedValue}
        setValue={setValue}
        resetOptions={resetOptions}
        {...props}
      />
    );

    return { setValue, resetOptions, ...utils };
  }

  async function openDialog() {
    await userEvent.click(screen.getByTestId('code-split-view-options-trigger'));
    vi.advanceTimersByTime(100);
  }

  describe('rendering', () => {
    test('renders options trigger button', () => {
      setup();
      expect(screen.getByTestId('code-split-view-options-trigger')).toBeInTheDocument();
    });

    test('renders all top-level option types in dialog when opened', async () => {
      setup();
      await openDialog();

      expect(screen.getByTestId('option-format')).toBeInTheDocument();
      expect(screen.getByTestId('option-enabled')).toBeInTheDocument();
      expect(screen.getByTestId('option-reversed')).toBeInTheDocument();
      expect(screen.getByTestId('option-name')).toBeInTheDocument();
      expect(screen.getByTestId('option-count')).toBeInTheDocument();
    });

    // Children are always rendered but become disabled, this is the actual component behavior
    test('child options are rendered but disabled when parent switch is off', async () => {
      setup({ value: { ...defaultValue, enabled: false } });
      await openDialog();

      expect(screen.getByTestId('option-prefix')).toBeInTheDocument();
      const prefixInput = screen.getByTestId('option-prefix-input');
      expect(prefixInput).toBeDisabled();
    });

    test('child options are rendered and enabled when parent switch is on', async () => {
      setup({ value: { ...defaultValue, enabled: true } });
      await openDialog();

      expect(screen.getByTestId('option-prefix')).toBeInTheDocument();
      const prefixInput = screen.getByTestId('option-prefix-input');
      expect(prefixInput).not.toBeDisabled();
    });

    test('reversed switch children are disabled when reversed switch is ON', async () => {
      // With reverse: true, children are disabled when the switch is ON (checked)
      setup({ value: { ...defaultValue, reversed: true } });
      await openDialog();

      expect(screen.getByTestId('option-reversedValue')).toBeInTheDocument();
      const rvInput = screen.getByTestId('option-reversedValue-input');
      expect(rvInput).toBeDisabled();
    });

    test('reversed switch children are enabled when reversed switch is OFF', async () => {
      // With reverse: true, children are enabled when the switch is OFF (unchecked)
      setup({ value: { ...defaultValue, reversed: false } });
      await openDialog();

      expect(screen.getByTestId('option-reversedValue')).toBeInTheDocument();
      const rvInput = screen.getByTestId('option-reversedValue-input');
      expect(rvInput).not.toBeDisabled();
    });
  });

  describe('radio option', () => {
    test('radio option calls setValue when a different value is selected', async () => {
      const { setValue } = setup();
      await openDialog();

      // Current value is 'json'; click XML to trigger change
      await userEvent.click(screen.getByTestId('radio-format-xml'));

      expect(setValue).toHaveBeenCalled();
    });

    test('renders radio labels and helper text', async () => {
      setup();
      await openDialog();

      const formatOption = screen.getByTestId('option-format');
      expect(formatOption).toHaveTextContent('Format');
      expect(formatOption).toHaveTextContent('JSON');
      expect(formatOption).toHaveTextContent('XML');
      expect(formatOption).toHaveTextContent('Extensible Markup Language');
    });
  });

  describe('switch option', () => {
    test('toggling switch off updates the value and preserves other options', async () => {
      setup({ value: { ...defaultValue, enabled: true } });
      await openDialog();

      const switchEl = screen.getByTestId('option-enabled-switch');
      await userEvent.click(switchEl);

      expect(sharedValue).toEqual({ ...defaultValue, enabled: false });
    });

    test('toggling switch on updates the value and preserves other options', async () => {
      setup({ value: { ...defaultValue, enabled: false } });
      await openDialog();

      const switchEl = screen.getByTestId('option-enabled-switch');
      await userEvent.click(switchEl);

      expect(sharedValue).toEqual({ ...defaultValue, enabled: true });
    });

    test('switch is disabled when rendered under a disabled parent', async () => {
      // Test recursive parent-disable: a switch inside a disabled switch's children
      const deeplyNestedConfig: ConvertOptions = [
        {
          type: 'switch',
          name: 'top',
          label: 'Top',
          children: [
            {
              type: 'switch',
              name: 'nested',
              label: 'Nested',
            },
          ],
        },
      ];
      setup({ config: deeplyNestedConfig, value: { top: false, nested: true } });
      await openDialog();

      const nestedSwitch = screen.getByTestId('option-nested-switch');
      // Base UI applies aria-disabled for disabled state; HTML disabled is on inner input only
      expect(nestedSwitch).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('text option', () => {
    test('updates the text value and preserves other options', async () => {
      setup();
      await openDialog();

      const input = screen.getByTestId('option-name-input');
      expect(input).not.toBeDisabled();

      fireEvent.change(input, { target: { value: 'new-name' } });

      expect(sharedValue).toEqual({ ...defaultValue, name: 'new-name' });
    });

    test('text input reflects the current value', async () => {
      setup({ value: { ...defaultValue, name: 'my-name' } });
      await openDialog();

      const input = screen.getByTestId('option-name-input');
      expect(input).toHaveValue('my-name');
    });

    test('text input is disabled when parent switch is off', async () => {
      setup({ value: { ...defaultValue, enabled: false } });
      await openDialog();

      const input = screen.getByTestId('option-prefix-input');
      expect(input).toBeDisabled();
    });

    test('text input placeholder is rendered', async () => {
      setup();
      await openDialog();

      const input = screen.getByTestId('option-name-input');
      expect(input).toHaveAttribute('placeholder', 'Enter name');
    });
  });

  describe('number option', () => {
    test('renders number input with min/max/step attributes', async () => {
      setup();
      await openDialog();

      const input = screen.getByTestId('option-count-input');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
      expect(input).toHaveAttribute('step', '1');
    });

    test('updates the number value and preserves other options', async () => {
      setup();
      await openDialog();

      const input = screen.getByTestId('option-count-input');
      fireEvent.change(input, { target: { value: '42' } });

      expect(sharedValue).toEqual({ ...defaultValue, count: 42 });
    });

    test('number input reflects the current value', async () => {
      setup({ value: { ...defaultValue, count: 25 } });
      await openDialog();

      const input = screen.getByTestId('option-count-input');
      expect(input).toHaveValue(25);
    });
  });

  describe('dialog footer', () => {
    test('reset button calls resetOptions', async () => {
      const { resetOptions } = setup();
      await openDialog();

      await userEvent.click(screen.getByTestId('code-split-view-options-reset'));
      expect(resetOptions).toHaveBeenCalledTimes(1);
    });

    test('save and reset buttons are present in dialog', async () => {
      setup();
      await openDialog();

      expect(screen.getByTestId('code-split-view-options-save')).toBeInTheDocument();
      expect(screen.getByTestId('code-split-view-options-reset')).toBeInTheDocument();
    });
  });
});
