'use client';

import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { NAVIGATION } from '@/lib/navigation';

export interface SearchDialogProps {
  triggerProps?: React.ComponentProps<typeof Button>;
  forceOpen?: boolean;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ triggerProps, forceOpen }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { open: sidebarOpen, openMobile: sidebarOpenMobile, isMobile } = useSidebar();

  const isSidebarOpen = forceOpen || (isMobile ? sidebarOpenMobile : sidebarOpen);

  const results = query.trim()
    ? NAVIGATION.fuzzySearch(query.trim())
    : NAVIGATION.getSearchableItems();

  const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!results.length) return;

    let newIndex = highlightedIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(highlightedIndex + 1, results.length - 1);
        break;

      case 'ArrowUp':
        e.preventDefault();
        newIndex = highlightedIndex === -1 ? results.length - 1 : Math.max(highlightedIndex - 1, 0);
        break;

      default:
        return;
    }

    if (highlightedIndex === 0 && newIndex <= 0) {
      inputRef.current?.focus();
      return;
    }

    if (newIndex !== highlightedIndex) {
      setHighlightedIndex(newIndex);

      const elementToFocus = resultRefs.current[newIndex];

      if (elementToFocus) {
        elementToFocus.focus();
      }
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (results.length > 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();

      if (e.key === 'ArrowDown') {
        const firstResult = resultRefs.current[0];
        if (firstResult) {
          firstResult.focus();
          setHighlightedIndex(0);
        }
      }
    }
  };

  const onWindowKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && e.ctrlKey) {
      e.preventDefault();
      setOpen(true);
    }
  };

  useEffect(() => {
    if (open) return;

    window.addEventListener('keydown', onWindowKeyDown);

    return () => window.removeEventListener('keydown', onWindowKeyDown);
  }, [open]);

  useEffect(() => {
    resultRefs.current = resultRefs.current.slice(0, results.length);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightedIndex(-1);
  }, [results.length, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={isSidebarOpen ? 'default' : 'icon'}
          variant="outline"
          className={cn(isSidebarOpen ? 'min-w-50 w-full cursor-pointer' : '')}
          {...triggerProps}
        >
          <Search />

          {isSidebarOpen && (
            <>
              <div className="w-full text-left">Search</div>
              <div className="flex gap-1 text-xs">
                <kbd className="py-0.5 px-1 bg-accent/60 rounded-sm">CTRL</kbd>
                <kbd className="py-0.5 px-1 bg-accent/60 rounded-sm">K</kbd>
              </div>
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="lg:max-w-2xl" onKeyDown={onDialogKeyDown}>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>

        <Input
          ref={inputRef}
          autoFocus
          type="search"
          placeholder="Type your query here ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setHighlightedIndex(-1)}
          onKeyDown={onInputKeyDown}
        />

        <div className="flex flex-col gap-2 max-h-60 p-2 -mx-2 overflow-y-auto">
          {results.map((r, idx) => (
            <Button
              key={r.path || r.label}
              asChild
              variant="ghost"
              className="justify-start flex-wrap h-auto whitespace-normal"
              onClick={() => setOpen(false)}
            >
              <Link
                href={r.path}
                ref={(el) => {
                  resultRefs.current[idx] = el;
                }}
                onFocus={() => setHighlightedIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setOpen(false);
                  }
                }}
              >
                {r.icon}

                <span>{r.fullName || r.label}</span>

                {r.summary && <span className="text-muted-foreground/70 text-xs">{r.summary}</span>}
              </Link>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
