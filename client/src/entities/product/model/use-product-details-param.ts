import { useLocation, useNavigate } from 'react-router';

import { useUpdateSearchParams } from '@/shared/lib';

import {
  deleteProductDetailsParam,
  isOpenedFromList,
  parseProductDetailsId,
} from '../lib/product-details-link';

export const useProductDetailsParam = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const productId = parseProductDetailsId(searchParams);

  const removeProductDetailsParam = () => updateParams(deleteProductDetailsParam);

  const returnToList = () => void navigate(-1);

  const closeProductDetails = () => {
    if (isOpenedFromList(location.state)) returnToList();
    else removeProductDetailsParam();
  };

  return { productId, closeProductDetails };
};
