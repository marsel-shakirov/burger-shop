import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib';

type EditActionButtonProps = ComponentPropsWithoutRef<'button'>;

export const EditActionButton = ({ className, ...props }: EditActionButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'inline-flex min-h-9 cursor-pointer items-center rounded-sm text-sm font-bold text-red-900 underline underline-offset-4 focus-ring transition-colors duration-150 hover:text-red-700',
        className,
      )}
    />
  );
};
