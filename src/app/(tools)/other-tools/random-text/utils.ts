export type LoremType = 'paragraphs' | 'sentences' | 'words';

interface LoremOptions {
  type: LoremType;
  amount: number;
}

export const LOREM_LIMITS: Record<LoremType, number> = {
  words: 1000,
  sentences: 100,
  paragraphs: 50,
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

export function generateLorem({ type, amount }: LoremOptions): string {
  if (amount <= 0) return '';

  switch (type) {
    case 'words':
      return Array.from({ length: amount }, getRandomWord).join(' ');

    case 'sentences':
      return Array.from({ length: amount }, generateSentence).join(' ');

    case 'paragraphs':
      return Array.from({ length: amount }, generateParagraph).join('\n\n');

    default:
      return '';
  }
}
