import { type ComponentProps, useState } from 'react';

import { cn, useIsStuck } from '@/shared/lib';

export const StickyBar = ({ className, ...props }: ComponentProps<'div'>) => {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const isStuck = useIsStuck(sentinel);

  return (
    <>
      <div ref={setSentinel} aria-hidden="true" />
      <div
        {...props}
        className={cn(
          'sticky top-0 z-30 bg-stone-100 transition-shadow duration-200',
          isStuck && 'shadow-[0_12px_12px_-12px_rgb(0_0_0/0.18)]',
          className,
        )}
      />
    </>
  );
};
