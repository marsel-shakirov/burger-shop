import { cn } from '@/shared/lib';
import { Skeleton } from '@/shared/ui/skeleton';

import { PROMO_SLIDE_CLASS, PROMO_TRACK_CLASS } from '../config/promo-carousel.constants';

const SKELETON_SLIDES_COUNT = 2;

interface PromoCarouselSkeletonProps {
  className?: string;
}

export const PromoCarouselSkeleton = ({ className }: PromoCarouselSkeletonProps) => {
  return (
    <div
      className={cn('flex flex-col gap-y-3', className)}
      aria-busy="true"
      aria-label="Загрузка акций"
    >
      <div className={cn('flex gap-2.5 overflow-hidden py-1 sm:gap-4', PROMO_TRACK_CLASS)}>
        {Array.from({ length: SKELETON_SLIDES_COUNT }, (_, index) => (
          <Skeleton key={index} className={cn('shrink-0 rounded-2xl', PROMO_SLIDE_CLASS)} />
        ))}
      </div>
      <div className="flex h-9 items-center">
        <Skeleton className="h-2 w-20 rounded-full" />
      </div>
    </div>
  );
};
