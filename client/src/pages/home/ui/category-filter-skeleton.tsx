import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 4;

export const CategoryFilterSkeleton = () => {
  return (
    <div className="flex items-center gap-x-2.5" aria-busy="true" aria-label="Загрузка категорий">
      {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-6 w-13 rounded-xl min-[450px]:h-8 min-[450px]:w-24" />
      ))}
    </div>
  );
};
