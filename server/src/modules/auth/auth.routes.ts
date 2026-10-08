import { Router } from 'express';

import { authCallback, getSession, signIn, signOut, signUp } from './auth.controller.ts';

const router = Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.get('/session', getSession);
router.get('/callback', authCallback);

export default router;
