import { describe, expect, it } from 'vitest';
import { analyzeText } from './utils';

describe('analyzeText', () => {
  it('returns zero metrics for empty input', () => {
    expect(analyzeText('')).toEqual({
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: '0 min',
    });
  });

  it('returns zero metrics for whitespace-only input', () => {
    expect(analyzeText(' \t\n  ')).toEqual({
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: '0 min',
    });
  });

  it('counts words and characters across varied whitespace', () => {
    expect(analyzeText('  hello\tworld\nagain  ')).toEqual({
      words: 3,
      characters: 21,
      charactersNoSpaces: 15,
      sentences: 1,
      paragraphs: 2,
      readingTime: '< 1 min',
    });
  });

  it('counts sentences and nonempty paragraphs', () => {
    expect(analyzeText('First sentence!\n\nSecond sentence?')).toMatchObject({
      sentences: 2,
      paragraphs: 2,
    });
  });

  it('rounds reading time up at the 200-word-per-minute boundary', () => {
    expect(analyzeText('word '.repeat(199)).readingTime).toBe('< 1 min');
    expect(analyzeText('word '.repeat(200)).readingTime).toBe('1 min');
    expect(analyzeText('word '.repeat(201)).readingTime).toBe('2 min');
  });
});
