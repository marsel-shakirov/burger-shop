import { Skeleton } from '@/shared/ui/skeleton';

export const ProfileEditSkeleton = () => (
  <div
    className="grid items-start gap-4 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-9"
    aria-busy="true"
    aria-label="Загрузка личных данных"
  >
    <div className="grid min-w-0 gap-4">
      <div className="flex items-start gap-3.5 rounded-[1.375rem] border border-stone-200 bg-white p-4 md:gap-5 md:p-6">
        <Skeleton className="size-13 shrink-0 rounded-xl md:size-18 md:rounded-[1.125rem]" />
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-28 max-w-full md:h-8" />
          <Skeleton className="h-4 w-36 max-w-full" />
          <div className="mt-2 flex min-h-9 items-center">
            <Skeleton className="h-3.5 w-40 max-w-full" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-lime-900/10 bg-pickle p-3.5 md:px-4">
        <Skeleton className="size-11 shrink-0 rounded-xl bg-paper" />
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-4 w-28 max-w-full bg-stone-900/10" />
          <Skeleton className="h-3 w-56 max-w-full bg-stone-900/10" />
        </div>
      </div>
    </div>

    <div className="rounded-[1.375rem] border border-stone-200 bg-white p-4 md:p-6">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-2 h-4 w-52 max-w-full" />
      <div className="mt-3">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex items-center justify-between gap-3 border-t border-stone-200 py-3 last:pb-0"
          >
            <div className="min-w-0 space-y-1.5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-36 max-w-full" />
            </div>
            <div className="flex min-h-9 items-center">
              <Skeleton className="h-3.5 w-16 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
