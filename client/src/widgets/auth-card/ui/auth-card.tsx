import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { routes } from '@/shared/config';
import { useLastSearch } from '@/shared/lib';
import { ArrowIcon } from '@/shared/ui/icon';
import { ReceiptCard } from '@/shared/ui/receipt-card';

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
        <ReceiptCard
          footer={
            <>
              <p className="text-sm text-stone-500">{switchPrompt}</p>
              <Link
                to={switchLinkTo}
                className="grid h-12 w-full place-content-center rounded-md border border-stone-400 bg-white font-bold text-stone-900 focus-ring transition-colors duration-150 hover:border-stone-900"
              >
                {switchLinkLabel}
              </Link>
            </>
          }
        >
          {children}
        </ReceiptCard>

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
