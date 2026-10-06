import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';
import { QrForm } from './qr-form';

describe('<QrForm />', () => {
  const props = {
    value: {
      width: 300,
      height: 300,
      dotsOptions: { type: 'rounded', color: '#000000' },
      cornersSquareOptions: { type: 'rounded', color: '#000000' },
      cornersDotOptions: { type: 'rounded', color: '#000000' },
      backgroundOptions: { color: '#FFFFFF', round: 0 },
      imageOptions: { margin: 4, hideBackgroundDots: true, imageSize: 0.25 },
      image: undefined,
      qrOptions: { typeNumber: 0, errorCorrectionLevel: 'Q', mode: 'Byte' },
      data: 'hello',
      dataType: 'Text' as import('../_lib/utils').DataSchemaTypes,
    } as never,
    setValue: vi.fn(),
    reset: vi.fn(),
    formRef: { current: null } as React.RefObject<HTMLFormElement | null>,
    onDataSubmit: vi.fn(),
    DataComponent: () => <div data-testid="form-data">Data</div>,
  };

  test('renders reset button', () => {
    render(<QrForm {...props} />);
    expect(screen.getByTestId('qr-reset')).toBeInTheDocument();
  });

  test('clicking reset calls reset prop', async () => {
    const user = userEvent.setup();
    render(<QrForm {...props} />);
    await user.click(screen.getByTestId('qr-reset'));
    expect(props.reset).toHaveBeenCalled();
  });

  test('reinitializes uncontrolled schema fields after saving data', async () => {
    const user = userEvent.setup();
    const formRef = React.createRef<HTMLFormElement>();
    const DataComponent: React.FC<{ value: unknown }> = ({ value }) => (
      <Input
        data-testid="qr-schema-input"
        name="text"
        defaultValue={(value as { text: string }).text}
      />
    );
    const StatefulQrForm: React.FC = () => {
      const [value, setValue] = React.useState(
        props.value as import('../_lib/constants').StoreValue
      );
      const onDataSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setValue((previous) => ({ ...previous, data: `saved:${formData.get('text')}` }));
      };

      return (
        <QrForm
          {...props}
          value={value}
          setValue={setValue}
          formRef={formRef}
          onDataSubmit={onDataSubmit}
          DataComponent={DataComponent}
        />
      );
    };

    render(<StatefulQrForm />);
    const schemaInput = screen.getByTestId('qr-schema-input');
    await user.clear(schemaInput);
    await user.type(schemaInput, 'updated');

    fireEvent.submit(formRef.current!);

    expect(screen.getByTestId('qr-schema-input')).toHaveValue('saved:updated');
  });

  test('clearing width applies the minimum value', async () => {
    const user = userEvent.setup();
    const StatefulQrForm: React.FC = () => {
      const [value, setValue] = React.useState(
        props.value as import('../_lib/constants').StoreValue
      );
      return <QrForm {...props} value={value} setValue={setValue} />;
    };

    render(<StatefulQrForm />);
    await user.click(screen.getByTestId('qr-sizing-trigger'));
    const widthInput = screen.getByTestId('qr-width');
    await user.clear(widthInput);

    expect(widthInput).toHaveValue(100);
  });
});
