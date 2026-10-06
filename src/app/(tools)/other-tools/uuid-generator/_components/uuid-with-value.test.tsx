import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { validate } from 'uuid';
import { UUIDWithValue } from './uuid-with-value';

describe('<UUIDWithValue />', () => {
  test.each(['v3', 'v5'] as const)(
    'generates a valid %s UUID from the input value',
    async (type) => {
      const user = userEvent.setup();
      render(<UUIDWithValue type={type} title={`UUID ${type}`} />);

      const output = screen.getByTestId('uuid-card-value');
      const initialValue = output.textContent;
      await user.clear(screen.getByTestId(`uuid-${type}-value`));
      await user.type(screen.getByTestId(`uuid-${type}-value`), 'example.com');

      expect(output.textContent).not.toBe(initialValue);
      expect(validate(output.textContent ?? '')).toBe(true);
      expect(output.textContent?.[14]).toBe(type === 'v3' ? '3' : '5');
    }
  );

  test.each(['v3', 'v5'] as const)(
    'updates the namespace when a valid UUID is pasted for %s',
    (type) => {
      render(<UUIDWithValue type={type} title={`UUID ${type}`} />);

      const namespace = screen.getByTestId(`uuid-${type}-namespace`);
      const pastedNamespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      fireEvent.paste(namespace, {
        clipboardData: { getData: () => pastedNamespace },
      });

      expect(namespace).toHaveValue(pastedNamespace);
    }
  );

  test.each(['v3', 'v5'] as const)('ignores an invalid pasted namespace for %s', (type) => {
    render(<UUIDWithValue type={type} title={`UUID ${type}`} />);

    const namespace = screen.getByTestId(`uuid-${type}-namespace`);
    const initialNamespace = (namespace as HTMLInputElement).value;
    fireEvent.paste(namespace, {
      clipboardData: { getData: () => 'not-a-uuid' },
    });

    expect(namespace).toHaveValue(initialNamespace);
  });

  test.each(['v3', 'v5'] as const)('regenerates its namespace for %s', async (type) => {
    const user = userEvent.setup();
    render(<UUIDWithValue type={type} title={`UUID ${type}`} />);

    const namespace = screen.getByTestId(`uuid-${type}-namespace`);
    const initialNamespace = (namespace as HTMLInputElement).value;
    await user.click(screen.getByTestId(`uuid-${type}-namespace-refresh`));

    expect(namespace).toHaveValue();
    expect(namespace).not.toHaveValue(initialNamespace);
    expect(validate((namespace as HTMLInputElement).value)).toBe(true);
  });

  test.each(['v3', 'v5'] as const)(
    'disables copying when the input value is blank for %s',
    async (type) => {
      const user = userEvent.setup();
      render(<UUIDWithValue type={type} title={`UUID ${type}`} />);

      await user.clear(screen.getByTestId(`uuid-${type}-value`));

      expect(screen.getByTestId('uuid-card-value')).toHaveTextContent('-');
      expect(screen.getByTestId('copy-button')).toBeDisabled();
    }
  );
});
