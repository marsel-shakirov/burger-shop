import { Router } from 'express';

import { createOrder } from './orders.controller.ts';

const router = Router();

router.post('/', createOrder);

export default router;
