import {
  MAX_ITEM_QUANTITY,
  selectAddItem,
  selectDecrementItem,
  selectIncrementItem,
  selectProductQuantity,
  useCartStore,
} from '@/entities/cart';
import type { Product } from '@/entities/product';
import { QuantityControls } from '@/shared/ui/quantity-controls';

import type { AddToCartVariant } from '../model/add-to-cart.types';
import { useSwapFocus } from '../model/use-swap-focus';
import { AddButton } from './add-button';
import { AddToCartFrame } from './add-to-cart-frame';
import { CartLineTotal } from './cart-line-total';

interface AddToCartButtonProps {
  product: Product;
  variant?: AddToCartVariant;
}

const controlsStyles: Record<
  AddToCartVariant,
  { className: string; variant: 'solid' | 'solid-large' }
> = {
  card: { className: 'p-1', variant: 'solid' },
  details: { className: 'p-1.5', variant: 'solid-large' },
};

export const AddToCartButton = ({ product, variant = 'card' }: AddToCartButtonProps) => {
  const quantity = useCartStore(selectProductQuantity(product.id));
  const addItem = useCartStore(selectAddItem);
  const incrementItem = useCartStore(selectIncrementItem);
  const decrementItem = useCartStore(selectDecrementItem);
  const hasItems = quantity > 0;
  const { primaryRef, secondaryRef, requestFocusSwap } = useSwapFocus(hasItems);

  const controls = controlsStyles[variant];

  const handleAdd = () => {
    requestFocusSwap();
    addItem(product.id);
  };

  const handleIncrease = () => incrementItem(product.id);

  const handleDecrease = () => {
    if (quantity === 1) requestFocusSwap();
    decrementItem(product.id);
  };

  return (
    <AddToCartFrame variant={variant} isActive={hasItems}>
      {hasItems ? (
        <QuantityControls
          variant={controls.variant}
          className={`relative size-full justify-between text-stone-900 ${controls.className}`}
          quantity={quantity}
          max={MAX_ITEM_QUANTITY}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          increaseButtonRef={secondaryRef}
          label={
            variant === 'details' ? (
              <CartLineTotal price={product.price} quantity={quantity} />
            ) : undefined
          }
        ></QuantityControls>
      ) : (
        <AddButton ref={primaryRef} product={product} variant={variant} onClick={handleAdd} />
      )}
    </AddToCartFrame>
  );
};
