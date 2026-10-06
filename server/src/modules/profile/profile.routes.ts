import { Router } from 'express';

import { getProfile, updateProfile } from './profile.controller.ts';

const router = Router();

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
