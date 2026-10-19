import type { Product } from '@/entities/product';

export interface SortHighlights {
  mostPopularName: string;
  topRating: number;
  minPrice: number;
  maxPrice: number;
}

export const getSortHighlights = (products: Product[]): SortHighlights | undefined => {
  if (products.length === 0) return undefined;

  const mostPopular = products.reduce((best, product) =>
    product.popularity > best.popularity ? product : best,
  );
  const prices = products.map((product) => product.price);
  const ratings = products.map((product) => product.rating);

  return {
    mostPopularName: mostPopular.name,
    topRating: Math.max(...ratings),
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
};
