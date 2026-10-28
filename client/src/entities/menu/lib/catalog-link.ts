const MENU_PARAM = 'menu';
const CATEGORY_PARAM = 'category';

export const parseCatalogParams = (searchParams: URLSearchParams) => ({
  menuSlug: searchParams.get(MENU_PARAM) || undefined,
  categorySlug: searchParams.get(CATEGORY_PARAM) || undefined,
});

export const setCatalogMenuParam = (params: URLSearchParams, menuSlug: string) => {
  params.set(MENU_PARAM, menuSlug);
  params.delete(CATEGORY_PARAM);
};

export const clearCatalogParams = (params: URLSearchParams) => {
  params.delete(MENU_PARAM);
  params.delete(CATEGORY_PARAM);
};

export const setCatalogCategoryParam = (params: URLSearchParams, categorySlug?: string) => {
  if (categorySlug) params.set(CATEGORY_PARAM, categorySlug);
  else params.delete(CATEGORY_PARAM);
};
