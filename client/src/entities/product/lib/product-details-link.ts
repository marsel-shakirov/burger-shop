import type { OpenedFromListState } from '../model/product.types';

const PRODUCT_DETAILS_PARAM = 'product';

export const isOpenedFromList = (state: unknown): state is OpenedFromListState =>
  typeof state === 'object' &&
  state !== null &&
  'openedFromList' in state &&
  state.openedFromList === true;

export const parseProductDetailsId = (searchParams: URLSearchParams) => {
  const value = searchParams.get(PRODUCT_DETAILS_PARAM);
  return value && /^\d+$/.test(value) ? Number(value) : undefined;
};

export const setProductDetailsParam = (params: URLSearchParams, productId: number) => {
  params.set(PRODUCT_DETAILS_PARAM, String(productId));
};

export const deleteProductDetailsParam = (params: URLSearchParams) => {
  params.delete(PRODUCT_DETAILS_PARAM);
};
