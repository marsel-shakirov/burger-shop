import type { ComponentPropsWithoutRef } from 'react';

import { formatItemsCount } from '@/shared/lib';
import { QuantityBadge } from '@/shared/ui/quantity-badge';

import { selectTotalQuantity } from '../model/cart.selectors';
import { useCartStore } from '../model/cart.store';

type CartNavBadgeProps = Pick<ComponentPropsWithoutRef<'span'>, 'className'>;

export const CartNavBadge = ({ className = '' }: CartNavBadgeProps) => {
  const totalQuantity = useCartStore(selectTotalQuantity);

  if (totalQuantity === 0) return null;

  return (
    <>
      <QuantityBadge
        aria-hidden="true"
        quantity={totalQuantity}
        className={`bg-red-600 ${className}`}
      />
      <span className="sr-only">, {formatItemsCount(totalQuantity)}</span>
    </>
  );
};
