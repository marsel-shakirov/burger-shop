import type { Product } from '@/entities/product';

export interface SortHighlights {
  lastAddedName: string;
  mostPopularName: string;
  topRating: number;
  minPrice: number;
  maxPrice: number;
}

export const getSortHighlights = (products: Product[]): SortHighlights | undefined => {
  const [lastAdded] = products;
  if (!lastAdded) return undefined;

  const mostPopular = products.reduce((best, product) =>
    product.popularity > best.popularity ? product : best,
  );
  const prices = products.map((product) => product.price);
  const ratings = products.map((product) => product.rating);

  return {
    lastAddedName: lastAdded.name,
    mostPopularName: mostPopular.name,
    topRating: Math.max(...ratings),
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
};
