import { Router } from 'express';

import { getPromos } from './promos.controller.ts';

const router = Router();

router.get('/', getPromos);

export default router;
