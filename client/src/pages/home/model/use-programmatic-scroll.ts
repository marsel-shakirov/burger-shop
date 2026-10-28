import { useEffect, useEffectEvent, useRef } from 'react';

import { SCROLL_IDLE_TIMEOUT_MS } from '../config/catalog.constants';

interface ProgrammaticScrollOptions {
  onUserScroll: () => void;
  onUserScrollEnd: () => void;
}

export const useProgrammaticScroll = ({
  onUserScroll,
  onUserScrollEnd,
}: ProgrammaticScrollOptions) => {
  const timerRef = useRef<number | undefined>(undefined);

  const unlock = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const lock = () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(unlock, SCROLL_IDLE_TIMEOUT_MS);
  };

  const isScrolling = () => timerRef.current !== undefined;

  const scrollTo = (options: ScrollToOptions) => {
    lock();
    window.scrollTo(options);
  };

  const handleScroll = useEffectEvent(() => {
    if (isScrolling()) lock();
    else onUserScroll();
  });

  const handleScrollEnd = useEffectEvent(() => {
    if (isScrolling()) unlock();
    else onUserScrollEnd();
  });

  const unlockOnUnmount = useEffectEvent(unlock);

  useEffect(() => {
    const onScroll = () => handleScroll();
    const onScrollEnd = () => handleScrollEnd();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      unlockOnUnmount();
    };
  }, []);

  return { scrollTo };
};
