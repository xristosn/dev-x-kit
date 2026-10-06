'use client';

import { ClientOnly } from '@/components/client-only';
import { CopyIconButton } from '@/components/copy-button';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Copy, Hash, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { DirectiveGroup } from './_components/directive-group';
import { HashGenerator } from './_components/hash-generator';
import { ImportCspDialog } from './_components/import-csp-dialog';
import { ServicePresetCard } from './_components/service-preset-card';
import { TabNavigation } from './_components/tab-navigation';
import { useCspGenerator } from './_hooks/use-csp-generator';
import { DIRECTIVE_CATEGORIES, SERVICE_PRESETS } from './_lib/constants';
import type { DirectiveCategory, HashEntry } from './_lib/types';
import { buildCspHeader } from './_lib/utils';

const FAQS = [
  {
    title: 'Does generating a CSP install it on my website?',
    description:
      'No. The tool builds a Content-Security-Policy header value for you to copy into your server or hosting configuration. Review the sources for your application and test the policy in your own environment before enforcing it, since missing sources can block scripts, styles, or other resources.',
  },
  {
    title: 'Can I start from a service preset or an existing policy?',
    description:
      'Use the Presets tab to search and apply a service preset, or import a policy through the import action. Imported known directives are used by the builder; unknown directives are skipped with a warning, so compare the generated header with the original before replacing it.',
  },
  {
    title: 'Why does an inline script hash stop working after an edit?',
    description:
      'The hash is calculated from the exact script or style content. Any change, including whitespace or line endings, produces a different hash. Generate a new SHA-256, SHA-384, or SHA-512 hash after editing the inline content, then update the matching CSP directive.',
  },
] satisfies readonly FaqItem[];

export default function CspHeaderGenerator() {
  const {
    value,
    toggleDirective,
    addSource,
    removeSource,
    moveDirective,
    applyPreset,
    addHash,
    removeHash,
    importDirectives,
    reset,
  } = useCspGenerator();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'directives' | 'presets' | 'hashes'>('directives');

  const cspHeader = buildCspHeader(value.directives);

  const filteredPresets = SERVICE_PRESETS.filter(
    (p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-muted-foreground">Generated Header</h2>
            <div className="flex items-center gap-1">
              <ImportCspDialog onImport={importDirectives} />
              <CopyIconButton value={cspHeader} size="sm" variant="ghost" />
            </div>
          </div>
          <ClientOnly
            fallback={
              <div className="p-3 rounded-lg bg-muted/50 border text-xs font-mono min-h-[44px] max-h-[120px]" />
            }
          >
            <pre className="p-3 rounded-lg bg-muted/50 border text-xs font-mono break-all whitespace-pre-wrap min-h-[44px] max-h-[120px] overflow-y-auto">
              {cspHeader || (
                <span className="text-muted-foreground italic">
                  Enable at least one directive to generate a header...
                </span>
              )}
            </pre>
          </ClientOnly>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => reset()}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
        </div>

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          appliedPresetCount={value.appliedPresets.length}
          hashCount={value.hashes.length}
        />

        <div className="flex-1 min-h-0">
          {activeTab === 'directives' && (
            <div className="space-y-3">
              {DIRECTIVE_CATEGORIES.map((category: DirectiveCategory) => (
                <DirectiveGroup
                  key={category.id}
                  category={category}
                  directives={value.directives.filter((d) => category.directives.includes(d.name))}
                  onToggle={toggleDirective}
                  onAddSource={addSource}
                  onRemoveSource={removeSource}
                  onMoveUp={(name, dir) => moveDirective(name, dir)}
                  onMoveDown={(name, dir) => moveDirective(name, dir)}
                />
              ))}
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPresets.map((preset) => (
                  <ServicePresetCard
                    key={preset.id}
                    preset={preset}
                    onApply={applyPreset}
                    applied={value.appliedPresets.includes(preset.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hashes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  What are inline hashes?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Content Security Policy blocks inline{' '}
                  <code className="text-xs">{'<script>'}</code> and{' '}
                  <code className="text-xs">{'<style>'}</code> blocks by default. Inline hashes let
                  you allow specific inline code without using{' '}
                  <code className="text-xs">unsafe-inline</code>, which weakens your entire policy.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A hash is computed from the exact content of your inline code. If the content
                  changes even by a single character, the hash no longer matches and the browser
                  will block it again. This means you get the convenience of inline code with strong
                  security guarantees.
                </p>
                <div className="text-xs space-y-1.5">
                  <p className="font-medium">How to use:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Paste your inline script or style content into the generator</li>
                    <li>Choose the hash algorithm (SHA-256 is the most widely supported)</li>
                    <li>
                      Generate the hash and add it to your{' '}
                      <code className="text-xs">script-src</code> or{' '}
                      <code className="text-xs">style-src</code> directive
                    </li>
                  </ol>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Tip:</strong> The hash must match the content exactly, including
                  whitespace and line endings. Minified or reformatted code will produce a different
                  hash.
                </p>
              </div>
              <HashGenerator onAddHash={addHash} />

              {value.hashes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-3">Generated Hashes</h3>
                    <div className="space-y-2">
                      {value.hashes.map((hashEntry: HashEntry) => (
                        <div
                          key={hashEntry.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {hashEntry.type === 'script' ? '<script>' : '<style>'}
                              </span>
                              {hashEntry.label && (
                                <span className="text-xs text-muted-foreground">
                                  - {hashEntry.label}
                                </span>
                              )}
                            </div>
                            <code className="text-xs font-mono break-all block mt-1">
                              {hashEntry.hash}
                            </code>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigator.clipboard.writeText(hashEntry.hash)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Copy hash"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeHash(hashEntry.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              aria-label="Remove hash"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <FaqSection items={FAQS} />
    </>
  );
}
