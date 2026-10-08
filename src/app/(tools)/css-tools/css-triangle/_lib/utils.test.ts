import { describe, expect, test } from 'vitest';
import { getTriangleStyle } from './utils';

describe('getTriangleStyle', () => {
  test.each([
    ['Up Left', '100px 200px 0 0', '#123456 transparent transparent transparent'],
    ['Up Right', '0 200px 100px 0', 'transparent #123456 transparent transparent'],
    ['Left', '50px 200px 50px 0', 'transparent #123456 transparent transparent'],
    ['Right', '50px 0 50px 200px', 'transparent transparent transparent #123456'],
    ['Down Left', '100px 0 0 200px', 'transparent transparent transparent #123456'],
    ['Down', '100px 100px 0 100px', '#123456 transparent transparent transparent'],
    ['Down Right', '0 0 100px 200px', 'transparent transparent #123456 transparent'],
    ['Up', '0 100px 100px 100px', 'transparent transparent #123456 transparent'],
  ] as const)('returns the border styles for %s', (direction, borderWidth, borderColor) => {
    const color = '#123456';

    expect(getTriangleStyle(direction, 200, 100, color)).toEqual({
      width: '0',
      height: '0',
      borderStyle: 'solid',
      borderWidth,
      borderColor,
    });
  });
});
