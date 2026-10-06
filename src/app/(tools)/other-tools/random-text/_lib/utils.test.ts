import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  DEFAULT_AMOUNTS,
  DEFAULT_RANDOM_TEXT_TYPE,
  generateRandomText,
  LOREM_LIMITS,
  type RandomTextType,
} from './utils';

describe('generateRandomText', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('uses sensible defaults when options are omitted', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = generateRandomText();

    expect(DEFAULT_RANDOM_TEXT_TYPE).toBe('sentences');
    expect(result.split(/ (?=[A-Z])/)).toHaveLength(DEFAULT_AMOUNTS.sentences);
  });

  test('uses the default character amount when only the type is provided', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = generateRandomText({ type: 'characters' });

    expect(result).toHaveLength(DEFAULT_AMOUNTS.characters);
    expect(result).toBe('A'.repeat(DEFAULT_AMOUNTS.characters));
  });

  test('generates the requested number of alphanumeric characters', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const result = generateRandomText({ type: 'characters', amount: 24 });

    expect(result).toHaveLength(24);
    expect(result).toMatch(/^[A-Za-z0-9]+$/);
  });

  test('caps generation at the type limit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = generateRandomText({ type: 'characters', amount: 1001 });

    expect(result).toHaveLength(LOREM_LIMITS.characters);
  });

  test('returns an empty string for non-finite amounts', () => {
    expect(generateRandomText({ type: 'characters', amount: Number.NaN })).toBe('');
    expect(generateRandomText({ type: 'characters', amount: Number.POSITIVE_INFINITY })).toBe('');
  });

  test('generates the requested number of words', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = generateRandomText({ type: 'words', amount: 4 });

    expect(result.split(' ')).toHaveLength(4);
    expect(result).toBe('lorem lorem lorem lorem');
  });

  test('generates the requested number of capitalized sentences with periods', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = generateRandomText({ type: 'sentences', amount: 3 });
    const sentences = result.split(/ (?=[A-Z])/);

    expect(sentences).toHaveLength(3);
    sentences.forEach((sentence) => {
      expect(sentence).toMatch(/^[A-Z][a-z]+(?: [a-z]+){4,13}\.$/);
    });
  });

  test.each([
    { randomValue: 0, expectedWords: 5 },
    { randomValue: 0.9999, expectedWords: 14 },
  ])('generates sentences containing $expectedWords words', ({ randomValue, expectedWords }) => {
    vi.spyOn(Math, 'random').mockReturnValue(randomValue);

    const result = generateRandomText({ type: 'sentences', amount: 1 });

    expect(result.slice(0, -1).split(' ')).toHaveLength(expectedWords);
  });

  test('generates the requested number of paragraphs separated by blank lines', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = generateRandomText({ type: 'paragraphs', amount: 2 });
    const paragraphs = result.split('\n\n');

    expect(paragraphs).toHaveLength(2);
    paragraphs.forEach((paragraph) => {
      const sentences = paragraph.match(/[^.]+\./g) ?? [];

      expect(sentences).toHaveLength(5);
      sentences.forEach((sentence) => {
        expect(sentence.trim()).toMatch(/^[A-Z][a-z]+(?: [a-z]+){4,13}\.$/);
      });
    });
  });

  test.each(['words', 'sentences', 'paragraphs', 'characters'] as const)(
    'returns an empty string for a non-positive %s amount',
    (type) => {
      expect(generateRandomText({ type, amount: 0 })).toBe('');
      expect(generateRandomText({ type, amount: -1 })).toBe('');
    }
  );

  test('returns an empty string for an unsupported type', () => {
    expect(generateRandomText({ type: 'unsupported' as RandomTextType, amount: 1 })).toBe('');
  });
});

describe('LOREM_LIMITS', () => {
  test('defines a generation limit for each output type', () => {
    expect(LOREM_LIMITS).toEqual({
      words: 1000,
      sentences: 100,
      paragraphs: 50,
      characters: 1000,
    });
  });
});
