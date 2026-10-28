import type { ComponentPropsWithoutRef } from 'react';

import { formatItemsCount } from '@/shared/lib';
import { cn } from '@/shared/lib';
import { QuantityBadge } from '@/shared/ui/quantity-badge';

import { useCartTotalQuantity } from '../model/use-cart';

type CartNavBadgeProps = Pick<ComponentPropsWithoutRef<'span'>, 'className'>;

export const CartNavBadge = ({ className }: CartNavBadgeProps) => {
  const { totalQuantity } = useCartTotalQuantity();

  if (totalQuantity === 0) return null;

  return (
    <>
      <QuantityBadge
        aria-hidden="true"
        quantity={totalQuantity}
        className={cn('bg-red-600', className)}
      />
      <span className="sr-only">, {formatItemsCount(totalQuantity)}</span>
    </>
  );
};
