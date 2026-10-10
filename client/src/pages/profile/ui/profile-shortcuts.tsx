import { Link } from 'react-router';

import { selectFavoritesCount, useFavoriteStore } from '@/entities/favorite';
import { routes } from '@/shared/config';
import { cn, formatItemsCount } from '@/shared/lib';
import { BagIcon, HeartIcon } from '@/shared/ui/icon';

const tileClassName = 'flex h-full flex-col gap-y-3 rounded-2xl bg-stone-100 p-3 sm:p-4';

export const ProfileShortcuts = () => {
  const favoritesCount = useFavoriteStore(selectFavoritesCount);

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
          <HeartIcon className="size-7 text-stone-400" />
          <span className="flex min-w-0 flex-col gap-y-0.5">
            <span className="truncate font-bold">Избранное</span>
            <span className="truncate text-sm text-stone-500">
              {favoritesCount > 0 ? formatItemsCount(favoritesCount) : 'Пока пусто'}
            </span>
          </span>
        </Link>
      </li>

      <li>
        <div className={tileClassName}>
          <BagIcon className="size-7 text-stone-400" />
          <span className="flex min-w-0 flex-col gap-y-0.5">
            <span className="truncate font-bold">Покупки</span>
            <span className="truncate text-sm text-stone-500">Скоро появятся</span>
          </span>
        </div>
      </li>
    </ul>
  );
};
