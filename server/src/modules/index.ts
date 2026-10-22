import { Router } from 'express';

import { requireAuth } from '../middlewares/require-auth.ts';
import authRouter from './auth/auth.routes.ts';
import bonusRouter from './bonus/bonus.routes.ts';
import cartRouter from './cart/cart.routes.ts';
import favoritesRouter from './favorites/favorites.routes.ts';
import menusRouter from './menu/menus.routers.ts';
import productsRouter from './products/products.routes.ts';
import profileRouter from './profile/profile.routes.ts';
import promosRouter from './promos/promos.routes.ts';

const router = Router();

router.use('/auth', authRouter);

router.use('/products', productsRouter);

router.use('/menu', menusRouter);

router.use('/promos', promosRouter);

router.use('/profile', requireAuth, profileRouter);

router.use('/favorites', requireAuth, favoritesRouter);

router.use('/cart', requireAuth, cartRouter);

router.use('/bonus', requireAuth, bonusRouter);

export default router;
