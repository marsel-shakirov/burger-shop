import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 2;

export const MenuTabsSkeleton = () => {
  return (
    <div
      className="flex gap-1 rounded-full bg-white p-1 shadow-[0_1px_3px_rgb(0_0_0/0.08)] sm:w-fit"
      aria-busy="true"
      aria-label="Загрузка меню"
    >
      {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-10 flex-1 rounded-full sm:w-32 sm:flex-none" />
      ))}
    </div>
  );
};
