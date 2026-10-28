import { Link } from 'react-router';

import { useFavoritesCount } from '@/entities/favorite';
import { routes } from '@/shared/config';
import { cn, formatItemsCount } from '@/shared/lib';
import { BagIcon, HeartIcon } from '@/shared/ui/icon';

const tileClassName = 'flex h-full flex-col gap-y-1 rounded-2xl bg-stone-100 p-3';

const getFavoritesLabel = ({ count, isPending, isError }: ReturnType<typeof useFavoritesCount>) => {
  if (isPending) return 'Загружаем…';
  if (isError) return 'Не удалось загрузить';

  return count > 0 ? formatItemsCount(count) : 'Пока пусто';
};

export const ProfileShortcuts = () => {
  const favoritesCount = useFavoritesCount();

  return (
    <ul role="list" className="grid grid-cols-2 gap-2">
      <li>
        <Link
          to={routes.favorites}
          className={cn(
            tileClassName,
            'focus-ring transition-colors duration-150 hover:bg-stone-200/70',
          )}
        >
          <HeartIcon className="size-6 text-stone-400" />
          <span className="flex min-w-0 flex-col gap-y-0.5">
            <span className="truncate text-sm font-bold">Избранное</span>
            <span className="truncate text-xs text-stone-500">
              {getFavoritesLabel(favoritesCount)}
            </span>
          </span>
        </Link>
      </li>

      <li>
        <div className={tileClassName}>
          <BagIcon className="size-6 text-stone-400" />
          <span className="flex min-w-0 flex-col gap-y-0.5">
            <span className="truncate text-sm font-bold">Покупки</span>
            <span className="truncate text-xs text-stone-500">Скоро появятся</span>
          </span>
        </div>
      </li>
    </ul>
  );
};
