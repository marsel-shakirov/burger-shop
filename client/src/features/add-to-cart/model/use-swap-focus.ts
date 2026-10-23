import { useEffect, useRef } from 'react';

export const useSwapFocus = (isSwapped: boolean) => {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const secondaryRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    (isSwapped ? secondaryRef : primaryRef).current?.focus();
  }, [isSwapped]);

  useEffect(() => {
    pendingRef.current = false;
  });

  const requestFocusSwap = () => {
    pendingRef.current = true;
  };
  return { primaryRef, secondaryRef, requestFocusSwap };
};
