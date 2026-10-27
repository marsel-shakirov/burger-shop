import { useEffect, useEffectEvent, useRef } from 'react';

import { SCROLL_IDLE_TIMEOUT_MS } from '../config/catalog.constants';

export const useScrollLock = () => {
  const timerRef = useRef<number | undefined>(undefined);

  const unlock = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const lock = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(unlock, SCROLL_IDLE_TIMEOUT_MS);
  };

  const isLocked = () => timerRef.current !== undefined;

  const unlockOnUnmount = useEffectEvent(unlock);

  useEffect(() => () => unlockOnUnmount(), []);

  return { lock, unlock, isLocked };
};

export type ScrollLock = ReturnType<typeof useScrollLock>;
