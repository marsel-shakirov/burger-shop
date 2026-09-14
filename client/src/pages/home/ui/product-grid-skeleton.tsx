import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_ITEMS_COUNT = 8;

export const ProductGridSkeleton = () => {
  return (
    <section className="py-4 sm:py-7" aria-busy="true" aria-label="Загрузка товаров">
      <Skeleton className="h-7 w-34" />

      <ul className="grid grid-cols-2 gap-5 pt-3 xs:grid-cols-3 md:pt-5 lg:grid-cols-4">
        {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
          <li key={index}>
            <article className="grid gap-x-2 gap-y-2 rounded-xl p-3 shadow-(--shadow-base) md:p-4 lg:p-5">
              <Skeleton className="aspect-square w-full" />

              <div className="flex flex-col gap-y-1.5">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-8 w-7/7" />
              </div>

              <div className="mt-3 flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-5 w-2/5" />
                </div>
                <Skeleton className="h-7 w-full" />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
