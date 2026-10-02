import { useId } from 'react';

import { ProductDetails, useProduct, useProductDetailsParam } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { useLastDefined } from '@/shared/lib';
import { Modal } from '@/shared/ui/modal';

export const ProductModal = () => {
  const { productId, closeProductDetails } = useProductDetailsParam();
  const { data: product } = useProduct(productId);
  const isOpen = product !== undefined;

  const productVisibleWhileClosing = useLastDefined(product);
  const titleId = useId();

  return (
    <Modal open={isOpen} onClose={closeProductDetails} labelledBy={titleId}>
      {productVisibleWhileClosing && (
        <ProductDetails
          product={productVisibleWhileClosing}
          titleId={titleId}
          favoriteAction={
            <ToggleFavoriteButton variant="details" product={productVisibleWhileClosing} />
          }
          cartAction={<AddToCartButton variant="details" product={productVisibleWhileClosing} />}
        />
      )}
    </Modal>
  );
};
