export type ConvertOption =
  ConvertOptionRadio | ConvertOptionText | ConvertOptionSwitch | ConvertOptionNumber;

export type ConvertOptions = Array<ConvertOption>;

export type ConvertOptionDefaultItem = {
  type: string;
  name: string;
  defaultValue?: unknown;
  helperText?: string;
  label: string;
  placeholder?: string;
};

export type ConvertOptionText = ConvertOptionDefaultItem & {
  type: 'text';
  defaultValue?: string;
};

export type ConvertOptionNumber = ConvertOptionDefaultItem & {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
};

export type ConvertOptionSwitch = ConvertOptionDefaultItem & {
  type: 'switch';
  defaultValue?: boolean;
  children?: ConvertOptions;
  reverse?: boolean;
};

export type ConvertOptionRadio = ConvertOptionDefaultItem & {
  type: 'radio';
  defaultValue?: string;
  values: Array<{ label: string; value: string; helperText?: string }>;
};
