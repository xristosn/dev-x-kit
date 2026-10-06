import { describe, expect, it } from 'vitest';
import { tomlToJsDoc, tomlToJson, tomlToJsonSchema, tomlToTypescript, tomlToYaml } from './toml';

describe('toml actions', () => {
  const tomlInput = 'name = "test"\nvalue = 42';

  describe('tomlToJson', () => {
    it('converts TOML fields and values to prettified JSON', async () => {
      const r = await tomlToJson(tomlInput);
      expect(JSON.parse(r as string)).toEqual({ name: 'test', value: 42 });
    });

    it('returns ActionError for invalid TOML', async () => {
      const r = await tomlToJson('!!!bad');
      expect(r).toHaveProperty('error', true);
    });
  });

  describe('tomlToJsonSchema', () => {
    it('produces JSON Schema from TOML', async () => {
      const r = await tomlToJsonSchema(tomlInput, {});
      const schema = JSON.parse(r as string);
      expect(schema.definitions.Root.properties).toMatchObject({
        name: { type: 'string' },
        value: { type: 'integer' },
      });
    });
  });

  describe('tomlToYaml', () => {
    it('converts TOML to YAML', async () => {
      const r = await tomlToYaml(tomlInput);
      expect(r as string).toContain('name: test');
      expect(r as string).toContain('value: 42');
    });
  });

  describe('tomlToTypescript', () => {
    it('produces TypeScript from TOML', async () => {
      const r = await tomlToTypescript(tomlInput, {});
      expect(r as string).toContain('name: string');
      expect(r as string).toContain('value: number');
    });
  });

  describe('tomlToJsDoc', () => {
    it('produces JSDoc from TOML', async () => {
      const r = await tomlToJsDoc(tomlInput, {});
      expect(r as string).toContain('@typedef');
      expect(r as string).toContain('@property {string} name');
      expect(r as string).toContain('@property {number} value');
    });
  });
});
