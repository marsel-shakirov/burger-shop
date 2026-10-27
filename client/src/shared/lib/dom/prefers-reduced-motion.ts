import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export const getPrefersReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribeToReducedMotion, getPrefersReducedMotion);
