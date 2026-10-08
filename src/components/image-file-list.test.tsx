import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageFileList } from './image-file-list';

const createFile = (name: string, type: string, size: number) =>
  new File([new Uint8Array(size)], name, { type });

describe('<ImageFileList />', () => {
  it('renders nothing when there are no files', () => {
    render(<ImageFileList files={[]} />);

    expect(screen.queryByTestId('image-file-list')).not.toBeInTheDocument();
  });

  it('shows the selected file name, type, and formatted size', () => {
    render(<ImageFileList files={[createFile('photo.png', 'image/png', 4)]} />);

    expect(screen.getByTestId('image-file-name-0')).toHaveTextContent('photo.png');
    expect(screen.getByTestId('image-file-type-0')).toHaveTextContent('image/png');
    expect(screen.getByTestId('image-file-size-0')).toHaveTextContent('4 B');
  });

  it('shows information for every selected file', () => {
    const files = [
      createFile('first.png', 'image/png', 4),
      createFile('second.jpeg', 'image/jpeg', 8),
    ];
    render(<ImageFileList files={files} />);

    expect(screen.getByTestId('image-file-list-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('image-file-list-item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('image-file-list-item-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('image-file-name-1')).toHaveTextContent('second.jpeg');
    expect(screen.getByTestId('image-file-type-1')).toHaveTextContent('image/jpeg');
    expect(screen.getByTestId('image-file-size-1')).toHaveTextContent('8 B');
  });

  it('uses the filename extension when the MIME type is missing', () => {
    render(<ImageFileList files={[createFile('photo.webp', '', 2)]} />);

    expect(screen.getByTestId('image-file-type-0')).toHaveTextContent('.webp');
  });
});
