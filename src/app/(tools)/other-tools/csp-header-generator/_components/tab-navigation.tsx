'use client';

import { Badge } from '@/components/ui/badge';
import { Shield, Sparkles, Hash } from 'lucide-react';

type TabKey = 'directives' | 'presets' | 'hashes';

type TabConfig = {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
};

const TABS: TabConfig[] = [
  {
    key: 'directives',
    label: 'Directives',
    icon: <Shield className="w-4 h-4" />,
  },
  {
    key: 'presets',
    label: 'Service Presets',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    key: 'hashes',
    label: 'Inline Hashes',
    icon: <Hash className="w-4 h-4" />,
  },
];

export function TabNavigation({
  activeTab,
  onTabChange,
  appliedPresetCount,
  hashCount,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  appliedPresetCount: number;
  hashCount: number;
}) {
  return (
    <div className="flex gap-1 border-b">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.key
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.key === 'presets' && appliedPresetCount > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {appliedPresetCount}
            </Badge>
          )}
          {tab.key === 'hashes' && hashCount > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {hashCount}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}
