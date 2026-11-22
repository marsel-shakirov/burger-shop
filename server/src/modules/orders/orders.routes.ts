import { Router } from 'express';

import { createOrder, getOrder, listOrders } from './orders.controller.ts';

const router = Router();

router.get('/', listOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);

export default router;
