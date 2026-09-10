import 'dotenv/config';

import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import { CustomError } from './errors/custom.error.ts';
import router from './modules/index.ts';

const app = express();

app.use(express.json());

app.use('/api', router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors());
  }
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
