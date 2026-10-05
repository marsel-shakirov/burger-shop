import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib';

type TextInputProps = ComponentPropsWithoutRef<'input'>;

export const TextInput = ({ className, ...props }: TextInputProps) => {
  return (
    <input
      {...props}
      className={cn(
        'h-12 w-full rounded-md border border-stone-400 bg-white px-4 text-base text-stone-900 focus-ring transition-colors duration-150 hover:border-stone-600 aria-invalid:border-red-600',
        className,
      )}
    />
  );
};
