import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { HashGenerator } from './hash-generator';
import type { HashEntry } from '../_lib/types';

describe('<HashGenerator />', () => {
  function renderHashGenerator(onAddHash?: (entry: HashEntry) => void) {
    const mockOnAddHash = vi.fn();
    render(<HashGenerator onAddHash={onAddHash ?? mockOnAddHash} />);
    return { onAddHash: mockOnAddHash };
  }

  function fillInput(element: HTMLElement, value: string) {
    fireEvent.change(element, { target: { value } });
  }

  afterEach(cleanup);

  it('renders the code input textarea', () => {
    renderHashGenerator();
    expect(screen.getByTestId('hash-code-input')).toBeInTheDocument();
  });

  it('renders hash algorithm and element type selectors', () => {
    renderHashGenerator();
    expect(screen.getByTestId('hash-algorithm-select')).toBeInTheDocument();
    expect(screen.getByTestId('hash-element-select')).toBeInTheDocument();
  });

  it('renders the label input', () => {
    renderHashGenerator();
    expect(screen.getByTestId('hash-label-input')).toBeInTheDocument();
  });

  it('renders the generate button', () => {
    renderHashGenerator();
    expect(screen.getByTestId('hash-generate-button')).toBeInTheDocument();
  });

  it('disables the generate button when code is empty', () => {
    renderHashGenerator();
    expect(screen.getByTestId('hash-generate-button')).toBeDisabled();
  });

  it('enables the generate button when code is entered', async () => {
    const user = userEvent.setup();
    renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'console.log("test");');
    expect(screen.getByTestId('hash-generate-button')).toBeEnabled();
  });

  it('generates a SHA-256 hash and displays the result', async () => {
    const user = userEvent.setup();
    renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'console.log("test");');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(screen.getByTestId('hash-result')).toHaveTextContent('sha256-');
  });

  it('generates a SHA-384 hash when selected', async () => {
    const user = userEvent.setup();
    renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'test code');
    const algorithmSelect = screen.getByTestId('hash-algorithm-select');
    await user.selectOptions(algorithmSelect, 'SHA-384');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(screen.getByTestId('hash-result')).toHaveTextContent('sha384-');
  });

  it('generates a SHA-512 hash when selected', async () => {
    const user = userEvent.setup();
    renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'test code');
    const algorithmSelect = screen.getByTestId('hash-algorithm-select');
    await user.selectOptions(algorithmSelect, 'SHA-512');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(screen.getByTestId('hash-result')).toHaveTextContent('sha512-');
  });

  it('calls onAddHash with a script entry when label is provided', async () => {
    const user = userEvent.setup();
    const { onAddHash } = renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'console.log("test");');
    const labelInput = screen.getByTestId('hash-label-input');
    await user.type(labelInput, 'main.js');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(onAddHash).toHaveBeenCalledTimes(1);
    const entry = onAddHash.mock.calls[0][0] as HashEntry;
    expect(entry.type).toBe('script');
    expect(entry.label).toBe('main.js');
    expect(entry.hash).toMatch(/^sha256-/);
  });

  it('does not call onAddHash when label is empty', async () => {
    const user = userEvent.setup();
    const { onAddHash } = renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'console.log("test");');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(onAddHash).not.toHaveBeenCalled();
  });

  it('sets hash element type to style when selected', async () => {
    const user = userEvent.setup();
    const { onAddHash } = renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    fillInput(textarea, '.test { color: red; }');
    const labelInput = screen.getByTestId('hash-label-input');
    await user.type(labelInput, 'styles.css');
    const elementSelect = screen.getByTestId('hash-element-select');
    await user.selectOptions(elementSelect, 'style');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(onAddHash).toHaveBeenCalledTimes(1);
    const entry = onAddHash.mock.calls[0][0] as HashEntry;
    expect(entry.type).toBe('style');
  });

  it('shows the shield icon when hash is generated', async () => {
    const user = userEvent.setup();
    renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'test code');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(screen.getByTestId('hash-shield-icon')).toBeInTheDocument();
  });

  it('renders a copy button after hash generation', async () => {
    const user = userEvent.setup();
    renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'test code');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    expect(screen.getByTestId('hash-copy-button')).toBeInTheDocument();
  });

  it('copies the hash to clipboard when copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    if (navigator.clipboard) {
      navigator.clipboard.writeText = writeText;
    } else {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
        configurable: true,
      });
    }

    const user = userEvent.setup();
    renderHashGenerator();
    const textarea = screen.getByTestId('hash-code-input');
    await user.type(textarea, 'test code');
    await user.click(screen.getByTestId('hash-generate-button'));
    await screen.findByTestId('hash-result');
    await user.click(screen.getByTestId('hash-copy-button'));
    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/^sha\d+-/));
  });
});
