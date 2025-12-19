export type ConvertOption =
  | ConvertOptionRadio
  | ConvertOptionText
  | ConvertOptionSwitch
  | ConvertOptionNumber;

export type ConvertOptions = Array<ConvertOption>;

export interface ConvertOptionDefaultItem {
  type: string;
  name: string;
  defaultValue?: unknown;
  helperText?: string;
  label: string;
  placeholder?: string;
}

export interface ConvertOptionText extends ConvertOptionDefaultItem {
  type: 'text';
  defaultValue?: string;
}

export interface ConvertOptionNumber extends ConvertOptionDefaultItem {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

export interface ConvertOptionSwitch extends ConvertOptionDefaultItem {
  type: 'switch';
  defaultValue?: boolean;
  children?: ConvertOptions;
  reverse?: boolean;
}

export interface ConvertOptionRadio extends ConvertOptionDefaultItem {
  type: 'radio';
  defaultValue?: string;
  values: Array<{ label: string; value: string; helperText?: string }>;
}
