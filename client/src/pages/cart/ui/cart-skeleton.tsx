import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ROWS = 3;

export const CartSkeleton = () => {
  return (
    <>
      <div className="rounded-xl bg-white shadow-(--shadow-base)">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-stone-100 p-3 not-first:border-t sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(7rem,auto)_auto] sm:items-center sm:gap-x-5 sm:p-4"
          >
            <div className="flex h-17 w-18 flex-col items-center justify-end self-start sm:row-start-1 sm:h-22 sm:w-24">
              <Skeleton className="-mb-3 h-9 w-13 rounded-[999px_999px_10px_10px] sm:-mb-4 sm:h-12 sm:w-17" />
              <Skeleton className="h-5 w-full rounded-[50%] sm:h-6" />
            </div>

            <div className="flex flex-col gap-y-2 pt-1 sm:row-start-1 sm:pt-0">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>

            <div className="flex gap-x-4 sm:col-start-5 sm:row-start-1">
              <Skeleton className="size-5" />
              <Skeleton className="size-5" />
            </div>

            <div className="col-span-3 flex items-center justify-between gap-x-3 sm:contents">
              <Skeleton className="h-9 w-28 rounded-full sm:col-start-3 sm:row-start-1" />
              <Skeleton className="h-5 w-16 justify-self-end sm:col-start-4 sm:row-start-1" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-80" />
    </>
  );
};
