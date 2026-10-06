import { describe, expect, it } from 'vitest';
import { DIRECTIVE_ORDER } from './constants';
import type { DirectiveConfig } from './types';
import {
  buildCspHeader,
  createDefaultDirectives,
  DEFAULT_STORE_VALUE,
  generateId,
  parseCspHeader,
} from './utils';

describe('parseCspHeader', () => {
  it('returns failure for empty string', () => {
    const result = parseCspHeader('');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Empty header, paste a CSP header to import.');
    expect(result.directives).toBeUndefined();
  });

  it('returns failure for whitespace-only string', () => {
    const result = parseCspHeader('   \n\t  ');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Empty header, paste a CSP header to import.');
  });

  it('returns failure when no valid directives are found', () => {
    const result = parseCspHeader('invalid-directive foo; bar baz');
    expect(result.success).toBe(false);
    expect(result.message).toBe('No valid CSP directives found in the header.');
  });

  it('parses a simple single directive', () => {
    const result = parseCspHeader("default-src 'self'");
    expect(result.success).toBe(true);
    expect(result.directives).toBeDefined();

    const defaultSrc = result.directives!.find((d) => d.name === 'default-src');
    expect(defaultSrc).toBeDefined();
    expect(defaultSrc!.enabled).toBe(true);
    expect(defaultSrc!.sources).toEqual(["'self'"]);

    // All other directives should be disabled with empty sources
    const scriptSrc = result.directives!.find((d) => d.name === 'script-src');
    expect(scriptSrc!.enabled).toBe(false);
    expect(scriptSrc!.sources).toEqual([]);
  });

  it('parses multiple directives separated by semicolons', () => {
    const result = parseCspHeader(
      "default-src 'self'; script-src 'self' https://cdn.example.com; img-src 'self' data:"
    );
    expect(result.success).toBe(true);
    expect(result.directives).toBeDefined();

    const scriptSrc = result.directives!.find((d) => d.name === 'script-src');
    expect(scriptSrc!.enabled).toBe(true);
    expect(scriptSrc!.sources).toEqual(["'self'", 'https://cdn.example.com']);

    const imgSrc = result.directives!.find((d) => d.name === 'img-src');
    expect(imgSrc!.enabled).toBe(true);
    expect(imgSrc!.sources).toEqual(["'self'", 'data:']);
  });

  it('handles extra whitespace around directives and sources', () => {
    const result = parseCspHeader(`  default-src   'self'   ;   script-src 'self'  `);
    expect(result.success).toBe(true);
    const defaultSrc = result.directives!.find((d) => d.name === 'default-src');
    expect(defaultSrc!.sources).toEqual(["'self'"]);
  });

  it('handles trailing semicolon', () => {
    const result = parseCspHeader("default-src 'self';");
    expect(result.success).toBe(true);
    const defaultSrc = result.directives!.find((d) => d.name === 'default-src');
    expect(defaultSrc!.enabled).toBe(true);
  });

  it('recognizes directive names case-insensitively', () => {
    const result = parseCspHeader("DEFAULT-SRC 'self'; SCRIPT-SRC 'self'");
    expect(result.success).toBe(true);
    const defaultSrc = result.directives!.find((d) => d.name === 'default-src');
    expect(defaultSrc!.enabled).toBe(true);
    const scriptSrc = result.directives!.find((d) => d.name === 'script-src');
    expect(scriptSrc!.enabled).toBe(true);
  });

  it('warns about unknown directives but continues parsing known ones', () => {
    const result = parseCspHeader("default-src 'self'; unknown-directive foo");
    expect(result.success).toBe(true);
    expect(result.warnings).toContain('Unknown directive: "unknown-directive", skipped.');
    const defaultSrc = result.directives!.find((d) => d.name === 'default-src');
    expect(defaultSrc!.enabled).toBe(true);
  });

  it('warns about flag-only directives with sources', () => {
    const result = parseCspHeader('upgrade-insecure-requests https://example.com');
    expect(result.success).toBe(true);
    expect(result.warnings).toContain(
      '"upgrade-insecure-requests" takes no sources, sources will be ignored.'
    );
    const flag = result.directives!.find((d) => d.name === 'upgrade-insecure-requests');
    expect(flag!.enabled).toBe(true);
    expect(flag!.sources).toEqual([]);
  });

  it('handles all three flag-only directives', () => {
    const result = parseCspHeader(
      'upgrade-insecure-requests; block-all-mixed-content; require-trusted-types-for'
    );
    expect(result.success).toBe(true);
    for (const name of [
      'upgrade-insecure-requests',
      'block-all-mixed-content',
      'require-trusted-types-for',
    ]) {
      const flag = result.directives!.find((d) => d.name === name);
      expect(flag!.enabled).toBe(true);
      expect(flag!.sources).toEqual([]);
    }
  });

  it('warns about multiple flag-only directives with sources', () => {
    const result = parseCspHeader('upgrade-insecure-requests foo; block-all-mixed-content bar');
    expect(result.success).toBe(true);
    expect(result.warnings).toHaveLength(2);
    expect(result.warnings![0]).toContain('upgrade-insecure-requests');
    expect(result.warnings![1]).toContain('block-all-mixed-content');
  });

  it('parses all 26 directive types when present', () => {
    const header = DIRECTIVE_ORDER.map((d) => `${d} 'self'`).join('; ');
    const result = parseCspHeader(header);
    expect(result.success).toBe(true);
    expect(result.directives!.filter((d) => d.enabled).length).toBe(DIRECTIVE_ORDER.length);
  });

  it('returns warnings array only when there are warnings', () => {
    const noWarnings = parseCspHeader("default-src 'self'");
    expect(noWarnings.warnings).toBeUndefined();

    const withWarnings = parseCspHeader("default-src 'self'; bogus-directive x");
    expect(Array.isArray(withWarnings.warnings)).toBe(true);
    expect(withWarnings.warnings!.length).toBeGreaterThan(0);
  });

  it('skips empty sources from multiple spaces', () => {
    const result = parseCspHeader("script-src 'self'    https://cdn.com");
    expect(result.success).toBe(true);
    const scriptSrc = result.directives!.find((d) => d.name === 'script-src');
    expect(scriptSrc!.sources).toEqual(["'self'", 'https://cdn.com']);
  });
});

