import { ConvertOptionDefaultItem, ConvertOptions } from '@/types/convert';
import { merge, set } from 'lodash-es';
import { type TargetLanguage } from 'quicktype-core';

export type CreateConvertOptionsResult = {
  config: ConvertOptions;
  defaultValues: Record<string, unknown>;
};

export function createConvertOptions(
  config: ConvertOptions,
  originalDefaultValues: Record<string, unknown> = {}
): CreateConvertOptionsResult {
  let defaultValues: Record<string, unknown> = { ...originalDefaultValues };

  config.forEach((prop) => {
    if (prop.defaultValue) {
      set(defaultValues, prop.name, prop.defaultValue);

      if (prop.type === 'switch' && prop.children?.length) {
        const { defaultValues: childrenDefaultValues } = createConvertOptions(prop.children);
        defaultValues = merge({}, defaultValues, childrenDefaultValues);
      }
    }
  });

  return { config, defaultValues };
}

export function createConvertOptionsFromQuicktypeOptions(
  language: TargetLanguage,
  defaultValues: Record<string, unknown> = {}
): CreateConvertOptionsResult {
  const options = language.optionDefinitions;
  const config: ConvertOptions = [];

  options.forEach((option) => {
    const base: ConvertOptionDefaultItem = {
      name: option.name,
      label: option.description,
      type: '',
    };

    if (option.optionType === 'boolean') {
      config.push({
        ...base,
        defaultValue: option.defaultValue as boolean,
        type: 'switch',
      });
    } else if (option.optionType === 'string') {
      config.push({
        ...base,
        defaultValue: option.defaultValue as string,
        type: 'text',
      });
    } else if (option.optionType === 'enum' && option.typeLabel) {
      const values = option.typeLabel.split('|');

      config.push({
        ...base,
        type: 'radio',
        values: values.map((v) => ({ label: v, value: v })),
        defaultValue: option.defaultValue as string,
      });
    }
  });

  return createConvertOptions(config, defaultValues);
}
