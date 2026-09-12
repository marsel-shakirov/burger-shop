import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 8;

export const ProductGridSkeleton = () => {
  return (
    <section className="py-4 sm:py-7" aria-busy="true" aria-label="Загрузка товаров">
      <Skeleton className="h-6 w-32" />

      <ul className="grid gap-5 pt-3 xs:grid-cols-2 sm:grid-cols-3 md:pt-5 lg:grid-cols-4">
        {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
          <li key={index}>
            <article className="grid grid-cols-2 gap-x-2 gap-y-4 rounded-xl p-3 shadow-(--shadow-base) xs:grid-cols-1 md:p-4 lg:p-5">
              <Skeleton className="row-span-2 aspect-square w-full" />

              <div className="flex items-center justify-center">
                <Skeleton className="mx-auto h-5 w-3/6" />
              </div>

              <div className="mt-3 flex items-end-safe justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-15" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
