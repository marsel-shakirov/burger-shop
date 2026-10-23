import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { BurgerIcon } from '@/shared/ui/icon';

interface ReceiptPartProps {
  children: ReactNode;
  className?: string;
}

export const Root = ({ children, className }: ReceiptPartProps) => (
  <div className={cn('flex flex-col gap-y-2 drop-shadow-[0_5px_20px_rgb(0_0_0/0.07)]', className)}>
    {children}
  </div>
);

export const Body = ({ children, className }: ReceiptPartProps) => (
  <div className="rounded-t-xl bg-white receipt-edge">
    <div className={cn('flex flex-col gap-y-4 px-5', className)}>{children}</div>
  </div>
);

export const Stub = ({ children, className }: ReceiptPartProps) => (
  <div className="rounded-b-xl bg-white receipt-edge-top">
    <div className={cn('flex flex-col gap-y-3 px-5 pt-4 pb-6', className)}>{children}</div>
  </div>
);

export const Dish = () => (
  <BurgerIcon className="absolute -top-9 left-5 size-18 animate-dish-drop drop-shadow-[0_8px_6px_rgb(0_0_0/0.18)] motion-reduce:animate-none sm:left-7" />
);
