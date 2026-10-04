import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEM_WIDTHS = ['w-13 sm:w-15', 'w-24 sm:w-26', 'w-20 sm:w-22', 'w-16 sm:w-18'];

export const CategoryFilterSkeleton = () => {
  return (
    <div
      className="flex items-center gap-x-2.5 md:gap-x-3.5"
      aria-busy="true"
      aria-label="Загрузка категорий"
    >
      {SKELETON_ITEM_WIDTHS.map((width, index) => (
        <Skeleton key={index} className={`h-9 rounded-4xl sm:h-10 ${width}`} />
      ))}
    </div>
  );
};
