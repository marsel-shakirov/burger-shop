import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { Receipt } from '@/shared/ui/receipt';

interface ReceiptCardProps {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const ReceiptCard = ({ children, footer, className }: ReceiptCardProps) => {
  return (
    <div className={cn('relative', className)}>
      <Receipt.Root>
        <Receipt.Body className="pt-14 pb-8 sm:px-7">{children}</Receipt.Body>

        {footer && <Receipt.Stub className="sm:px-7">{footer}</Receipt.Stub>}
      </Receipt.Root>

      <Receipt.Dish />
    </div>
  );
};
