import type { Category } from '../model/categories.types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');

  if (!response.ok) {
    throw new Error('Failed to load categories');
  }

  return response.json();
};
