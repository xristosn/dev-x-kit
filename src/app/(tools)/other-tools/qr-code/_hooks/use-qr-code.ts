'use client';

import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { cloneDeep } from 'lodash-es';
import { useWebStorage } from '@/hooks/use-web-storage';
import { DATA_SCHEMA_COMPONENTS } from '../_components/data-schemas';
import { getStringifiedValue, DataSchemaValueMap, DataSchemaTypes } from '../_lib/utils';
import { DEFAULT_VALUE, type StoreValue } from '../_lib/constants';

export function useQrCode() {
  const [value, setValue, reset] = useWebStorage<StoreValue>('qr-code-gen', 'local', DEFAULT_VALUE);
  const formRef = useRef<HTMLFormElement>(null);
  const qrCode = useRef(typeof window !== 'undefined' ? new QRCodeStyling(value) : null);
  const previewRef = useRef<HTMLDivElement>(null);
  const DataComponent = DATA_SCHEMA_COMPONENTS[value.dataType];

  const onDataSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!formRef.current.checkValidity()) return;

    const data = new FormData(formRef.current);
    const dataObj: Record<string, unknown> = {};
    data.forEach((v, k) => (dataObj[k] = v));

    setValue((p) => ({
      ...p,
      data: getStringifiedValue(
        p.dataType,
        // SAFETY: FormData values are always strings; parsed via schema parser.
        dataObj as unknown as DataSchemaValueMap[DataSchemaTypes]
      ),
    }));
  };

  useEffect(() => {
    if (previewRef.current && qrCode.current) {
      setValue((p) => ({ ...p, image: undefined }));
      qrCode.current.append(previewRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update(cloneDeep(value));
    }
  }, [value]);

  return {
    value,
    setValue,
    reset,
    formRef,
    qrCode,
    previewRef,
    DataComponent,
    onDataSubmit,
  };
}
