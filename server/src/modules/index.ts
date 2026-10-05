import { Router } from 'express';

import { requireAuth } from '../middlewares/require-auth.ts';
import meRouter from './me/me.routes.ts';
import menusRouter from './menu/menus.routers.ts';
import productsRouter from './products/products.routes.ts';

const router = Router();

router.use('/products', productsRouter);

router.use('/menu', menusRouter);

router.use('/me', requireAuth, meRouter);

export default router;
