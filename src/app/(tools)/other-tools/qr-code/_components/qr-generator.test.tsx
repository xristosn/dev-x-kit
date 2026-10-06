import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import QrGenerator from './qr-generator';

describe('<QrGenerator />', () => {
  test('renders reset button and download options', () => {
    render(<QrGenerator />);
    expect(screen.getByTestId('qr-reset')).toBeInTheDocument();
    expect(screen.getByTestId('qr-download-png')).toBeInTheDocument();
    expect(screen.getByTestId('qr-download-svg')).toBeInTheDocument();
  });
});