describe('createDefaultDirectives', () => {
  it('returns all directives in DIRECTIVE_ORDER', () => {
    const directives = createDefaultDirectives();
    expect(directives).toHaveLength(DIRECTIVE_ORDER.length);
    DIRECTIVE_ORDER.forEach((name, i) => {
      expect(directives[i].name).toBe(name);
    });
  });

  it('enables default-src with self source', () => {
    const directives = createDefaultDirectives();
    const defaultSrc = directives.find((d) => d.name === 'default-src');
    expect(defaultSrc!.enabled).toBe(true);
    expect(defaultSrc!.sources).toEqual(["'self'"]);
  });

  it('disables all other directives with empty sources', () => {
    const directives = createDefaultDirectives();
    const nonDefault = directives.filter((d) => d.name !== 'default-src');
    nonDefault.forEach((d) => {
      expect(d.enabled).toBe(false);
      expect(d.sources).toEqual([]);
    });
  });

  it('preserves label and description for each directive', () => {
    const directives = createDefaultDirectives();
    directives.forEach((d) => {
      expect(d.label).toBeTruthy();
      expect(d.description).toBeTruthy();
    });
  });
});

describe('buildCspHeader', () => {
  it('returns empty string for no enabled directives', () => {
    const directives: DirectiveConfig[] = [
      { name: 'default-src', label: 'default-src', description: '', enabled: false, sources: [] },
      { name: 'script-src', label: 'script-src', description: '', enabled: false, sources: [] },
    ];
    expect(buildCspHeader(directives)).toBe('');
  });

  it('builds a header with a single directive', () => {
    const directives: DirectiveConfig[] = [
      {
        name: 'default-src',
        label: 'default-src',
        description: '',
        enabled: true,
        sources: ["'self'"],
      },
    ];
    expect(buildCspHeader(directives)).toBe("default-src 'self'");
  });

  it('builds a header with multiple directives separated by semicolons', () => {
    const directives: DirectiveConfig[] = [
      {
        name: 'default-src',
        label: 'default-src',
        description: '',
        enabled: true,
        sources: ["'self'"],
      },
      {
        name: 'script-src',
        label: 'script-src',
        description: '',
        enabled: true,
        sources: ["'self'", 'https://cdn.com'],
      },
    ];
    expect(buildCspHeader(directives)).toBe(
      "default-src 'self'; script-src 'self' https://cdn.com"
    );
  });

  it("adds 'none' for enabled directives with no sources", () => {
    const directives: DirectiveConfig[] = [
      { name: 'default-src', label: 'default-src', description: '', enabled: true, sources: [] },
    ];
    expect(buildCspHeader(directives)).toBe("default-src 'none'");
  });

  it("does not add 'none' for flag-only directives with no sources", () => {
    const directives: DirectiveConfig[] = [
      {
        name: 'upgrade-insecure-requests',
        label: 'upgrade-insecure-requests',
        description: '',
        enabled: true,
        sources: [],
      },
    ];
    expect(buildCspHeader(directives)).toBe('upgrade-insecure-requests');
  });

  it('skips disabled directives', () => {
    const directives: DirectiveConfig[] = [
      {
        name: 'default-src',
        label: 'default-src',
        description: '',
        enabled: true,
        sources: ["'self'"],
      },
      {
        name: 'script-src',
        label: 'script-src',
        description: '',
        enabled: false,
        sources: ["'self'"],
      },
      {
        name: 'img-src',
        label: 'img-src',
        description: '',
        enabled: true,
        sources: ["'self'", 'data:'],
      },
    ];
    const header = buildCspHeader(directives);
    expect(header).toContain("default-src 'self'");
    expect(header).toContain("img-src 'self' data:");
    expect(header).not.toContain('script-src');
  });

  it('preserves directive order from the input array', () => {
    const directives: DirectiveConfig[] = [
      { name: 'img-src', label: 'img-src', description: '', enabled: true, sources: ["'self'"] },
      {
        name: 'default-src',
        label: 'default-src',
        description: '',
        enabled: true,
        sources: ["'self'"],
      },
      {
        name: 'script-src',
        label: 'script-src',
        description: '',
        enabled: true,
        sources: ["'self'"],
      },
    ];
    const header = buildCspHeader(directives);
    const parts = header.split('; ');
    expect(parts[0]).toContain('img-src');
    expect(parts[1]).toContain('default-src');
    expect(parts[2]).toContain('script-src');
  });

  it('handles flag-only directives correctly in a multi-directive header', () => {
    const directives: DirectiveConfig[] = [
      {
        name: 'default-src',
        label: 'default-src',
        description: '',
        enabled: true,
        sources: ["'self'"],
      },
      {
        name: 'upgrade-insecure-requests',
        label: 'upgrade-insecure-requests',
        description: '',
        enabled: true,
        sources: [],
      },
    ];
    expect(buildCspHeader(directives)).toBe("default-src 'self'; upgrade-insecure-requests");
  });
});

describe('generateId', () => {
  it('returns a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  it('returns a non-empty string', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });

  it('returns different values on successive calls', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('returns a string of alphanumeric characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

describe('DEFAULT_STORE_VALUE', () => {
  it('has the correct shape', () => {
    expect(DEFAULT_STORE_VALUE).toHaveProperty('directives');
    expect(DEFAULT_STORE_VALUE).toHaveProperty('appliedPresets');
    expect(DEFAULT_STORE_VALUE).toHaveProperty('hashes');
  });

  it('directives match createDefaultDirectives output', () => {
    const defaults = createDefaultDirectives();
    expect(DEFAULT_STORE_VALUE.directives).toEqual(defaults);
  });

  it('appliedPresets is an empty array', () => {
    expect(DEFAULT_STORE_VALUE.appliedPresets).toEqual([]);
  });

  it('hashes is an empty array', () => {
    expect(DEFAULT_STORE_VALUE.hashes).toEqual([]);
  });
});
