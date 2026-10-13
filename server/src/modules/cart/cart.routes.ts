import { Router } from 'express';

import {
  clearCart,
  getCart,
  mergeCart,
  removeCartItem,
  updateCartItem,
} from './cart.controller.ts';

const router = Router();

router.get('/', getCart);
router.delete('/', clearCart);
router.post('/merge', mergeCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);

export default router;
