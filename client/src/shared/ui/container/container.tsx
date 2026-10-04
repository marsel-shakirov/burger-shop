import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/shared/lib';

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

export const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div {...props} className={cn('mx-auto w-full max-w-7xl px-[clamp(10px,3vw,40px)]', className)}>
      {children}
    </div>
  );
};
