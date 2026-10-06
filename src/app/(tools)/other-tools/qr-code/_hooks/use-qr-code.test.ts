import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useQrCode } from './use-qr-code';
import { DEFAULT_VALUE, type StoreValue } from '../_lib/constants';
import { DATA_SCHEMA_COMPONENTS } from '../_components/data-schemas';
import { DataSchemaTypes } from '../_lib/utils';

const qrCodeMock = vi.hoisted(() => ({
  append: vi.fn(),
  update: vi.fn(),
}));

vi.mock('qr-code-styling', () => ({
  default: class QRCodeStyling {
    append = qrCodeMock.append;
    update = qrCodeMock.update;

    constructor() {}
  },
}));

describe('useQrCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  test('loads saved QR options and applies them to the renderer', () => {
    const savedValue: StoreValue = {
      ...DEFAULT_VALUE,
      data: 'Saved content',
      dotsOptions: { ...DEFAULT_VALUE.dotsOptions, color: '#123456' },
    };
    window.localStorage.setItem('qr-code-gen', JSON.stringify(savedValue));

    const { result } = renderHook(() => useQrCode());

    expect(result.current.value).toEqual(savedValue);
    expect(qrCodeMock.update).toHaveBeenLastCalledWith(savedValue);
  });

  test('updates the selected schema and QR renderer when the value changes', () => {
    const { result } = renderHook(() => useQrCode());
    const nextValue: StoreValue = {
      ...result.current.value,
      dataType: DataSchemaTypes.URL,
      data: 'https://example.com',
      width: 420,
    };

    act(() => result.current.setValue(nextValue));

    expect(result.current.value).toEqual(nextValue);
    expect(result.current.DataComponent).toBe(DATA_SCHEMA_COMPONENTS[DataSchemaTypes.URL]);
    expect(qrCodeMock.update).toHaveBeenLastCalledWith(nextValue);
    expect(JSON.parse(window.localStorage.getItem('qr-code-gen')!)).toEqual(nextValue);
  });

  test('serializes valid form data using the selected schema', () => {
    const { result } = renderHook(() => useQrCode());
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'text';
    input.value = 'Submitted QR content';
    form.append(input);
    result.current.formRef.current = form;
    const preventDefault = vi.fn();

    act(() => {
      result.current.onDataSubmit({
        preventDefault,
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(result.current.value.data).toBe('Submitted QR content');
    expect(JSON.parse(window.localStorage.getItem('qr-code-gen')!).data).toBe(
      'Submitted QR content'
    );
  });

  test('does not update QR data when the form is invalid', () => {
    const { result } = renderHook(() => useQrCode());
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.required = true;
    form.append(input);
    result.current.formRef.current = form;
    const preventDefault = vi.fn();
    qrCodeMock.update.mockClear();

    act(() => {
      result.current.onDataSubmit({
        preventDefault,
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(result.current.value.data).toBe(DEFAULT_VALUE.data);
    expect(qrCodeMock.update).not.toHaveBeenCalled();
  });

  test('resets QR options and removes the saved value', () => {
    const { result } = renderHook(() => useQrCode());
    act(() => {
      result.current.setValue({ ...result.current.value, width: 420 });
    });

    act(() => result.current.reset());

    expect(result.current.value).toEqual(DEFAULT_VALUE);
    expect(window.localStorage.getItem('qr-code-gen')).toBeNull();
    expect(qrCodeMock.update).toHaveBeenLastCalledWith(DEFAULT_VALUE);
  });
});
