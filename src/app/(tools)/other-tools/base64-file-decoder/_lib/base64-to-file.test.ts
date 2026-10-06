import { beforeEach, describe, expect, it, vi } from 'vitest';
import { base64ToFile } from './base64-to-file';

describe('base64ToFile', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:decoded-file'),
    });
  });

  it('converts a data URI into a downloadable file result', async () => {
    const result = await base64ToFile('data:text/plain;base64,SGVsbG8=');

    expect(result).toEqual({
      size: 5,
      mimeType: 'text/plain',
      fileUrl: 'blob:decoded-file',
      displayName: 'Text File',
      preview: true,
    });
  });

  it('rejects empty input', async () => {
    await expect(base64ToFile('')).rejects.toThrow('Input data cannot be empty.');
  });
});
