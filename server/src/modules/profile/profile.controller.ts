import type { Request, Response } from 'express';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { getUserId } from '../../middlewares/require-auth.ts';
import { getProfileUseCase } from './get-profile.use-case.ts';
import { INVALID_FIELD_CODES } from './profile.constants.ts';
import { updateProfileBodySchema } from './profile.schema.ts';
import { updateProfileUseCase } from './update-profile.use-case.ts';

export async function getProfile(req: Request, res: Response) {
  res.json(await getProfileUseCase(getUserId(req)));
}

export async function updateProfile(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = updateProfileBodySchema.safeParse(req.body);

  if (!result.success) {
    const field = result.error.issues[0]?.path[0];
    throw new BadRequest(
      'Bad request',
      typeof field === 'string' ? INVALID_FIELD_CODES.get(field) : undefined,
    );
  }

  res.json(await updateProfileUseCase(userId, result.data));
}
