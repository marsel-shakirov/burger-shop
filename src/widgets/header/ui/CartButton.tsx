import { Link } from 'react-router';

import { CartSummary } from '@/entities/cart';

export const CartButton = () => {
  return (
    <Link
      to="/cart"
      className="flex cursor-pointer justify-between gap-x-3 rounded-4xl bg-orange-500 px-5.75 py-3 font-bold text-white"
    >
      <CartSummary price={520} quantity={3} />
    </Link>
  );
};
