import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import ImageResizer from './page';
import { resizeImage } from './_lib/resize-image';

vi.mock('./_lib/resize-image', () => ({ resizeImage: vi.fn() }));

class MockImage {
  width = 640;
  height = 360;
  onload: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  private source = '';

  set src(value: string) {
    this.source = value;
    queueMicrotask(() => this.onload?.(new Event('load')));
  }

  get src() {
    return this.source;
  }
}

describe('<ImageResizer />', () => {
  const file = new File(['image'], 'photo.png', { type: 'image/png' });

  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('image-resizer');
    vi.stubGlobal('Image', MockImage);
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => 'blob:source-image') });
    vi.mocked(resizeImage).mockReset();
  });

  afterEach(() => {
    window.localStorage.removeItem('image-resizer');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
    vi.restoreAllMocks();
  });

  it('initializes image dimensions and keeps paired dimensions in sync while locked', async () => {
    const user = userEvent.setup();
    render(<ImageResizer />);

    expect(screen.queryByTestId('image-resizer-width')).not.toBeInTheDocument();
    await user.upload(screen.getByTestId('image-resizer-file-input'), file);

    const width = await screen.findByTestId('image-resizer-width');
    const height = screen.getByTestId('image-resizer-height');
    await waitFor(() => {
      expect(width).toHaveValue(640);
      expect(height).toHaveValue(360);
    });

    await user.clear(width);
    await user.type(width, '801');
    expect(height).toHaveValue(451);

    await user.clear(height);
    await user.type(height, '400');
    expect(width).toHaveValue(711);
  });

  it('resizes the selected file with current dimensions and fit settings', async () => {
    const user = userEvent.setup();
    render(<ImageResizer />);
    await user.upload(screen.getByTestId('image-resizer-file-input'), file);

    const width = await screen.findByTestId('image-resizer-width');
    await waitFor(() => expect(width).toHaveValue(640));
    await user.click(screen.getByTestId('image-resizer-lock-aspect-ratio'));
    await user.clear(width);
    await user.type(width, '800');
    await user.clear(screen.getByTestId('image-resizer-height'));
    await user.type(screen.getByTestId('image-resizer-height'), '400');
    await user.click(screen.getByTestId('image-resizer-fit-contain'));
    await user.click(screen.getByTestId('image-resizer-resize'));

    expect(resizeImage).toHaveBeenCalledWith({
      file,
      width: 800,
      height: 400,
      originalSize: { width: 640, height: 360 },
      value: expect.objectContaining({
        mode: 'dimensions',
        lockAspectRatio: false,
        fit: 'contain',
      }),
    });
  });

  it('renders at least three task-specific FAQs', () => {
    render(<ImageResizer />);

    expect(screen.getByTestId('faq-question-0')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-1')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-2')).toBeInTheDocument();
  });
});
