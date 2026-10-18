import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { PromoCarouselContent } from './promo-carousel-content';
import { PromoCarouselSkeleton } from './promo-carousel-skeleton';

interface PromoCarouselProps {
  className?: string;
}

export const PromoCarousel = ({ className }: PromoCarouselProps) => {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={<PromoCarouselSkeleton className={className} />}>
        <PromoCarouselContent className={className} />
      </Suspense>
    </ErrorBoundary>
  );
};
