import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib';

type SkeletonProps = ComponentPropsWithRef<'div'>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn('rounded-md bg-neutral-200 motion-safe:animate-pulse', className)}
    ></div>
  );
};
