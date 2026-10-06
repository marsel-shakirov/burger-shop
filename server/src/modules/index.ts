import { Router } from 'express';

import { requireAuth } from '../middlewares/require-auth.ts';
import meRouter from './me/me.routes.ts';
import menusRouter from './menu/menus.routers.ts';
import productsRouter from './products/products.routes.ts';
import profileRouter from './profile/profile.routes.ts';

const router = Router();

router.use('/products', productsRouter);

router.use('/menu', menusRouter);

router.use('/me', requireAuth, meRouter);

router.use('/profile', requireAuth, profileRouter);

export default router;
