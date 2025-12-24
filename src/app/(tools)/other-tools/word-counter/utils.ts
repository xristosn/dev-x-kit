interface TextMetrics {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
}

export const TEXT_METRICS_CONFIG: Array<{
  key: keyof TextMetrics;
  label: string;
}> = [
  {
    key: 'words',
    label: 'Words',
  },
  {
    key: 'characters',
    label: 'Characters',
  },
  {
    key: 'charactersNoSpaces',
    label: 'Characters Without spaces',
  },
  {
    key: 'sentences',
    label: 'Sentences',
  },
  {
    key: 'paragraphs',
    label: 'Paragraphs',
  },
  {
    key: 'readingTime',
    label: 'Reading Time',
  },
];

export function analyzeText(text: string): TextMetrics {
  if (!text || !text.trim().length) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: '0 min',
    };
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const wpm = 200;
  const time = words / wpm;
  const readingTime = time < 1 ? '< 1 min' : `${Math.ceil(time)} min`;

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s+/g, '').length,
    words,
    sentences: text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length,
    paragraphs: text.split(/\n+/).filter((p) => p.trim().length > 0).length,
    readingTime,
  };
}
