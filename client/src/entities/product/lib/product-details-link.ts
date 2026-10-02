import { type LinkProps, useLocation, useNavigate, useSearchParams } from 'react-router';

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

export const useProductDetailsLink = (productId: number): Pick<LinkProps, 'to' | 'state'> => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  params.set(PRODUCT_DETAILS_PARAM, String(productId));

  return { to: { search: `?${params}` }, state: OPENED_FROM_LIST_STATE };
};

export const useProductDetailsParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const productId = parseProductDetailsId(searchParams);

  const removeProductDetailsParam = () =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(PRODUCT_DETAILS_PARAM);
        return next;
      },
      { replace: true },
    );

  const returnToList = () => navigate(-1);

  const closeProductDetails = () => {
    if (isOpenedFromList(state)) returnToList();
    else removeProductDetailsParam();
  };

  return { productId, closeProductDetails };
};
