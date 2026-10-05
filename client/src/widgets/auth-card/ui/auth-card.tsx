import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { routes } from '@/shared/config';
import { useLastSearch } from '@/shared/lib';
import { ArrowIcon, BurgerIcon } from '@/shared/ui/icon';

interface AuthCardProps {
  children: ReactNode;
  switchPrompt: string;
  switchLinkTo: string;
  switchLinkLabel: string;
}

export const AuthCard = ({
  children,
  switchPrompt,
  switchLinkTo,
  switchLinkLabel,
}: AuthCardProps) => {
  const homeSearch = useLastSearch(routes.home);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-[clamp(10px,3vw,40px)] pt-14 pb-8 sm:pt-20 sm:pb-12">
      <div className="flex w-full max-w-sm flex-col gap-y-5">
        <div className="relative">
          <div className="flex flex-col gap-y-2 drop-shadow-[0_5px_20px_rgb(0_0_0/0.07)]">
            <div className="rounded-t-xl bg-white receipt-edge">
              <div className="flex flex-col gap-y-6 px-5 pt-14 pb-8 sm:px-7">{children}</div>
            </div>

            <div className="rounded-b-xl bg-white receipt-edge-top">
              <div className="flex flex-col gap-y-3 px-5 pt-4 pb-6 sm:px-7">
                <p className="text-sm text-stone-500">{switchPrompt}</p>
                <Link
                  to={switchLinkTo}
                  className="grid h-12 w-full place-content-center rounded-md border border-stone-400 bg-white font-bold text-stone-900 focus-ring transition-colors duration-150 hover:border-stone-900"
                >
                  {switchLinkLabel}
                </Link>
              </div>
            </div>
          </div>

          <BurgerIcon className="absolute -top-9 left-5 size-18 animate-dish-drop drop-shadow-[0_8px_6px_rgb(0_0_0/0.18)] motion-reduce:animate-none sm:left-7" />
        </div>

        <Link
          to={{ pathname: routes.home, search: homeSearch }}
          className="flex items-center gap-x-2 self-center rounded-md px-2 py-1 text-sm font-bold text-stone-500 focus-ring transition-colors duration-150 hover:text-stone-900"
        >
          <ArrowIcon className="size-3" />
          Вернуться в меню
        </Link>
      </div>
    </main>
  );
};
