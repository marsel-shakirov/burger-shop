import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEM_WIDTHS = ['w-14', 'w-26', 'w-22', 'w-18'];

export const CategoryFilterSkeleton = () => {
  return (
    <div className="flex gap-2 overflow-hidden" aria-busy="true" aria-label="Загрузка категорий">
      {SKELETON_ITEM_WIDTHS.map((width, index) => (
        <Skeleton key={index} className={`h-10 shrink-0 rounded-full ${width}`} />
      ))}
    </div>
  );
};
