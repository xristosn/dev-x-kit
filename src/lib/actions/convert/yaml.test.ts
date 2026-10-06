import { describe, expect, it } from 'vitest';
import { yamlToJsDoc, yamlToJson, yamlToJsonSchema, yamlToToml, yamlToTypescript } from './yaml';

describe('yaml actions', () => {
  const yamlInput = 'name: test\nvalue: 42';

  describe('yamlToJson', () => {
    it('parses YAML to prettified JSON', async () => {
      const r = await yamlToJson(yamlInput);
      expect(JSON.parse(r as string)).toEqual({ name: 'test', value: 42 });
    });

    it('returns ActionError for invalid YAML', async () => {
      const r = await yamlToJson('!!!bad: {');
      expect(r).toHaveProperty('error', true);
    });
  });

  describe('yamlToJsonSchema', () => {
    it('infers JSON Schema from YAML', async () => {
      const r = await yamlToJsonSchema(yamlInput, {});
      const schema = JSON.parse(r as string);
      expect(schema.definitions.Root.properties).toMatchObject({
        name: { type: 'string' },
        value: { type: 'integer' },
      });
    });
  });

  describe('yamlToToml', () => {
    it('converts YAML to TOML', async () => {
      const r = await yamlToToml(yamlInput);
      expect(r as string).toContain('name = "test"');
      expect(r as string).toContain('value = 42');
    });
  });

  describe('yamlToTypescript', () => {
    it('infers TypeScript from YAML', async () => {
      const r = await yamlToTypescript(yamlInput, {});
      expect(r as string).toContain('name: string');
      expect(r as string).toContain('value: number');
    });
  });

  describe('yamlToJsDoc', () => {
    it('infers JSDoc from YAML', async () => {
      const r = await yamlToJsDoc(yamlInput, {});
      expect(r as string).toContain('@typedef');
      expect(r as string).toContain('@property {string} name');
      expect(r as string).toContain('@property {number} value');
    });
  });
});
