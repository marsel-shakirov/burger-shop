import { Router } from 'express';

import categoryRouter from './categories/categories.routes.ts';
import productsRouter from './products/products.routes.ts';

const router = Router();

router.use('/categories', categoryRouter);

router.use('/products', productsRouter);

export default router;
