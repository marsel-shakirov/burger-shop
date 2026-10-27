import { useEffect, useState } from 'react';

export const useIsStuck = (sentinel: Element | null) => {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsStuck(entry.boundingClientRect.top < 0);
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel]);

  return isStuck;
};
