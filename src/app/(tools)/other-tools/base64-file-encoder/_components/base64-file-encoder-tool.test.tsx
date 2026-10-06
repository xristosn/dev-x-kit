import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Base64FileEncoderTool } from './base64-file-encoder-tool';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

class ControlledFileReader extends EventTarget {
  static instances: ControlledFileReader[] = [];

  result: string | ArrayBuffer | null = null;
  readAsDataURL = vi.fn();

  constructor() {
    super();
    ControlledFileReader.instances.push(this);
  }

  complete(dataUri: string) {
    this.result = dataUri;
    this.dispatchEvent(new Event('load'));
  }

  fail() {
    this.dispatchEvent(new Event('error'));
  }

  abortRead() {
    this.dispatchEvent(new Event('abort'));
  }
}

function setup() {
  const user = userEvent.setup({ applyAccept: false });
  render(<Base64FileEncoderTool />);

  return {
    user,
    input: screen.getByTestId('base64-file-encoder-input'),
  };
}

describe('<Base64FileEncoderTool />', () => {
  beforeEach(() => {
    ControlledFileReader.instances = [];
    vi.stubGlobal('FileReader', ControlledFileReader as unknown as typeof FileReader);
    vi.mocked(toast.error).mockClear();
  });

  it('encodes an arbitrary file as Base 64 and a data URI', async () => {
    const { user, input } = setup();
    const file = new File(['hello'], 'hello.bin', { type: 'application/octet-stream' });
    const dataUri = 'data:application/octet-stream;base64,SGVsbG8=';

    expect(screen.queryByTestId('encoded-result-value-base-64')).not.toBeInTheDocument();
    expect(screen.queryByTestId('encoded-result-value-data-uri')).not.toBeInTheDocument();

    await user.upload(input, file);

    const reader = ControlledFileReader.instances[0];
    expect(reader.readAsDataURL).toHaveBeenCalledWith(file);
    reader.complete(dataUri);

    expect(await screen.findByTestId('encoded-result-value-base-64')).toHaveTextContent('SGVsbG8=');
    await user.click(screen.getByTestId('encoded-result-tab-data-uri'));
    expect(screen.getByTestId('encoded-result-value-data-uri')).toHaveTextContent(dataUri);
    expect(screen.queryByTestId('encoded-result-tab-image-element')).not.toBeInTheDocument();
    expect(screen.queryByTestId('encoded-result-tab-css-background-image')).not.toBeInTheDocument();
    expect(screen.queryByTestId('encoded-result-tab-html-favicon')).not.toBeInTheDocument();
  });

  it('shows image-specific previews and snippets for image files', async () => {
    const { user, input } = setup();
    const file = new File(['image'], 'image.png', { type: 'image/png' });
    const dataUri = 'data:image/png;base64,aW1hZ2U=';

    await user.upload(input, file);
    expect(ControlledFileReader.instances[0].readAsDataURL).toHaveBeenCalledWith(file);
    ControlledFileReader.instances[0].complete(dataUri);

    await screen.findByTestId('encoded-result-value-base-64');
    await user.click(screen.getByTestId('encoded-result-tab-image-element'));
    expect(screen.getByTestId('encoded-result-image-preview')).toHaveAttribute('src', dataUri);
    expect(screen.getByTestId('encoded-result-snippet-image-element')).toHaveValue(
      `<img src="${dataUri}" />`
    );

    await user.click(screen.getByTestId('encoded-result-tab-css-background-image'));
    expect(screen.getByTestId('encoded-result-snippet-css-background-image')).toHaveValue(
      `background-image: url(${dataUri});`
    );

    await user.click(screen.getByTestId('encoded-result-tab-html-favicon'));
    expect(screen.getByTestId('encoded-result-snippet-html-favicon')).toHaveValue(
      `<link rel="shortcut icon" href="${dataUri}" />`
    );
  });

  it('replaces the previous result when a new file is uploaded', async () => {
    const { user, input } = setup();
    const firstFile = new File(['first'], 'first.txt', { type: 'text/plain' });
    const secondFile = new File(['second'], 'second.txt', { type: 'text/plain' });

    await user.upload(input, firstFile);
    ControlledFileReader.instances[0].complete('data:text/plain;base64,Zmlyc3Q=');
    expect(await screen.findByTestId('encoded-result-value-base-64')).toHaveTextContent('Zmlyc3Q=');

    await user.upload(input, secondFile);
    expect(screen.queryByTestId('encoded-result-value-base-64')).not.toBeInTheDocument();

    ControlledFileReader.instances[1].complete('data:text/plain;base64,c2Vjb25k');
    expect(await screen.findByTestId('encoded-result-value-base-64')).toHaveTextContent('c2Vjb25k');
  });

  it.each([
    ['error', (reader: ControlledFileReader) => reader.fail()],
    ['abort', (reader: ControlledFileReader) => reader.abortRead()],
  ])('reports a FileReader %s without showing a result', async (_outcome, triggerFailure) => {
    const { user, input } = setup();
    const file = new File(['content'], 'file.txt', { type: 'text/plain' });

    await user.upload(input, file);
    triggerFailure(ControlledFileReader.instances[0]);

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to encode',
        expect.objectContaining({ description: expect.any(String), duration: 6000 })
      );
    });
    expect(screen.queryByTestId('encoded-result-value-base-64')).not.toBeInTheDocument();
  });
});
