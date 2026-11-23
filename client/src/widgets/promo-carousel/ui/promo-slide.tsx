import { type Promo, PromoCard } from '@/entities/promo';
import { CopyPromoCodeButton } from '@/features/copy-promo-code';
import { routes } from '@/shared/config';

import { getPromoLink } from '../lib/get-promo-link';

interface PromoSlideProps {
  promo: Promo;
  priority: boolean;
}

const PromoCode = ({ code }: { code: string }) => (
  <span className="rounded-md border-[1.5px] border-current px-2 py-0.5 text-[0.9375rem] font-extrabold tracking-[0.08em] select-all">
    {code}
  </span>
);

const PromoCta = ({ label }: { label: string }) => (
  <span
    aria-hidden="true"
    className="rounded-full bg-stone-900 px-3.5 py-2.5 text-sm leading-none font-bold whitespace-nowrap text-paper"
  >
    {label}
  </span>
);

export const PromoSlide = ({ promo, priority }: PromoSlideProps) => {
  const { to, stub } =
    promo.kind === 'coupon'
      ? {
          to: getPromoLink(promo.link),
          stub: (
            <div className="relative z-10 flex flex-col items-end gap-1.5 sm:items-start">
              <PromoCode code={promo.code} />
              <CopyPromoCodeButton code={promo.code} />
            </div>
          ),
        }
      : {
          to: routes.register,
          stub: <PromoCta label={promo.ctaLabel} />,
        };

  return <PromoCard promo={promo} to={to} priority={priority} stub={stub} />;
};
