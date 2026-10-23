import { Skeleton } from '@/shared/ui/skeleton';

const SHORTCUTS_COUNT = 2;

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4" aria-busy="true" aria-label="Загрузка профиля">
      <div className="flex items-center gap-x-3">
        <Skeleton className="size-14 shrink-0 rounded-2xl" />
        <div className="flex h-7 items-center">
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: SHORTCUTS_COUNT }, (_, index) => (
          <div key={index} className="flex flex-col gap-y-1 rounded-2xl bg-stone-100 p-3">
            <Skeleton className="size-6" />
            <div className="flex flex-col gap-y-0.5">
              <div className="flex h-5 items-center">
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="flex h-4 items-center">
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-y-3">
        <div className="flex h-5 items-center">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex h-5 items-center">
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex items-center justify-between gap-x-4 border-t border-dashed border-stone-300 pt-3">
          <div className="flex h-5 items-center">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex h-8 items-center">
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
        <div className="flex h-4 items-center">
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
    </div>
  );
};
