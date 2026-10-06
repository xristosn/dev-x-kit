import { describe, expect, it } from 'vitest';
import { htmlToJsx, htmlToMarkdown } from './html';

describe('html actions', () => {
  describe('htmlToJsx', () => {
    it('converts basic HTML to JSX', async () => {
      const result = await htmlToJsx('<div class="hello">world</div>', {});
      expect(result).toBe('<div className="hello">world</div>;\r\n');
    });

    it('wraps JSX with Component export when renderAs is 1', async () => {
      const result = await htmlToJsx('<div>a</div>', { renderAs: '1' });
      expect(result).toBe('export const Component = () => <div>a</div>;\r\n');
    });

    it('uses createClass when renderAs is 2', async () => {
      const result = await htmlToJsx('<div>a</div>', { renderAs: '2' });
      expect(result).toContain('React.createClass');
    });

    it('returns ActionError for empty HTML body', async () => {
      const result = await htmlToJsx('', {});
      expect(result).toHaveProperty('error', true);
    });
  });

  describe('htmlToMarkdown', () => {
    it('converts basic HTML to Markdown', async () => {
      const result = await htmlToMarkdown('<h1>Title</h1><p>text</p>', {});
      expect(result).toBe('# Title\r\n\r\ntext\r\n');
    });

    it('includes metadata when includeMetaData is basic', async () => {
      const result = await htmlToMarkdown('<h1>t</h1>', {
        includeMetaData: 'basic',
        enableTableColumnTracking: true,
      });
      expect(result).toBe('---\r\n---\r\n\r\n# t\r\n');
    });

    it('returns ActionError for empty HTML body', async () => {
      const result = await htmlToMarkdown('', {});
      expect(result).toHaveProperty('error', true);
    });
  });
});
