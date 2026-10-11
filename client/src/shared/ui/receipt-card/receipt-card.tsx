import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { BurgerIcon } from '@/shared/ui/icon';

interface ReceiptCardProps {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const ReceiptCard = ({ children, footer, className }: ReceiptCardProps) => {
  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-col gap-y-2 drop-shadow-[0_5px_20px_rgb(0_0_0/0.07)]">
        <div className="rounded-t-xl bg-white receipt-edge">
          <div className="flex flex-col gap-y-5 px-5 pt-14 pb-8 sm:px-7">{children}</div>
        </div>

        {footer && (
          <div className="rounded-b-xl bg-white receipt-edge-top">
            <div className="flex flex-col gap-y-3 px-5 pt-4 pb-6 sm:px-7">{footer}</div>
          </div>
        )}
      </div>

      <BurgerIcon className="absolute -top-9 left-5 size-18 animate-dish-drop drop-shadow-[0_8px_6px_rgb(0_0_0/0.18)] motion-reduce:animate-none sm:left-7" />
    </div>
  );
};
