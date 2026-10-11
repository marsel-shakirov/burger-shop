import { Router } from 'express';

import { getProfile, updateProfile } from './profile.controller.ts';

const router = Router();

router.get('/', getProfile);
router.patch('/', updateProfile);

export default router;
