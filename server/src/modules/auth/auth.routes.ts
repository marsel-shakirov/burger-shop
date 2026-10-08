import { Router } from 'express';

import { signInLimiter, signUpLimiter } from '../../middlewares/rate-limit.ts';
import { authCallback, getSession, signIn, signOut, signUp } from './auth.controller.ts';

const router = Router();

router.post('/sign-up', signUpLimiter, signUp);
router.post('/sign-in', signInLimiter, signIn);
router.post('/sign-out', signOut);
router.get('/session', getSession);
router.get('/callback', authCallback);

export default router;
