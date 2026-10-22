import { toBonusResponse } from './bonus.mapper.ts';
import { findBonusTransactions, insertSignUpBonus } from './bonus.repository.ts';

export async function getBonusUseCase(userId: string) {
  await insertSignUpBonus(userId);

  return toBonusResponse(await findBonusTransactions(userId));
}
