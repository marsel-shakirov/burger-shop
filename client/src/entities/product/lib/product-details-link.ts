import { type LinkProps, useLocation, useNavigate } from 'react-router';

import { useUpdateSearchParams } from '@/shared/lib';

const PRODUCT_DETAILS_PARAM = 'product';

interface OpenedFromListState {
  openedFromList: true;
}

const OPENED_FROM_LIST_STATE: OpenedFromListState = { openedFromList: true };

const isOpenedFromList = (state: unknown): state is OpenedFromListState =>
  typeof state === 'object' && state !== null && 'openedFromList' in state;

const parseProductDetailsId = (searchParams: URLSearchParams) => {
  const value = searchParams.get(PRODUCT_DETAILS_PARAM);
  return value && /^\d+$/.test(value) ? Number(value) : undefined;
};

export const setProductDetailsParam = (params: URLSearchParams, productId: number) => {
  params.set(PRODUCT_DETAILS_PARAM, String(productId));
};

export const useProductDetailsLink = (productId: number): Pick<LinkProps, 'to' | 'state'> => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  setProductDetailsParam(params, productId);

  return { to: { search: `?${params}` }, state: OPENED_FROM_LIST_STATE };
};

export const useProductDetailsParam = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const productId = parseProductDetailsId(searchParams);

  const removeProductDetailsParam = () =>
    updateParams((next) => next.delete(PRODUCT_DETAILS_PARAM));

  const returnToList = () => void navigate(-1);

  const closeProductDetails = () => {
    if (isOpenedFromList(location.state)) returnToList();
    else removeProductDetailsParam();
  };

  return { productId, closeProductDetails };
};
