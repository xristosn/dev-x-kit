'use client';

import { ClientOnly } from '@/components/client-only';
import { CodeSplitView } from '@/components/code-split-view';
import MarkdownRenderer from '@/components/ui/markdown-renderer';

export const MarkdownEditor: React.FC = () => {
  return (
    <ClientOnly>
      <CodeSplitView
        input={{
          label: 'Markdown',
          language: 'markdown',
          defaultValue: `## ✈️ Adventure Log: The Lost City of Aerthos

*A journey into the forgotten heart of the Crystal Peaks.*

### I. Overview of the Expedition

The objective of the **Aerthos 2026 Expedition** is to map the rumored subterranean complex beneath the Crystal Peaks, believed to be the remnants of the Aerthos civilization.

| Phase | Start Date | Primary Goal | Status |
| :--- | :--- | :--- | :--- |
| **I** | 2026-03-15 | Base Camp Establishment | Completed |
| **II** | 2026-03-22 | Cave System Survey | In Progress |
| **III** | 2026-04-05 | Artifact Recovery | Planned |

### II. Key Discoveries So Far

We have confirmed the existence of a vast cavern network, sustained by an underground river system.

* **The Whispering Falls:** A 50-meter waterfall within the main chamber.
* **Aether Crystals:** Deposits of an unknown, bioluminescent mineral. Analysis pending.
* **Ancient Glyphs:** Markings found on Chamber Three walls, possibly proto-Syldarian language.

> **Note:** All personnel are reminded to strictly adhere to the **Zero-Contact Policy** regarding the Aether Crystals until their composition is confirmed.

### III. Equipment Check 🎒

Please ensure your gear meets the following specifications for deep-system exploration:

1.  **High-Lumen Headlamp:** Minimum 1500 Lumens.
2.  **Rappel/Ascend Kit:** Fully certified and inspected by team lead **J. Vega**.
3.  **Emergency Rations:** At least 72 hours supply.
4.  **Data Slate:** Charged and synchronized with the latest topographical maps.

### IV. Mathematical Sidenote: Cavern Volume Estimation

The volume $(V)$ of the main cavern is currently being estimated using the formula for an irregular ellipsoid shape:

$$V \approx \frac{4}{3} \pi a b c$$

Where $a$, $b$, and $c$ are the estimated semi-axes lengths of the chamber. Initial estimates suggest the volume exceeds $10^6 \text{ m}^3$.

---`,
        }}
        output={{
          label: 'Preview',
          language: 'text',
          element({ inputValue }) {
            return (
              <div className="p-4">
                <MarkdownRenderer>{inputValue}</MarkdownRenderer>
              </div>
            );
          },
        }}
        converter={(v) => v}
      />
    </ClientOnly>
  );
};
