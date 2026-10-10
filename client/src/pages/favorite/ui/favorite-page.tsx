import { useFavoriteIds } from '@/entities/favorite';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

import { EmptyFavorites } from './empty-favorites';
import { FavoriteList } from './favorite-list';

export const FavoritePage = () => {
  const { productIds, isPending, isError } = useFavoriteIds();
  const isEmpty = !isPending && !isError && productIds.length === 0;

  return (
    <main className="flex flex-1">
      <PageMeta title="Избранное" noindex />
      <Container className="flex flex-1 flex-col">
        {isEmpty ? <EmptyFavorites /> : <FavoriteList />}
      </Container>
    </main>
  );
};
