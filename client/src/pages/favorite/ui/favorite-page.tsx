import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

import { useFavoriteProducts } from '../model/use-favorite-products';
import { EmptyFavorites } from './empty-favorites';
import { FavoriteList } from './favorite-list';

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
