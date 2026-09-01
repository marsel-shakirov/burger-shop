import { Router } from 'express';

import categoryRouter from './categories.routes.ts';
import productsRouter from './products.routes.ts';

const router = Router();

router.use('/categories', categoryRouter);

router.use('/products', productsRouter);

export default router;
