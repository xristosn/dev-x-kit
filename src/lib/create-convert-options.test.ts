import { describe, expect, it } from 'vitest';
import {
  createConvertOptions,
  createConvertOptionsFromQuicktypeOptions,
} from './create-convert-options';
import { CSharpTargetLanguage } from 'quicktype-core';

describe('createConvertOptions', () => {
  it('returns empty config and default values for empty input', () => {
    const result = createConvertOptions([]);
    expect(result.config).toEqual([]);
    expect(result.defaultValues).toEqual({});
  });

  it('sets default values for text options', () => {
    const result = createConvertOptions([
      { name: 'indent', label: 'Indent', type: 'text', defaultValue: '  ' },
    ]);
    expect(result.defaultValues).toEqual({ indent: '  ' });
    expect(result.config[0].name).toBe('indent');
  });

  it('sets default values for switch options', () => {
    const result = createConvertOptions([
      { name: 'pretty', label: 'Pretty', type: 'switch', defaultValue: true },
    ]);
    expect(result.defaultValues).toEqual({ pretty: true });
  });

  it('skips false / 0 / empty-string default values due to truthy check', () => {
    const result = createConvertOptions([
      { name: 'x', label: 'X', type: 'switch', defaultValue: false },
      { name: 'y', label: 'Y', type: 'text', defaultValue: '' },
    ]);
    expect(result.defaultValues).toEqual({});
  });

  it('merges nested children for switch with children', () => {
    const result = createConvertOptions([
      {
        name: 'parent',
        label: 'Parent',
        type: 'switch',
        defaultValue: true,
        children: [{ name: 'child', label: 'Child', type: 'text', defaultValue: 'val' }],
      },
    ]);
    expect(result.defaultValues).toEqual({ parent: true, child: 'val' });
  });

  it('preserves original default values and merges with new ones', () => {
    const result = createConvertOptions(
      [{ name: 'a', label: 'A', type: 'text', defaultValue: 'new' }],
      { b: 'old' }
    );
    expect(result.defaultValues).toEqual({ b: 'old', a: 'new' });
  });

  it('handles radio options', () => {
    const result = createConvertOptions([
      {
        name: 'mode',
        label: 'Mode',
        type: 'radio',
        values: [
          { label: 'Fast', value: 'fast' },
          { label: 'Slow', value: 'slow' },
        ],
        defaultValue: 'fast',
      },
    ]);
    expect(result.defaultValues).toEqual({ mode: 'fast' });
  });
});

describe('createConvertOptionsFromQuicktypeOptions', () => {
  it('converts CSharpTargetLanguage options to config', () => {
    const lang = new CSharpTargetLanguage();
    const result = createConvertOptionsFromQuicktypeOptions(lang);
    expect(result.config.length).toBeGreaterThan(0);
    expect(result.defaultValues).toBeDefined();
  });

  it('merges passed defaults, but option defaults can overwrite due to truthy check', () => {
    const lang = new CSharpTargetLanguage();
    const result = createConvertOptionsFromQuicktypeOptions(lang, {
      namespace: 'MyApp',
    });
    // createConvertOptions uses truthy check, so option.defaultValue ('QuickType') overwrites
    expect(result.defaultValues.namespace).toBe('QuickType');
  });
});
