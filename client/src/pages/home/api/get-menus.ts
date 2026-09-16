import type { Menu } from '../model/menu.types';

export const getMenus = async ({ signal }: { signal: AbortSignal }): Promise<Menu[]> => {
  const response = await fetch(`api/menu`, { signal });

  if (!response.ok) {
    throw new Error('Failed to load categories');
  }

  return response.json();
};
