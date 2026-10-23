import type { Product } from '@/entities/product';

export const getCategoryLeaders = (products: Product[], limit: number) => {
  const leadersByCategory = new Map<Product['category_id'], Product>();

  for (const product of products.toSorted((a, b) => b.popularity - a.popularity)) {
    if (!leadersByCategory.has(product.category_id)) {
      leadersByCategory.set(product.category_id, product);
    }
  }

  return [...leadersByCategory.values()].slice(0, limit);
};
