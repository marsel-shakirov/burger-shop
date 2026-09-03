import type { ComponentPropsWithRef } from 'react';

type SkeletonProps = ComponentPropsWithRef<'div'>;

export const Skeleton = ({ className = '', ...props }: SkeletonProps) => {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={`rounded-md bg-neutral-200 motion-safe:animate-pulse ${className}`}
    ></div>
  );
};
