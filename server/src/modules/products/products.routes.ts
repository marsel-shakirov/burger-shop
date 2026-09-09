import { Router } from 'express';

import { getProducts } from './products.controller.ts';

const router = Router();

router.get('/', getProducts);

export default router;
