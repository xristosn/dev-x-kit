// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getBase64FileType } from './get-base64-file-type';

const CANONICAL_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const JPEG_HEADER = Uint8Array.from([
  0xff,
  0xd8,
  0xff,
  0xe0, // SOI marker + JFIF APP0 marker
  0x00,
  0x10, // APP0 segment length (16)
  0x4a,
  0x46,
  0x49,
  0x46,
  0x00, // "JFIF\0"
  0x01,
  0x01, // JFIF version 1.1
  0x00, // density units: aspect ratio only
  0x00,
  0x01,
  0x00,
  0x01, // horizontal / vertical density: 1
  0x00,
  0x00, // no thumbnail
]);

const PDF_HEADER = Uint8Array.from(
  Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n', 'utf8')
);

const toBase64 = (bytes: Uint8Array): string => Buffer.from(bytes).toString('base64');

describe('getBase64FileType', () => {
  describe('detecting known file types', () => {
    it('returns image/png for a real PNG payload', async () => {
      await expect(getBase64FileType(CANONICAL_PNG)).resolves.toBe('image/png');
    });

    it('returns image/jpeg for a JPEG payload', async () => {
      await expect(getBase64FileType(toBase64(JPEG_HEADER))).resolves.toBe('image/jpeg');
    });

    it('returns application/pdf for a PDF payload', async () => {
      await expect(getBase64FileType(toBase64(PDF_HEADER))).resolves.toBe('application/pdf');
    });

    it('detects PNG even when trailing bytes follow the file data', async () => {
      const padded = Buffer.concat([
        Buffer.from(CANONICAL_PNG, 'base64'),
        Buffer.alloc(1024, 0xab),
      ]).toString('base64');

      await expect(getBase64FileType(padded)).resolves.toBe('image/png');
    });
  });

  describe('rejecting undetectable payloads', () => {
    it.each([
      ['the input is empty', ''],
      [
        'the decoded bytes have no known signature',
        Buffer.from('hello world', 'utf8').toString('base64'),
      ],
      ['the input is not valid base64', '!!!!'],
    ])('throws when %s', async (_reason, input) => {
      await expect(getBase64FileType(input)).rejects.toThrow('File type could not be determined.');
    });

    it('throws when the payload is truncated before the format signature completes', async () => {
      const bytes = Buffer.from(CANONICAL_PNG, 'base64').subarray(0, 4);
      await expect(getBase64FileType(bytes.toString('base64'))).rejects.toThrow(
        'File type could not be determined.'
      );
    });

    it('identifies a PNG truncated to signature + IHDR marker (20 bytes)', async () => {
      const bytes = Buffer.from(CANONICAL_PNG, 'base64').subarray(0, 20);
      await expect(getBase64FileType(bytes.toString('base64'))).resolves.toBe('image/png');
    });

    it('rejects a full data URI, only raw base64 is supported', async () => {
      const dataUri = `data:image/png;base64,${CANONICAL_PNG}`;
      await expect(getBase64FileType(dataUri)).rejects.toThrow(
        'File type could not be determined.'
      );
    });
  });
});
