import { Link } from 'react-router';

import { useFavoritesCount } from '@/entities/favorite';
import { routes } from '@/shared/config';
import { cn, formatItemsCount } from '@/shared/lib';
import { ArrowIcon, BagIcon, HeartIcon } from '@/shared/ui/icon';

const rowClassName =
  'grid min-h-14 grid-cols-[2.25rem_minmax(0,1fr)_auto_0.5rem] items-center gap-x-2 px-1 py-2 md:min-h-16 md:gap-x-3';

const getFavoritesLabel = ({ count, isPending, isError }: ReturnType<typeof useFavoritesCount>) => {
  if (isPending) return 'Загружаем…';
  if (isError) return 'Не удалось загрузить';

  return count > 0 ? formatItemsCount(count) : 'Пока пусто';
};

export const ProfileShortcuts = () => {
  const favoritesCount = useFavoritesCount();

  return (
    <ul role="list" className="min-w-0 divide-y divide-stone-200 border-b border-stone-200">
      <li>
        <Link
          to={routes.favorites}
          className={cn(
            rowClassName,
            'group rounded-lg focus-ring transition-colors duration-150 hover:bg-white',
          )}
        >
          <span className="grid size-9 place-items-center rounded-full bg-red-100 text-red-700">
            <HeartIcon className="size-4 group-hover:text-red-600" />
          </span>
          <span className="text-sm font-bold wrap-anywhere md:text-base">Избранное</span>
          <span className="max-w-24 text-right text-xs text-stone-600 md:max-w-none md:text-sm">
            {getFavoritesLabel(favoritesCount)}
          </span>
          <ArrowIcon className="size-2.5 rotate-180 text-stone-600" />
        </Link>
      </li>

      <li>
        <Link
          to={routes.orders}
          className={cn(
            rowClassName,
            'group rounded-lg focus-ring transition-colors duration-150 hover:bg-white',
          )}
        >
          <span className="grid size-9 place-items-center rounded-full bg-stone-200 text-stone-600">
            <BagIcon className="size-4 group-hover:text-stone-800" />
          </span>
          <span className="text-sm font-bold wrap-anywhere md:text-base">Покупки</span>
          <ArrowIcon className="col-start-4 size-2.5 rotate-180 text-stone-600" />
        </Link>
      </li>
    </ul>
  );
};
