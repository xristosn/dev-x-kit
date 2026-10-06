import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_IMAGE_RESIZER_STORE_VALUE, type ImageResizerStoreValue } from '../_lib/utils';
import { ImageResizerSettings } from './image-resizer-settings';

function setup(initialValue: ImageResizerStoreValue = DEFAULT_IMAGE_RESIZER_STORE_VALUE) {
  const user = userEvent.setup();
  let value = initialValue;
  let width = 640;
  let height = 360;
  const setValue = vi.fn((action: React.SetStateAction<ImageResizerStoreValue>) => {
    value = typeof action === 'function' ? action(value) : action;
    rerenderView();
  });
  const onWidthChange = vi.fn((nextWidth: number) => {
    width = nextWidth;
    rerenderView();
  });
  const onHeightChange = vi.fn((nextHeight: number) => {
    height = nextHeight;
    rerenderView();
  });
  const onResizeClick = vi.fn();
  let rerenderView = () => {};

  const renderView = () => {
    const result = render(
      <ImageResizerSettings
        value={value}
        setValue={setValue}
        width={width}
        height={height}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
        onResizeClick={onResizeClick}
      />
    );
    rerenderView = () =>
      result.rerender(
        <ImageResizerSettings
          value={value}
          setValue={setValue}
          width={width}
          height={height}
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
          onResizeClick={onResizeClick}
        />
      );
    return result;
  };

  renderView();
  return { user, onWidthChange, onHeightChange, onResizeClick };
}

describe('<ImageResizerSettings />', () => {
  it('updates the selected dimension and percentage through their controls', async () => {
    const { user, onWidthChange } = setup();

    await user.clear(screen.getByTestId('image-resizer-width'));
    await user.type(screen.getByTestId('image-resizer-width'), '800');
    expect(onWidthChange).toHaveBeenLastCalledWith(800);

    await user.click(screen.getByTestId('image-resizer-mode-percentage'));
    const percentage = screen.getByTestId('image-resizer-percentage');
    fireEvent.change(percentage, { target: { value: '81' } });
    expect(percentage).toHaveValue('81');
  });

  it('shows fit controls after unlocking dimensions and exposes background for contain', async () => {
    const { user } = setup();

    await user.click(screen.getByTestId('image-resizer-lock-aspect-ratio'));
    expect(screen.getByTestId('image-resizer-fit-cover')).toBeInTheDocument();
    expect(screen.queryByTestId('image-resizer-background-color')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('image-resizer-fit-contain'));
    expect(screen.getByTestId('image-resizer-background-color')).toBeInTheDocument();
  });

  it('updates social platform and preset selections', async () => {
    const { user } = setup();
    await user.click(screen.getByTestId('image-resizer-mode-social'));

    await user.click(screen.getByTestId('image-resizer-social-platform'));
    await user.click(await screen.findByTestId('image-resizer-platform-instagram'));
    await user.click(screen.getByTestId('image-resizer-social-preset'));
    await user.click(await screen.findByTestId('image-resizer-preset-2'));

    expect(screen.getByTestId('image-resizer-social-platform')).toHaveTextContent('instagram');
    expect(screen.getByTestId('image-resizer-social-preset')).toHaveTextContent('2');
  });

  it('calls the resize action when requested', async () => {
    const { user, onResizeClick } = setup();

    await user.click(screen.getByTestId('image-resizer-resize'));

    expect(onResizeClick).toHaveBeenCalledOnce();
  });
});
