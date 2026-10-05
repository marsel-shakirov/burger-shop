import { Router } from 'express';

import { getUserId } from '../../middlewares/require-auth.ts';

const router = Router();

router.get('/', (req, res) => {
  res.json({ id: getUserId(req) });
});

export default router;
