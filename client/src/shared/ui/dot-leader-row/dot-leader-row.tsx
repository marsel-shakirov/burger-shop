import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/shared/lib';

interface DotLeaderRowProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  label: ReactNode;
  value: ReactNode;
}

export const DotLeaderRow = ({ label, value, className, ...props }: DotLeaderRowProps) => {
  return (
    <div {...props} className={cn('flex items-baseline gap-x-1.5', className)}>
      {label}
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-stone-300" />
      {value}
    </div>
  );
};
