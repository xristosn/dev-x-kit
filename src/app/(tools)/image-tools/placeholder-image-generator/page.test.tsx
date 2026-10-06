import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import PlaceholderImageGenerator from './page';

const { downloadImageMock, generatePlaceholderImageMock } = vi.hoisted(() => ({
  downloadImageMock: vi.fn(),
  generatePlaceholderImageMock: vi.fn(
    (backgroundColor: string, width: number, height: number, text?: string) =>
      `mock:${backgroundColor}:${width}x${height}:${text ?? ''}`
  ),
}));

vi.mock('./_lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./_lib/utils')>();

  return {
    ...actual,
    downloadImage: downloadImageMock,
    generatePlaceholderImage: generatePlaceholderImageMock,
  };
});

describe('<PlaceholderImageGenerator />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('img-placeholder-gen');
    generatePlaceholderImageMock.mockClear();
    downloadImageMock.mockClear();
  });

  afterEach(() => {
    window.localStorage.removeItem('img-placeholder-gen');
    window.localStorage.removeItem('recent-colors');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
    vi.restoreAllMocks();
  });

  it('renders the default dimensions and links the PNG download to the preview', () => {
    render(<PlaceholderImageGenerator />);

    const preview = screen.getByTestId('placeholder-image-preview');
    const pngDownload = screen.getByTestId('placeholder-image-download-png');

    expect(screen.getByTestId('placeholder-image-width')).toHaveValue(200);
    expect(screen.getByTestId('placeholder-image-height')).toHaveValue(200);
    expect(preview).toHaveAttribute('src', 'mock:#000000:200x200:');
    expect(preview).toHaveAttribute('width', '200');
    expect(preview).toHaveAttribute('height', '200');
    expect(pngDownload).toHaveAttribute('href', 'mock:#000000:200x200:');
    expect(pngDownload).toHaveAttribute('download', 'placeholder.png');
    expect(generatePlaceholderImageMock).toHaveBeenLastCalledWith('#000000', 200, 200, '');
  });

  it('loads saved settings into the controls and preview', () => {
    window.localStorage.setItem(
      'img-placeholder-gen',
      JSON.stringify({ backgroundColor: '#abcdef', width: 640, height: 360, text: 'Saved' })
    );

    render(<PlaceholderImageGenerator />);

    expect(screen.getByTestId('placeholder-image-width')).toHaveValue(640);
    expect(screen.getByTestId('placeholder-image-height')).toHaveValue(360);
    expect(screen.getByTestId('placeholder-image-text')).toHaveValue('Saved');
    expect(screen.getByTestId('placeholder-image-preview')).toHaveAttribute(
      'src',
      'mock:#abcdef:640x360:Saved'
    );
  });

  it('updates the preview when text and dimensions change, clamping dimensions to 1–9999', async () => {
    const user = userEvent.setup();
    render(<PlaceholderImageGenerator />);

    const width = screen.getByTestId('placeholder-image-width');
    const height = screen.getByTestId('placeholder-image-height');
    const text = screen.getByTestId('placeholder-image-text');

    await user.click(width);
    await user.keyboard('{Control>}a{/Control}12000');
    await user.click(height);
    await user.keyboard('{Control>}a{/Control}0');
    await user.clear(text);
    await user.type(text, 'Example');

    expect(screen.getByTestId('placeholder-image-width')).toHaveValue(9999);
    expect(screen.getByTestId('placeholder-image-height')).toHaveValue(1);
    expect(screen.getByTestId('placeholder-image-preview')).toHaveAttribute(
      'src',
      'mock:#000000:9999x1:Example'
    );
    expect(generatePlaceholderImageMock).toHaveBeenLastCalledWith('#000000', 9999, 1, 'Example');
  });

  it('downloads JPEG and WEBP using the current preview data URL', async () => {
    const user = userEvent.setup();
    render(<PlaceholderImageGenerator />);

    await user.click(screen.getByTestId('placeholder-image-download-jpeg'));
    await user.click(screen.getByTestId('placeholder-image-download-webp'));

    expect(downloadImageMock).toHaveBeenNthCalledWith(1, 'mock:#000000:200x200:', 'jpeg');
    expect(downloadImageMock).toHaveBeenNthCalledWith(2, 'mock:#000000:200x200:', 'webp');
  });

  it('renders at least three task-specific FAQs', () => {
    render(<PlaceholderImageGenerator />);

    expect(screen.getByTestId('faq-question-0')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-1')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-2')).toBeInTheDocument();
  });
});
