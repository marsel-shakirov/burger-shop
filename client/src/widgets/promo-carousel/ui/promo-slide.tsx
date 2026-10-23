import { type Promo, PromoCard, PromoCode, PromoCta, PromoValue } from '@/entities/promo';
import { CopyPromoCodeButton } from '@/features/copy-promo-code';
import { routes } from '@/shared/config';

import { getPromoLink } from '../lib/get-promo-link';

interface PromoSlideProps {
  promo: Promo;
  priority: boolean;
}

export const PromoSlide = ({ promo, priority }: PromoSlideProps) => {
  switch (promo.kind) {
    case 'coupon':
      return (
        <PromoCard
          promo={promo}
          to={getPromoLink(promo.link)}
          priority={priority}
          stub={
            <>
              <PromoValue value={promo.value} caption={promo.valueCaption} />
              <div className="relative z-10 flex flex-col items-end gap-1.5 sm:items-start">
                <PromoCode code={promo.code} />
                <CopyPromoCodeButton code={promo.code} />
              </div>
            </>
          }
        />
      );

    case 'bonus':
      return (
        <PromoCard
          promo={promo}
          to={routes.register}
          priority={priority}
          stub={
            <>
              <PromoValue value={promo.value} caption={promo.valueCaption} />
              <PromoCta label={promo.ctaLabel} />
            </>
          }
        />
      );
  }
};
