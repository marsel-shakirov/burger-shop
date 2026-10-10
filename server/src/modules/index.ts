import { Router } from 'express';

import { requireAuth } from '../middlewares/require-auth.ts';
import authRouter from './auth/auth.routes.ts';
import favoritesRouter from './favorites/favorites.routes.ts';
import menusRouter from './menu/menus.routers.ts';
import productsRouter from './products/products.routes.ts';
import profileRouter from './profile/profile.routes.ts';

const router = Router();

router.use('/auth', authRouter);

router.use('/products', productsRouter);

router.use('/menu', menusRouter);

router.use('/profile', requireAuth, profileRouter);

router.use('/favorites', requireAuth, favoritesRouter);

export default router;
