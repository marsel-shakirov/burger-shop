import { Router } from 'express';

import { getBonus } from './bonus.controller.ts';

const router = Router();

router.get('/', getBonus);

export default router;
