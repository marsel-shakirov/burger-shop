import type { To } from 'react-router';

import { setCatalogCategoryParam, setCatalogMenuParam } from '@/entities/menu';
import { setProductDetailsParam } from '@/entities/product';
import type { PromoLink } from '@/entities/promo';
import { routes } from '@/shared/config';

export const getPromoLink = (link?: PromoLink): To => {
  if (!link) return routes.home;

  const params = new URLSearchParams();

  setCatalogMenuParam(params, link.menu);
  setCatalogCategoryParam(params, link.category);
  if (link.productId) setProductDetailsParam(params, link.productId);

  return { pathname: routes.home, search: `?${params}` };
};
