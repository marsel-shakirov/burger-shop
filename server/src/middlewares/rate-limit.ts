import { rateLimit } from 'express-rate-limit';

const tooManyRequests = { message: 'Too many requests', code: 'over_request_rate_limit' };

export const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: tooManyRequests,
});

export const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: tooManyRequests,
});
