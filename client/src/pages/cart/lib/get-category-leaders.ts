import type { Product } from '@/entities/product';

export const getCategoryLeaders = (products: Product[], limit: number) => {
  const leadersByCategory = new Map<Product['categoryId'], Product>();

  for (const product of products.toSorted((a, b) => b.popularity - a.popularity)) {
    if (!leadersByCategory.has(product.categoryId)) {
      leadersByCategory.set(product.categoryId, product);
    }
  }

  return [...leadersByCategory.values()].slice(0, limit);
};
