import { DIRECTIVE_INFO, DIRECTIVE_ORDER } from './constants';
import type { DirectiveConfig, DirectiveName, ParseResult, StoreValue } from './types';

const FLAG_ONLY_DIRECTIVES = new Set<DirectiveName>([
  'upgrade-insecure-requests',
  'block-all-mixed-content',
  'require-trusted-types-for',
]);

const KNOWN_DIRECTIVES = new Set(DIRECTIVE_ORDER);

export function parseCspHeader(header: string): ParseResult {
  const trimmed = header.trim();

  if (!trimmed) {
    return { success: false, message: 'Empty header, paste a CSP header to import.' };
  }

  const directives: DirectiveConfig[] = DIRECTIVE_ORDER.map((name) => ({
    name,
    label: DIRECTIVE_INFO[name].label,
    description: DIRECTIVE_INFO[name].description,
    enabled: false,
    sources: [] as string[],
  }));

  const parsedNames = new Set<DirectiveName>();
  const warnings: string[] = [];

  // Split on semicolons, trim each segment
  const segments = trimmed
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const segment of segments) {
    // Split into directive name and sources
    const parts = segment.split(/\s+/);
    const directiveName = parts[0].toLowerCase() as DirectiveName;

    // Check if this is a known directive
    if (!KNOWN_DIRECTIVES.has(directiveName)) {
      warnings.push(`Unknown directive: "${parts[0]}", skipped.`);
      continue;
    }

    const idx = directives.findIndex((d) => d.name === directiveName);
    if (idx === -1) continue;

    const sources = parts.slice(1).filter(Boolean);
    directives[idx] = { ...directives[idx], enabled: true, sources };
    parsedNames.add(directiveName);

    // Warn about flag-only directives with sources
    if (FLAG_ONLY_DIRECTIVES.has(directiveName) && sources.length > 0) {
      warnings.push(`"${directiveName}" takes no sources, sources will be ignored.`);
      directives[idx] = { ...directives[idx], sources: [] };
    }
  }

  if (parsedNames.size === 0) {
    return { success: false, message: 'No valid CSP directives found in the header.' };
  }

  return {
    success: true,
    directives,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

export function createDefaultDirectives(): DirectiveConfig[] {
  return DIRECTIVE_ORDER.map((name) => ({
    name,
    label: DIRECTIVE_INFO[name].label,
    description: DIRECTIVE_INFO[name].description,
    enabled: name === 'default-src',
    sources: name === 'default-src' ? ["'self'"] : ([] as string[]),
  }));
}

export function buildCspHeader(directives: DirectiveConfig[]): string {
  return directives
    .filter((d) => d.enabled)
    .map((d) => {
      if (d.sources.length === 0 && !FLAG_ONLY_DIRECTIVES.has(d.name)) {
        return `${d.name} 'none'`;
      }
      if (FLAG_ONLY_DIRECTIVES.has(d.name)) {
        return d.name;
      }
      return `${d.name} ${d.sources.join(' ')}`;
    })
    .join('; ');
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const DEFAULT_STORE_VALUE: StoreValue = {
  directives: createDefaultDirectives(),
  appliedPresets: [],
  hashes: [],
};
