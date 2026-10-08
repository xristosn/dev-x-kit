import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Compressor from 'compressorjs';
import JSZip from 'jszip';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import ImageConverter from './page';

vi.mock('@/components/ui/file-upload', () => ({
  FileUpload: ({ onDropAccepted }: { onDropAccepted: (files: File[]) => void }) => (
    <input
      data-testid="image-converter-upload"
      type="file"
      multiple
      onChange={(event) => onDropAccepted(Array.from(event.currentTarget.files ?? []))}
    />
  ),
}));

vi.mock('compressorjs', () => ({ default: vi.fn() }));

const createFile = (name: string, type = 'image/png', size = 4) =>
  new File([new Uint8Array(size)], name, { type });

let objectUrlCount = 0;
type CompressorOptions = NonNullable<ConstructorParameters<typeof Compressor>[1]>;

const mockCompressorSuccess = (outputFile = createFile('converted.webp', 'image/webp', 2)) => {
  vi.mocked(Compressor).mockImplementation(
    class {
      constructor(_file: File | Blob, options?: CompressorOptions) {
        queueMicrotask(() => options?.success?.call(this, outputFile));
      }

      abort() {}
    }
  );
};

describe('<ImageConverter />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('image-converter');
    vi.stubGlobal('fetch', vi.fn());
    objectUrlCount = 0;
    vi.spyOn(URL, 'createObjectURL').mockImplementation(
      () => `blob:image-converter-${++objectUrlCount}`
    );
  });

  afterEach(() => {
    window.localStorage.removeItem('image-converter');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
    vi.restoreAllMocks();
  });

  it('caps accepted uploads at the maximum file count', async () => {
    const user = userEvent.setup();
    render(<ImageConverter />);
    const files = Array.from({ length: 17 }, (_, index) => createFile(`image-${index}.png`));

    await user.upload(screen.getByTestId('image-converter-upload'), files);

    expect(screen.getByTestId('image-converter-convert')).toHaveTextContent('Convert 15 files');
  });

  it('shows the opaque color control only for JPEG and BMP output', async () => {
    const user = userEvent.setup();
    render(<ImageConverter />);

    expect(screen.queryByTestId('image-converter-opaque-color')).not.toBeInTheDocument();

    await user.upload(screen.getByTestId('image-converter-upload'), createFile('image.png'));
    await user.click(screen.getByTestId('image-converter-format-jpeg'));
    expect(screen.getByTestId('image-converter-opaque-color')).toBeInTheDocument();

    await user.click(screen.getByTestId('image-converter-format-png'));
    expect(screen.queryByTestId('image-converter-opaque-color')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('image-converter-format-bmp'));
    expect(screen.getByTestId('image-converter-opaque-color')).toBeInTheDocument();
  });

  it('passes through files that already use the selected format', async () => {
    const user = userEvent.setup();
    const file = createFile('already.webp', 'image/webp', 8);
    render(<ImageConverter />);

    await user.upload(screen.getByTestId('image-converter-upload'), file);

    expect(screen.getByTestId('image-file-name-0')).toHaveTextContent('already.webp');
    expect(screen.getByTestId('image-file-type-0')).toHaveTextContent('image/webp');
    expect(screen.getByTestId('image-file-size-0')).toHaveTextContent('8 B');

    await user.click(screen.getByTestId('image-converter-convert'));

    expect(Compressor).not.toHaveBeenCalled();
    expect(screen.getByTestId('image-converter-completion')).toBeInTheDocument();
    expect(screen.getByTestId('image-converter-file-download-already.webp')).toHaveAttribute(
      'href',
      'blob:image-converter-1'
    );
    expect(screen.getByTestId('image-converter-original-size')).toHaveTextContent('8 B');
    expect(screen.getByTestId('image-converter-converted-size')).toHaveTextContent('8 B');
  });

  it('converts files with the selected MIME type and configured opaque color', async () => {
    const user = userEvent.setup();
    const file = createFile('source.png');
    const output = createFile('output.jpg', 'image/jpeg', 2);
    mockCompressorSuccess(output);
    window.localStorage.setItem(
      'image-converter',
      JSON.stringify({ to: 'image/webp', opaqueColor: '#123456' })
    );
    render(<ImageConverter />);

    await user.upload(screen.getByTestId('image-converter-upload'), file);
    await user.click(screen.getByTestId('image-converter-format-jpeg'));
    const beforeDraw = vi.fn();
    const context = {
      fillStyle: '' as string | CanvasGradient | CanvasPattern,
      fillRect: beforeDraw,
    } as unknown as CanvasRenderingContext2D;
    vi.mocked(Compressor).mockImplementation(
      class {
        constructor(_input: File | Blob, options?: CompressorOptions) {
          queueMicrotask(() => {
            options?.beforeDraw?.call(this, context, {
              width: 20,
              height: 10,
            } as HTMLCanvasElement);
            options?.success?.call(this, output);
          });
        }

        abort() {}
      }
    );

    await user.click(screen.getByTestId('image-converter-convert'));

    expect(Compressor).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ quality: 1, mimeType: 'image/jpeg', retainExif: true })
    );
    expect(context.fillStyle).toBe('#123456');
    expect(beforeDraw).toHaveBeenCalledWith(0, 0, 20, 10);
    expect(screen.getByTestId('image-converter-file-download-source.png')).toHaveAttribute(
      'href',
      'blob:image-converter-1'
    );
    expect(screen.getByTestId('image-converter-completion')).toBeInTheDocument();
  });

  it('records a conversion error and finishes the remaining files', async () => {
    const user = userEvent.setup();
    const failedFile = createFile('failed.png');
    const successfulFile = createFile('successful.png');
    vi.mocked(Compressor)
      .mockImplementationOnce(
        class {
          constructor(_file: File | Blob, options?: CompressorOptions) {
            queueMicrotask(() => options?.error?.call(this, new Error('Unsupported image')));
          }

          abort() {}
        }
      )
      .mockImplementationOnce(
        class {
          constructor(_file: File | Blob, options?: CompressorOptions) {
            queueMicrotask(() =>
              options?.success?.call(this, createFile('converted.webp', 'image/webp', 2))
            );
          }

          abort() {}
        }
      );
    render(<ImageConverter />);

    await user.upload(screen.getByTestId('image-converter-upload'), [failedFile, successfulFile]);
    await user.click(screen.getByTestId('image-converter-convert'));

    expect(await screen.findByTestId('image-converter-file-error-failed.png')).toHaveTextContent(
      'Unsupported image'
    );
    await waitFor(() =>
      expect(screen.getByTestId('image-converter-completion')).toBeInTheDocument()
    );
    expect(screen.getByTestId('image-converter-file-download-successful.png')).toBeInTheDocument();
  });

  it('resets the workflow when Start Over is clicked', async () => {
    const user = userEvent.setup();
    mockCompressorSuccess(createFile('converted.webp', 'image/webp', 2));
    render(<ImageConverter />);

    await user.upload(screen.getByTestId('image-converter-upload'), createFile('source.png'));
    await user.click(screen.getByTestId('image-converter-convert'));
    expect(await screen.findByTestId('image-converter-completion')).toBeInTheDocument();

    await user.click(screen.getByTestId('image-converter-start-over'));

    expect(screen.getByTestId('image-converter-upload')).toBeInTheDocument();
    expect(
      screen.queryByTestId('image-converter-file-download-source.png')
    ).not.toBeInTheDocument();
  });

  it('downloads only successful results in a ZIP archive', async () => {
    const user = userEvent.setup();
    vi.mocked(Compressor)
      .mockImplementationOnce(
        class {
          constructor(_file: File | Blob, options?: CompressorOptions) {
            queueMicrotask(() => options?.error?.call(this, new Error('Unsupported image')));
          }

          abort() {}
        }
      )
      .mockImplementationOnce(
        class {
          constructor(_file: File | Blob, options?: CompressorOptions) {
            queueMicrotask(() =>
              options?.success?.call(this, createFile('converted.webp', 'image/webp', 2))
            );
          }

          abort() {}
        }
      );
    const clickedLinks: HTMLAnchorElement[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      clickedLinks.push(this);
    });
    render(<ImageConverter />);

    await user.upload(screen.getByTestId('image-converter-upload'), [
      createFile('failed.png'),
      createFile('successful.png'),
    ]);
    await user.click(screen.getByTestId('image-converter-convert'));
    expect(await screen.findByTestId('image-converter-completion')).toBeInTheDocument();
    await user.click(screen.getByTestId('image-converter-download-all'));

    await waitFor(() => expect(clickedLinks).toHaveLength(1));
    expect(clickedLinks[0].download).toBe('converted_images.zip');
    expect(fetch).not.toHaveBeenCalled();
    const zipBlob = vi.mocked(URL.createObjectURL).mock.calls[1][0] as Blob;
    const archive = await JSZip.loadAsync(zipBlob);
    expect(Object.keys(archive.files)).toEqual(['successful.png']);
  });

  it('renders at least three task-specific FAQs', () => {
    render(<ImageConverter />);

    expect(screen.getByTestId('faq-question-0')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-1')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-2')).toBeInTheDocument();
  });
});
