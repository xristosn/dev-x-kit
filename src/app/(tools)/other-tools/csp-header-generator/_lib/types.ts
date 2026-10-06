export type DirectiveName =
  | 'default-src'
  | 'script-src'
  | 'script-src-elem'
  | 'script-src-attr'
  | 'style-src'
  | 'style-src-elem'
  | 'style-src-attr'
  | 'img-src'
  | 'media-src'
  | 'font-src'
  | 'connect-src'
  | 'frame-src'
  | 'frame-ancestors'
  | 'base-uri'
  | 'form-action'
  | 'object-src'
  | 'worker-src'
  | 'child-src'
  | 'manifest-src'
  | 'upgrade-insecure-requests'
  | 'block-all-mixed-content'
  | 'plugin-types'
  | 'referrer'
  | 'report-uri'
  | 'report-to'
  | 'require-trusted-types-for';

export type DirectiveConfig = {
  name: DirectiveName;
  label: string;
  description: string;
  enabled: boolean;
  sources: string[];
};

export type ServicePreset = {
  id: string;
  name: string;
  icon: string;
  description: string;
  tags: string[];
  directives: Partial<Record<DirectiveName, string[]>>;
};

export type HashEntry = {
  id: string;
  type: 'script' | 'style';
  hash: string;
  label: string;
};

export type StoreValue = {
  directives: DirectiveConfig[];
  appliedPresets: string[];
  hashes: HashEntry[];
};

export type DirectiveCategory = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  directives: DirectiveName[];
};

export type ParseResult = {
  success: boolean;
  message?: string;
  directives?: DirectiveConfig[];
  warnings?: string[];
};
