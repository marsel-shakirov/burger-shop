import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 4;

export const CategoryFilterSkeleton = () => {
  return (
    <div
      className="mt-3 flex items-center gap-x-2.5 md:gap-x-3.5"
      aria-busy="true"
      aria-label="Загрузка категорий"
    >
      {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-7 w-15 rounded-xl sm:h-8 sm:w-19" />
      ))}
    </div>
  );
};
