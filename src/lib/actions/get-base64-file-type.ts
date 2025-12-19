'use server';

import 'server-only';
import { fileTypeFromBuffer } from 'file-type';

export async function getBase64FileType(rawBase64Data: string) {
  const buffer = Buffer.from(rawBase64Data, 'base64');

  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    throw new Error('File type could not be determined.');
  }

  return fileType.mime;
}
