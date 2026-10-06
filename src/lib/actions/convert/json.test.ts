import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  jsonToJsonSchema,
  jsonToCSharp,
  jsonToReactPropTypes,
  jsonToPython,
  jsonToRust,
  jsonToTypescript,
  jsonToZod,
  jsonToGo,
  jsonToDart,
  jsonToFlow,
  jsonToElixir,
  jsonToGraphQl,
  jsonToJsDoc,
  jsonToMySql,
  jsonToMongooseSchema,
  jsonToBigQuery,
  jsonToToml,
  jsonToYaml,
  jsonToToon,
} from './json';

const input = '{"name":"test","value":42}';

describe('<json actions>', () => {
  beforeEach(() => {});

  describe('validation', () => {
    it('returns a curated ActionError for invalid JSON without exposing parser details', async () => {
      const result = await jsonToTypescript('not json', {});
      expect(result).toMatchObject({
        error: true,
        kind: 'validation',
        code: 'INVALID_JSON',
        message: 'Input is not valid JSON.',
      });
      expect(JSON.stringify(result)).not.toContain('Unexpected token');
      expect(JSON.stringify(result)).not.toContain('not json');
    });

    it('returns a safe line and column when the parser provides an offset', async () => {
      const parse = vi.spyOn(JSON, 'parse').mockImplementationOnce(() => {
        throw new SyntaxError('Unexpected token at position 7');
      });

      try {
        const result = await jsonToTypescript('{\n"a": ]}', {});
        expect(result).toMatchObject({
          kind: 'validation',
          code: 'INVALID_JSON',
          message: 'Input is not valid JSON. Error near line 2, column 6.',
          location: { line: 2, column: 6 },
        });
        expect(JSON.stringify(result)).not.toContain('Unexpected token');
      } finally {
        parse.mockRestore();
      }
    });
  });

  describe('jsonToJsonSchema', () => {
    it('infers schema from JSON', async () => {
      const r = await jsonToJsonSchema(input, {});
      const schema = JSON.parse(r as string);
      expect(schema.definitions.Root.properties).toMatchObject({
        name: { type: 'string' },
        value: { type: 'integer' },
      });
    });
  });

  describe('quicktype converters', () => {
    it('CSharp', async () => {
      const r = await jsonToCSharp(input, {});
      expect(r).toContain('class Root');
      expect(r).toContain('string Name');
      expect(r).toMatch(/(?:long|int|double) Value/);
    });

    it('ReactPropTypes', async () => {
      const r = await jsonToReactPropTypes(input, {});
      expect(r).toContain('PropTypes');
      expect(r).toContain('name: PropTypes.string');
      expect(r).toContain('value: PropTypes.number');
    });

    it('Python', async () => {
      const r = await jsonToPython(input, {});
      expect(r).toContain('@dataclass');
      expect(r).toContain('name: str');
      expect(r).toContain('value: int');
    });

    it('Rust', async () => {
      const r = await jsonToRust(input, {});
      expect(r).toContain('#[derive');
      expect(r).toContain('name: String');
      expect(r).toMatch(/value: i\d+/);
    });

    it('TypeScript', async () => {
      const r = await jsonToTypescript(input, {});
      expect(r).toContain('export interface Root');
      expect(r).toContain('name: string');
      expect(r).toContain('value: number');
    });

    it('Zod', async () => {
      const r = await jsonToZod(input, {});
      expect(r).toContain('z.object');
      expect(r).toContain('name: z.string()');
      expect(r).toContain('value: z.number()');
    });

    it('Go', async () => {
      const r = await jsonToGo(input, {});
      expect(r).toContain('type Root struct');
      expect(r).toMatch(/Name\s+string/);
      expect(r).toMatch(/Value (?:int|int64|float64)/);
    });

    it('Dart', async () => {
      const r = await jsonToDart(input, {});
      expect(r).toContain('Root rootFromJson');
      expect(r).toMatch(/String\?? name;/);
      expect(r).toMatch(/int\?? value;/);
    });

    it('Flow', async () => {
      const r = await jsonToFlow(input, {});
      expect(r).toContain('@flow');
      expect(r).toContain('name: string');
      expect(r).toContain('value: number');
    });

    it('Elixir', async () => {
      const r = await jsonToElixir(input, {});
      expect(r).toContain('defmodule');
      expect(r).toContain('name: String.t()');
      expect(r).toContain('value: integer()');
    });
  });

  describe('jsonToGraphQl', () => {
    it('infers GraphQL schema', async () => {
      const r = await jsonToGraphQl(input, { baseType: 'Root' });
      expect(r).toContain('type Root');
      expect(r).toContain('name: String');
      expect(r).toContain('value: Int');
    });

    it.each(['constructor', '__proto__', 'prototype'])(
      'rejects nested %s keys before they reach the converter',
      async (key) => {
        const payload = JSON.stringify({ nested: { [key]: { auditOnlyMarker: 'value' } } });

        try {
          const result = await jsonToGraphQl(payload, { baseType: 'Root' });
          expect(result).toHaveProperty('error', true);
          expect((Object.prototype as Record<string, unknown>).auditOnlyMarker).toBeUndefined();
        } finally {
          delete (Object.prototype as Record<string, unknown>).auditOnlyMarker;
        }
      }
    );

    it('rejects keys normalized to prototype path segments by the converter', async () => {
      const payload = '{"construc-tor":{"proto-type":{"auditOnlyMarker":"value"}}}';

      try {
        const result = await jsonToGraphQl(payload, { baseType: 'Root' });
        expect(result).toHaveProperty('error', true);
        expect((Object.prototype as Record<string, unknown>).auditOnlyMarker).toBeUndefined();
      } finally {
        delete (Object.prototype as Record<string, unknown>).auditOnlyMarker;
      }
    });

    it('rejects constructor.prototype pollution without changing Object.prototype', async () => {
      const payload = '{"constructor":{"prototype":{"auditOnlyMarker":"value"}}}';

      try {
        const result = await jsonToGraphQl(payload, { baseType: 'Root' });
        expect(result).toHaveProperty('error', true);
        expect((Object.prototype as Record<string, unknown>).auditOnlyMarker).toBeUndefined();
      } finally {
        delete (Object.prototype as Record<string, unknown>).auditOnlyMarker;
      }
    });
  });

  describe('jsonToJsDoc', () => {
    it('infers JSDoc types', async () => {
      const r = await jsonToJsDoc(input, {});
      expect(r).toContain('@typedef');
      expect(r).toContain('@property {string} name');
      expect(r).toContain('@property {number} value');
    });
  });

  describe('jsonToMySql', () => {
    it('infers SQL schema', async () => {
      const r = await jsonToMySql(input, { tableName: 'Root' });
      expect(r).toContain('CREATE TABLE');
      expect(r).toContain('name');
      expect(r).toMatch(/name\s+TEXT/i);
      expect(r).toMatch(/value\s+INT/i);
    });
  });

  describe('jsonToMongooseSchema', () => {
    it('infers Mongoose schema', async () => {
      const r = await jsonToMongooseSchema(input);
      const parsed = JSON.parse(r as string);
      expect(parsed).toMatchObject({
        name: { type: 'String' },
        value: { type: 'Number' },
      });
    });
  });

  describe('jsonToBigQuery', () => {
    it('infers BigQuery schema', async () => {
      const r = await jsonToBigQuery(input);
      const schema = JSON.parse(r as string);
      expect(schema).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'name', type: 'STRING' }),
          expect.objectContaining({ name: 'value', type: 'INTEGER' }),
        ])
      );
    });
  });

  describe('jsonToToml', () => {
    it('infers TOML', async () => {
      const r = await jsonToToml(input);
      expect(r).toContain('name = "test"');
      expect(r).toContain('value = 42');
    });
  });

  describe('jsonToYaml', () => {
    it('infers YAML', async () => {
      const r = await jsonToYaml(input);
      expect(r).toContain('name: test');
      expect(r).toContain('value: 42');
    });
  });

  describe('jsonToToon', () => {
    it('infers TOON with comma delimiter', async () => {
      const r = await jsonToToon(input, { delimiter: 'comma' });
      expect(r).toContain('name: test');
      expect(r).toContain('value: 42');
    });
  });
});
