import { Link } from 'react-router';

import { CartSummary } from '@/entities/cart';
import { routes } from '@/shared/routes';

export const CartLink = () => {
  return (
    <Link
      to={routes.cart}
      className="flex cursor-pointer items-center justify-between gap-x-3 font-bold"
    >
      <CartSummary />
    </Link>
  );
};
