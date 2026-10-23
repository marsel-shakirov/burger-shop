import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib';

export const buttonClass =
  'inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-orange-500 px-6 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  pending?: boolean;
}

export const Button = ({ pending = false, disabled, className, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || pending}
      className={cn(buttonClass, pending && 'disabled:cursor-wait disabled:opacity-60', className)}
    />
  );
};
