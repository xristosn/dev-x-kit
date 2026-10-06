import { describe, expect, it } from 'vitest';
import { phpToDeserialized, phpToSerialized } from './php';

describe('php actions', () => {
  describe('phpToSerialized', () => {
    it('serializes a plain string correctly', async () => {
      const result = await phpToSerialized('hello');
      expect(result).toBe('s:5:"hello";');
    });

    it('rejects input that is already serialized', async () => {
      const result = await phpToSerialized('s:5:"hello";');
      expect(result).toMatchObject({
        error: true,
        kind: 'validation',
        code: 'PHP_ALREADY_SERIALIZED',
        message: 'Input is already a serialized PHP value.',
      });
    });
  });

  describe('phpToDeserialized', () => {
    it('deserializes a serialized string back to original value', async () => {
      const result = await phpToDeserialized('s:5:"hello";');
      expect(result).toBe('hello');
    });

    it('preserves array values when returning JSON for array/object input', async () => {
      const result = await phpToDeserialized('a:1:{i:0;s:4:"test";}');
      expect(JSON.parse(result as string)).toEqual(['test']);
    });

    it('rejects non-serialized input', async () => {
      const result = await phpToDeserialized('hello');
      expect(result).toMatchObject({
        error: true,
        kind: 'validation',
        code: 'PHP_NOT_SERIALIZED',
        message: 'Input is not a serialized PHP value.',
      });
    });
  });
});
