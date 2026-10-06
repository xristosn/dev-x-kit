export type RandomTextType = 'paragraphs' | 'sentences' | 'words' | 'characters';

type RandomTextOptions = {
  type?: RandomTextType;
  amount?: number;
};

export const DEFAULT_RANDOM_TEXT_TYPE: RandomTextType = 'sentences';

export const DEFAULT_AMOUNTS: Record<RandomTextType, number> = {
  words: 10,
  sentences: 5,
  paragraphs: 1,
  characters: 32,
};

export const LOREM_LIMITS: Record<RandomTextType, number> = {
  words: 1000,
  sentences: 100,
  paragraphs: 50,
  characters: 1000,
};

const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'ut',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
];

const RANDOM_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

const generateSentence = () => {
  const length = Math.floor(Math.random() * 10) + 5;
  const words = Array.from({ length }, getRandomWord);
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
};

const generateParagraph = () => {
  const length = Math.floor(Math.random() * 10) + 5;
  return Array.from({ length }, generateSentence).join(' ');
};

const generateCharacters = (amount: number) =>
  Array.from(
    { length: amount },
    () => RANDOM_CHARACTERS[Math.floor(Math.random() * RANDOM_CHARACTERS.length)]
  ).join('');

export function generateRandomText({
  type = DEFAULT_RANDOM_TEXT_TYPE,
  amount = DEFAULT_AMOUNTS[type],
}: RandomTextOptions = {}): string {
  if (!Number.isFinite(amount) || amount <= 0) return '';

  const count = Math.min(LOREM_LIMITS[type], Math.floor(amount));
  if (count <= 0) return '';

  switch (type) {
    case 'words':
      return Array.from({ length: count }, getRandomWord).join(' ');

    case 'sentences':
      return Array.from({ length: count }, generateSentence).join(' ');

    case 'paragraphs':
      return Array.from({ length: count }, generateParagraph).join('\n\n');

    case 'characters':
      return generateCharacters(count);

    default:
      return '';
  }
}
