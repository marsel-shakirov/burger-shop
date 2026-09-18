import { Link } from 'react-router';

import { CartSummary } from '@/entities/cart';
import { routes } from '@/shared/config';

export const CartLink = () => {
  return (
    <Link
      to={routes.cart}
      className="flex cursor-pointer items-center justify-between gap-x-3 rounded-md font-bold focus-ring"
    >
      <CartSummary />
    </Link>
  );
};
