import { Skeleton } from '@/shared/ui/skeleton';

export const ProfileEditSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-6" aria-busy="true" aria-label="Загрузка личных данных">
      <div className="flex items-start gap-x-4">
        <Skeleton className="size-16 shrink-0 rounded-2xl" />
        <div className="flex flex-col pt-1">
          <div className="flex h-7 items-center">
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="mt-1 flex h-5 items-center">
            <Skeleton className="h-3.5 w-44" />
          </div>
          <div className="flex h-5 items-center">
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div className="mt-2 flex h-5 items-center">
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3 rounded-2xl bg-stone-100 p-3 sm:p-4">
        <Skeleton className="size-12 shrink-0 rounded-xl" />
        <div className="flex flex-1 flex-col gap-y-0.5">
          <div className="flex flex-col">
            <div className="flex h-5 items-center">
              <Skeleton className="h-3.5 w-full" />
            </div>
            <div className="flex h-5 items-center">
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex h-5 items-center">
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="flex h-5 items-center">
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-dashed border-stone-300" />

      <div className="flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-1.5">
          <div className="flex h-7 items-center">
            <Skeleton className="h-4.5 w-40" />
          </div>
          <div className="flex h-5 items-center">
            <Skeleton className="h-3.5 w-56 max-w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-y-0.5">
          <div className="flex h-5 items-center">
            <Skeleton className="h-3.5 w-16" />
          </div>
          <div className="flex h-7 items-center">
            <Skeleton className="h-4.5 w-40" />
          </div>
          <div className="mt-1.5 flex h-5 items-center">
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>

        <div className="flex flex-col gap-y-0.5">
          <div className="flex h-5 items-center">
            <Skeleton className="h-3.5 w-12" />
          </div>
          <div className="flex h-7 items-center">
            <Skeleton className="h-4.5 w-56 max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
