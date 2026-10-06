import type { Options as QrOptions } from 'qr-code-styling';
import { DataSchemaTypes, getDefaultStringifiedValue } from './utils';

export type StoreValue = QrOptions & { dataType: DataSchemaTypes };

export const DEFAULT_VALUE: StoreValue = {
  width: 300,
  height: 300,
  dotsOptions: {
    type: 'rounded',
    color: '#000000',
    gradient: undefined,
  },
  cornersSquareOptions: {
    type: 'rounded',
    color: '#000000',
    gradient: undefined,
  },
  cornersDotOptions: {
    type: 'rounded',
    color: '#000000',
    gradient: undefined,
  },
  backgroundOptions: {
    color: '#FFFFFF',
    gradient: undefined,
    round: 0,
  },
  imageOptions: {
    margin: 4,
    hideBackgroundDots: true,
    imageSize: 0.25,
  },
  image: undefined,
  qrOptions: { typeNumber: 0, errorCorrectionLevel: 'Q', mode: 'Byte' },
  data: getDefaultStringifiedValue(DataSchemaTypes.Text),
  dataType: DataSchemaTypes.Text,
};
