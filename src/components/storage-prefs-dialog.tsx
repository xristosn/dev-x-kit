'use client';

import { useWebStorage } from '@/hooks/use-web-storage';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import { Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ClientOnly } from './client-only';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const STORAGE_VALUES = [
  {
    label: 'Persistent (Local)',
    value: 'local',
    helper:
      'Data is saved on this device even after you close the browser or restart your computer. Best for long term settings.',
  },
  {
    label: 'Current Session',
    value: 'session',
    helper:
      'Data is saved only for this specific tab. If you close the tab or window, your information will be cleared.',
  },
  {
    label: 'Temporary (Live)',
    value: 'memory',
    helper:
      'Data is only kept while you stay on the current page. Refreshing or navigating away will reset everything.',
  },
];

export const UserStoragePrefsDialog: React.FC = () => (
  <ClientOnly
    fallback={
      <Button data-testid="storage-prefs-trigger" size="icon" variant="outline">
        <span className="sr-only">Choose Your Storage Preference</span>
        <Database />
      </Button>
    }
  >
    <UserStoragePrefsDialogContent />
  </ClientOnly>
);

const UserStoragePrefsDialogContent: React.FC = () => {
  const [value, setValue, , valueExists] = useWebStorage(
    USER_STORAGE_PREFS_KEY,
    'local',
    'local',
    true
  );
  const [open, setOpen] = useState(() => !valueExists());

  useEffect(() => {
    if (!open && !valueExists()) {
      setValue((v) => v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, valueExists]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        data-testid="storage-prefs-trigger"
        render={
          <Button size="icon" variant="outline">
            <Database />
            <span className="sr-only">Choose Your Storage Preference</span>
          </Button>
        }
      />

      <DialogContent data-testid="storage-prefs-dialog" className="gap-8 bg-background">
        <DialogHeader>
          <DialogTitle>Choose Your Storage Preference</DialogTitle>

          <DialogDescription>
            Decide how you want your data to be saved. This choice determines how long your settings
            and information will stay active on this device.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={value} onValueChange={(v) => setValue(v)}>
          {STORAGE_VALUES.map((v) => (
            <div key={v.value} className="flex items-start gap-3">
              <RadioGroupItem
                data-testid={`storage-pref-${v.value}`}
                value={v.value}
                id={`storage-${v.value}`}
                className="size-5 mt-1.5"
              />

              <Label
                htmlFor={`storage-${v.value}`}
                className="flex flex-col gap-1 items-start text-lg"
              >
                <span>{v.label}</span>

                <span className="text-sm text-muted-foreground">{v.helper}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
};
