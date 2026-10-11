import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib';

type EditActionButtonProps = ComponentPropsWithoutRef<'button'>;

export const EditActionButton = ({ className, ...props }: EditActionButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'cursor-pointer rounded-md font-bold text-orange-700 focus-ring transition-colors duration-150 hover:text-orange-900',
        className,
      )}
    />
  );
};
