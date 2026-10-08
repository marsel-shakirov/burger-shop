import 'dotenv/config';

import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import { CustomError } from './errors/custom.error.ts';
import { verifyOrigin } from './middlewares/verify-origin.ts';
import router from './modules/index.ts';

const app = express();

const { TRUST_PROXY } = process.env;

if (TRUST_PROXY) {
  app.set('trust proxy', /^\d+$/.test(TRUST_PROXY) ? Number(TRUST_PROXY) : TRUST_PROXY);
}

app.use(express.json());

app.use('/api', verifyOrigin, router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors());
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
