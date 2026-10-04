import { NavLink } from 'react-router';

import { CartNavBadge } from '@/entities/cart';
import { navItems, routes } from '@/shared/config';
import { cn, selectSearchByPath, useLastSearchStore } from '@/shared/lib';

type Variant = 'bottom' | 'header';

interface MainNavProps {
  variant: Variant;
  className?: string;
}

const styles: Record<
  Variant,
  { nav: string; list: string; item: string; link: string; label: string }
> = {
  bottom: {
    nav: 'fixed inset-x-0 bottom-0 z-60 h-bottom-nav rounded-t-xl bg-white pt-1 pb-[env(safe-area-inset-bottom)] shadow-(--shadow-base) xs:hidden',
    list: 'flex justify-around text-sm',
    item: 'flex-1',
    link: 'flex flex-col items-center gap-y-0.5 px-1.5 py-1 text-stone-500',
    label: '',
  },
  header: {
    nav: 'hidden xs:block',
    list: 'flex gap-x-1 text-base sm:gap-x-2 lg:gap-x-3.5',
    item: '',
    link: 'flex flex-col items-center gap-y-0.5 px-1 py-1 text-xs text-stone-600 md:text-base',
    label:
      'border-b-2 border-transparent transition-colors duration-150 ease-out group-aria-[current=page]:border-orange-600',
  },
};

export const MainNav = ({ variant, className }: MainNavProps) => {
  const s = styles[variant];
  const searchByPath = useLastSearchStore(selectSearchByPath);

  return (
    <nav aria-label="Основная навигация" className={cn(s.nav, className)}>
      <ul role="list" className={s.list}>
        {navItems.map(({ to, label, Icon }) => (
          <li key={to} className={s.item}>
            <NavLink
              to={{ pathname: to, search: searchByPath[to] }}
              end={to === routes.home}
              className={cn(
                'group rounded-md font-bold focus-ring transition-colors duration-150 ease-out hover:text-stone-900 aria-[current=page]:text-stone-900',
                s.link,
              )}
            >
              <span className={s.label}>{label}</span>
              <span className="relative order-first">
                <Icon className="size-6 transition-colors duration-150 ease-out group-aria-[current=page]:text-orange-600" />
                {to === routes.cart && (
                  <CartNavBadge className="absolute -top-1 -right-2.5 size-4" />
                )}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
