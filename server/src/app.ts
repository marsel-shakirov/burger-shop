import express from 'express';
import path from 'node:path';

import router from './routes/index.ts';

const app = express();

const publicDirectoryPath = path.resolve(process.cwd(), 'public');

app.use(express.json());

app.use('/api/images', express.static(path.join(publicDirectoryPath, 'images')));

app.use('/api', router);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
