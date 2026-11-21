import { Link } from 'react-router';

import { routes } from '@/shared/config';
import { useLastSearch } from '@/shared/lib';
import { Container } from '@/shared/ui/container';
import { ArrowIcon, HeartIcon } from '@/shared/ui/icon';
import { PageMeta } from '@/shared/ui/page-meta';

import { useFavoriteProducts } from '../model/use-favorite-products';
import { FavoriteList } from './favorite-list';

const EmptyFavorites = () => {
  const homeSearch = useLastSearch(routes.home);

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-y-8 text-center">
      <HeartIcon className="size-24 fill-red-100 text-red-600" />
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">В избранном пока пусто</h1>
        <p className="text-stone-500">Нажмите на сердечко у товара, чтобы сохранить его здесь</p>
      </div>
      <Link
        to={{ pathname: routes.home, search: homeSearch }}
        className="flex items-center justify-center gap-x-2 rounded-4xl border border-stone-300 px-4 py-3 text-stone-600 focus-ring transition-colors duration-150 hover:border-stone-400 hover:text-stone-900"
      >
        <ArrowIcon className="size-3" />
        <span className="text-sm font-bold">Перейти в меню</span>
      </Link>
    </section>
  );
};

export const FavoritePage = () => {
  const favorites = useFavoriteProducts();
  const isEmpty = !favorites.isPending && !favorites.isError && favorites.products.length === 0;

  return (
    <main className="flex flex-1">
      <PageMeta title="Избранное" noindex />
      <Container className="flex flex-1 flex-col">
        {isEmpty ? <EmptyFavorites /> : <FavoriteList favorites={favorites} />}
      </Container>
    </main>
  );
};
