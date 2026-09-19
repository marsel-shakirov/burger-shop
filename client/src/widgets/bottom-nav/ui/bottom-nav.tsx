import { NavLink } from 'react-router';

import { selectTotalQuantity, useCartStore } from '@/entities/cart';
import { routes } from '@/shared/config';
import { CartIcon, HeartIcon, HomeIcon, ProfileIcon } from '@/shared/ui/icon';
import { QuantityBadge } from '@/shared/ui/quantity-badge';

const navItems = [
  { to: routes.home, label: 'Главная', Icon: HomeIcon },
  { to: routes.favorites, label: 'Избранное', Icon: HeartIcon },
  { to: routes.cart, label: 'Корзина', Icon: CartIcon },
  { to: routes.profile, label: 'Профиль', Icon: ProfileIcon },
] as const;

export const BottomNav = () => {
  const totalQuantity = useCartStore(selectTotalQuantity);

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-60 h-bottom-nav rounded-t-xl bg-white pt-1 pb-[env(safe-area-inset-bottom)] shadow-(--shadow-base) xs:hidden xs:pb-0"
    >
      <ul role="list" className="flex justify-around text-sm">
        {navItems.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === routes.home}
              className={({ isActive }) =>
                `flex flex-col items-center gap-y-0.5 px-1.5 py-1 font-bold focus-ring transition-colors duration-300 ease-out ${
                  isActive ? 'text-orange-500' : 'text-stone-400 hover:text-orange-500/50'
                }`
              }
            >
              <Icon className="relative size-6" />
              <span>{label}</span>
              {to === routes.cart && totalQuantity > 0 && (
                <QuantityBadge
                  quantity={totalQuantity}
                  className="absolute size-4 translate-x-full -translate-y-1/4 bg-red-600"
                />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
