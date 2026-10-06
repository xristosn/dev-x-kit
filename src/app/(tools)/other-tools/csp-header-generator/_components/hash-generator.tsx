'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Hash, ShieldCheck } from 'lucide-react';
import { generateId } from '../_lib/utils';
import type { HashEntry } from '../_lib/types';

export function HashGenerator({ onAddHash }: { onAddHash: (entry: HashEntry) => void }) {
  const [code, setCode] = useState('');
  const [hashType, setHashType] = useState<'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [hashElement, setHashElement] = useState<'script' | 'style'>('script');
  const [label, setLabel] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generateHash = async () => {
    if (!code.trim()) return;

    setGenerating(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(code);
      const algorithm = `SHA-${hashType.split('-')[1]}` as 'SHA-256' | 'SHA-384' | 'SHA-512';
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const b64 = btoa(String.fromCharCode(...hashArray));
      const hashValue = `sha${hashType.split('-')[1]}-${b64}`;

      setResult(hashValue);
      if (label.trim()) {
        onAddHash({
          id: generateId(),
          type: hashElement,
          hash: hashValue,
          label: label.trim(),
        });
      }
    } catch {
      setResult('Error generating hash');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Inline code</Label>
          <textarea
            data-testid="hash-code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your inline <script> or <style> content here..."
            className="w-full mt-1 p-3 rounded-lg border bg-muted/50 font-mono text-xs min-h-[120px] resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Hash algorithm</Label>
            <select
              data-testid="hash-algorithm-select"
              value={hashType}
              onChange={(e) => setHashType(e.target.value as 'SHA-256' | 'SHA-384' | 'SHA-512')}
              className="w-full mt-1 p-2 rounded-lg border bg-muted/50 text-xs"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Element type</Label>
            <select
              data-testid="hash-element-select"
              value={hashElement}
              onChange={(e) => setHashElement(e.target.value as 'script' | 'style')}
              className="w-full mt-1 p-2 rounded-lg border bg-muted/50 text-xs"
            >
              <option value="script">&lt;script&gt;</option>
              <option value="style">&lt;style&gt;</option>
            </select>
          </div>
        </div>

        <div>
          <Label className="text-xs">Label (optional)</Label>
          <Input
            data-testid="hash-label-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., main.js, hero-banner.css"
            className="mt-1"
          />
        </div>

        <Button
          data-testid="hash-generate-button"
          onClick={generateHash}
          disabled={!code.trim() || generating}
          className="w-full"
          size="sm"
        >
          <Hash className="w-3.5 h-3.5 mr-2" />
          {generating ? 'Computing...' : 'Generate Hash'}
        </Button>
      </div>

      {result && !result.startsWith('Error') && (
        <div data-testid="hash-result" className="p-3 rounded-lg bg-muted/50 border space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck data-testid="hash-shield-icon" className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium">Generated Hash</span>
          </div>
          <code className="text-xs font-mono break-all block">{result}</code>
          <div className="flex gap-2">
            <button
              data-testid="hash-copy-button"
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
