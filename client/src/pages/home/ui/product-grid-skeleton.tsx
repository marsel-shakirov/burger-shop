import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 8;

export const ProductGridSkeleton = () => {
  return (
    <section className="py-4 sm:py-7" aria-busy="true" aria-label="Загрузка товаров">
      <Skeleton className="h-6 w-64 max-w-full sm:h-7" />

      <ul className="grid grid-cols-2 gap-2.5 pt-3 xs:grid-cols-3 md:pt-5 lg:grid-cols-4">
        {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
          <li key={index}>
            <article className="flex h-full flex-col rounded-xl bg-white p-2 shadow-(--shadow-base) md:p-4 lg:p-5">
              <div className="flex h-6 items-center justify-between">
                <Skeleton className="h-4 w-9" />
                <Skeleton className="size-6" />
              </div>

              <Skeleton className="mt-1 aspect-square w-full" />

              <div className="flex grow flex-col gap-y-1.5">
                <div className="flex h-8.75 flex-col justify-around xs:h-5">
                  <Skeleton className="h-3.5 w-5/6" />
                  <Skeleton className="h-3.5 w-1/2 xs:hidden" />
                </div>
                <div className="flex h-8 flex-col justify-around">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-y-1.5">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-9 w-full" />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
