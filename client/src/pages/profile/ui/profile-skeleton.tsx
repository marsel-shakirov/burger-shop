import { Skeleton } from '@/shared/ui/skeleton';

const SHORTCUTS_COUNT = 2;

export const ProfileSkeleton = () => (
  <div
    className="grid items-start gap-y-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-x-9 md:gap-y-6"
    aria-busy="true"
    aria-label="Загрузка профиля"
  >
    <div className="flex items-center gap-3.5 rounded-[1.375rem] border border-stone-200 bg-white p-4 md:gap-5 md:p-6">
      <Skeleton className="size-13 shrink-0 rounded-xl md:size-18 md:rounded-[1.125rem]" />
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-6 w-28 max-w-full md:h-8" />
        <Skeleton className="h-3.5 w-40 max-w-full" />
      </div>
    </div>

    <div className="rounded-[1.125rem] border border-t-[5px] border-stone-200 border-t-pickle bg-white md:col-start-2 md:row-span-2 md:row-start-1">
      <div className="flex min-h-19 items-center justify-between gap-3 px-4 py-3.5 md:px-5 md:py-4.5">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
      <div className="border-t border-stone-200 px-4 py-3 md:px-5 md:py-4">
        <Skeleton className="my-0.5 h-4 w-32" />
      </div>
    </div>

    <div className="divide-y divide-stone-200 border-b border-stone-200">
      {Array.from({ length: SHORTCUTS_COUNT }, (_, index) => (
        <div key={index} className="flex min-h-14 items-center gap-3 px-1 py-2 md:min-h-16">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>
      ))}
    </div>
  </div>
);
