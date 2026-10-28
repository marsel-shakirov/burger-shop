import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import { env } from './config/env.ts';
import { BadRequest } from './errors/bad-request.error.ts';
import { CustomError } from './errors/custom.error.ts';
import { verifyOrigin } from './middlewares/verify-origin.ts';
import router from './modules/index.ts';

const app = express();

if (env.TRUST_PROXY !== undefined) {
  app.set('trust proxy', env.TRUST_PROXY);
}

app.use(express.json());

app.use('/api', verifyOrigin, router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors());
  }

  if ('type' in err && err.type === 'entity.parse.failed') {
    return res.status(400).json(new BadRequest().serializeErrors());
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
