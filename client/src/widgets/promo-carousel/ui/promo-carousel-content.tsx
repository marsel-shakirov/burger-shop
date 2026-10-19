import { useSuspenseQuery } from '@tanstack/react-query';

import { promosQueryOptions } from '@/entities/promo';
import { useSessionStatus } from '@/entities/session';
import { Carousel } from '@/shared/ui/carousel';

import { PROMO_SLIDE_CLASS, PROMO_TRACK_CLASS } from '../config/promo-carousel.constants';
import { PromoCarouselSkeleton } from './promo-carousel-skeleton';
import { PromoSlide } from './promo-slide';

interface PromoCarouselContentProps {
  className?: string;
}

export const PromoCarouselContent = ({ className }: PromoCarouselContentProps) => {
  const status = useSessionStatus();
  const { data } = useSuspenseQuery(promosQueryOptions());

  if (status === 'loading') return <PromoCarouselSkeleton className={className} />;
  const promos = data.filter((promo) => !(status === 'authenticated' && promo.kind === 'bonus'));

  if (promos.length === 0) return null;

  return (
    <Carousel
      label="Акции и бонусы"
      className={className}
      items={promos}
      getKey={(promo) => promo.id}
      renderItem={(promo, index) => <PromoSlide promo={promo} priority={index === 0} />}
      trackClassName={PROMO_TRACK_CLASS}
      slideClassName={PROMO_SLIDE_CLASS}
    />
  );
};
