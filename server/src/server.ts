import 'dotenv/config';

import app from './app.ts';
import { env } from './config/env.ts';

app.listen(env.PORT, (error) => {
  if (error) throw error;

  console.log(`Server is listening on port ${env.PORT}`);
});
