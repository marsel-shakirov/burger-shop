import { Skeleton } from '@/shared/ui/skeleton';

const SHORTCUTS_COUNT = 2;

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-6" aria-busy="true" aria-label="Загрузка профиля">
      <div className="flex items-center gap-x-3">
        <Skeleton className="size-14 shrink-0 rounded-2xl" />
        <div className="flex h-7 items-center">
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: SHORTCUTS_COUNT }, (_, index) => (
          <div key={index} className="flex flex-col gap-y-3 rounded-2xl bg-stone-100 p-3 sm:p-4">
            <Skeleton className="size-7" />
            <div className="flex flex-col gap-y-0.5">
              <div className="flex h-5 items-center">
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="flex h-5 items-center">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
