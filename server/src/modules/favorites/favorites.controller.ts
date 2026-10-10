import type { Request, Response } from 'express';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { getUserId } from '../../middlewares/require-auth.ts';
import { addFavoriteUseCase } from './add-favorite.use-case.ts';
import { favoriteParamsSchema, mergeFavoritesBodySchema } from './favorites.schema.ts';
import { getFavoritesUseCase } from './get-favorites.use-case.ts';
import { mergeFavoritesUseCase } from './merge-favorites.use-case.ts';
import { removeFavoriteUseCase } from './remove-favorite.use-case.ts';

export async function getFavorites(req: Request, res: Response) {
  res.json(await getFavoritesUseCase(getUserId(req)));
}

export async function addFavorite(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = favoriteParamsSchema.safeParse(req.params);

  if (!result.success) {
    throw new BadRequest();
  }

  await addFavoriteUseCase(userId, result.data.productId);

  res.status(204).end();
}

export async function removeFavorite(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = favoriteParamsSchema.safeParse(req.params);

  if (!result.success) {
    throw new BadRequest();
  }

  await removeFavoriteUseCase(userId, result.data.productId);

  res.status(204).end();
}

export async function mergeFavorites(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = mergeFavoritesBodySchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequest();
  }

  res.json(await mergeFavoritesUseCase(userId, result.data.productIds));
}
