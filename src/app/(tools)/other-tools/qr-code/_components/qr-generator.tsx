'use client';

import { useQrCode } from '../_hooks/use-qr-code';
import { QrForm } from './qr-form';
import { QrPreview } from './qr-preview';

export default function QrGenerator() {
  const { value, setValue, reset, formRef, qrCode, previewRef, DataComponent, onDataSubmit } =
    useQrCode();

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full max-w-[inherit]">
      <QrForm
        value={value}
        setValue={setValue}
        reset={reset}
        formRef={formRef}
        onDataSubmit={onDataSubmit}
        DataComponent={DataComponent}
      />
      <QrPreview previewRef={previewRef} qrCodeRef={qrCode} />
    </div>
  );
}
