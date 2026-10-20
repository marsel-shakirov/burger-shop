import { type LinkProps, useLocation } from 'react-router';

import { OPENED_FROM_LIST_STATE } from '../config/product.constants';
import { setProductDetailsParam } from '../lib/product-details-link';

export const useProductDetailsLink = (productId: number): Pick<LinkProps, 'to' | 'state'> => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  setProductDetailsParam(params, productId);

  return { to: { search: `?${params}` }, state: OPENED_FROM_LIST_STATE };
};
