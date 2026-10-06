'use client';

import { ViewTransition } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter={{
        default: 'none',
        'nav-forward': 'slide-in-forward',
        'nav-back': 'slide-in-back',
      }}
      exit={{
        default: 'none',
        'nav-forward': 'slide-out-forward',
        'nav-back': 'slide-out-back',
      }}
    >
      {children}
    </ViewTransition>
  );
}
