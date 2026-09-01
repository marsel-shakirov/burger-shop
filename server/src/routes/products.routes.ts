import { Router } from 'express';

import { getProducts } from '../controllers/products.controller.ts';

const router = Router();

router.get('/', getProducts);

export default router;
