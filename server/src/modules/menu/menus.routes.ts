import { Router } from 'express';

import { getMenus } from './menus.controller.ts';

const router = Router();

router.get('/', getMenus);

export default router;
