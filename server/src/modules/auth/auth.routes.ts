import { Router } from 'express';

import {
  changeEmailLimiter,
  changePasswordLimiter,
  signInLimiter,
  signUpLimiter,
} from '../../middlewares/rate-limit.ts';
import { requireAuth } from '../../middlewares/require-auth.ts';
import {
  authCallback,
  changeEmail,
  changePassword,
  emailCallback,
  getSession,
  signIn,
  signOut,
  signUp,
} from './auth.controller.ts';

const router = Router();

router.post('/sign-up', signUpLimiter, signUp);
router.post('/sign-in', signInLimiter, signIn);
router.post('/sign-out', signOut);
router.get('/session', getSession);
router.post('/password', changePasswordLimiter, requireAuth, changePassword);
router.post('/email', changeEmailLimiter, requireAuth, changeEmail);
router.get('/callback', authCallback);
router.get('/email-callback', emailCallback);

export default router;
