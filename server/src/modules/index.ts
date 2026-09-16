import { Router } from 'express';

import menusRouter from './menu/menus.router.ts';
import productsRouter from './products/products.routes.ts';

const router = Router();

router.use('/products', productsRouter);

router.use('/menu', menusRouter);

export default router;
