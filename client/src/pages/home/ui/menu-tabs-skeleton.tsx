import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 2;

export const MenuTabsSkeleton = () => {
  return (
    <div className="mt-4 flex gap-x-3" aria-busy="true" aria-label="Загрузка меню">
      {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-7 w-19 rounded-xl sm:h-8 sm:w-19" />
      ))}
    </div>
  );
};
