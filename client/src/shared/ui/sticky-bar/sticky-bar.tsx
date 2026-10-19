import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react';

import { cn, useIsStuck } from '@/shared/lib';

interface StickyBarControls {
  scrollToStart: () => void;
}

interface StickyBarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  children: ReactNode | ((controls: StickyBarControls) => ReactNode);
}

export const StickyBar = ({ children, className, ...props }: StickyBarProps) => {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const isStuck = useIsStuck(sentinel);

  const scrollToStart = () => {
    if (isStuck) sentinel?.scrollIntoView({ block: 'start' });
  };

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
      >
        {typeof children === 'function' ? children({ scrollToStart }) : children}
      </div>
    </>
  );
};
