import { Link } from 'react-router';

import { CartSummary } from '@/entities/cart';
import { routes } from '@/shared/routes';

export const CartButton = () => {
  return (
    <Link
      to={routes.cart}
      className="flex cursor-pointer items-center justify-between gap-x-2 rounded-4xl bg-orange-500 p-2 font-bold text-white sm:p-2.5"
    >
      <CartSummary />
    </Link>
  );
};
