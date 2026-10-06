import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(mediaQuery);
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
