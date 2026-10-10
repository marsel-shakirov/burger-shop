import { Router } from 'express';

import {
  addFavorite,
  getFavorites,
  mergeFavorites,
  removeFavorite,
} from './favorites.controller.ts';

const router = Router();

router.get('/', getFavorites);
router.post('/merge', mergeFavorites);
router.put('/:productId', addFavorite);
router.delete('/:productId', removeFavorite);

export default router;
