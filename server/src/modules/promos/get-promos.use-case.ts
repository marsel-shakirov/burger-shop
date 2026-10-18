import { toPromoResponse } from './promos.mapper.ts';
import { findActivePromos } from './promos.repository.ts';

export async function getPromosUseCase() {
  const rows = await findActivePromos();

  return rows.map(toPromoResponse);
}
