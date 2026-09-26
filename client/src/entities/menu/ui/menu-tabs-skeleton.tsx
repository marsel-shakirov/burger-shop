import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 2;

export const MenuTabsSkeleton = () => {
  return (
    <div className="flex gap-x-5 pt-2.5 sm:pt-5" aria-busy="true" aria-label="Загрузка меню">
      {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
        <div key={index} className="flex h-7.5 items-center">
          <Skeleton className="h-5 w-18" />
        </div>
      ))}
    </div>
  );
};
