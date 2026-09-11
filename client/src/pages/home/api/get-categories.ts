import type { Category } from '../model/category.types';

export const getCategories = async ({ signal }: { signal: AbortSignal }): Promise<Category[]> => {
  const response = await fetch('api/categories', { signal });

  if (!response.ok) {
    throw new Error('Failed to load categories');
  }

  return response.json();
};
