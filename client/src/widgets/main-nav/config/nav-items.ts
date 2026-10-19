import type { ComponentType, SVGProps } from 'react';

import { routes } from '@/shared/config';
import { CartIcon, HeartIcon, MenuIcon, ProfileIcon } from '@/shared/ui/icon';

export interface NavItem {
  to: (typeof routes)[keyof typeof routes];
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const navItems = [
  { to: routes.home, label: 'Меню', Icon: MenuIcon },
  { to: routes.favorites, label: 'Избранное', Icon: HeartIcon },
  { to: routes.cart, label: 'Корзина', Icon: CartIcon },
  { to: routes.profile, label: 'Профиль', Icon: ProfileIcon },
] as const satisfies readonly NavItem[];
