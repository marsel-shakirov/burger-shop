import { rateLimit } from 'express-rate-limit';

const MINUTE_MS = 60 * 1000;

const baseOptions = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many requests', code: 'over_request_rate_limit' },
} as const;

export const signInLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * MINUTE_MS,
  limit: 10,
  skipSuccessfulRequests: true,
});

export const signUpLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * MINUTE_MS,
  limit: 5,
});

export const changePasswordLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * MINUTE_MS,
  limit: 5,
  skipSuccessfulRequests: true,
});

export const changeEmailLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * MINUTE_MS,
  limit: 5,
});
