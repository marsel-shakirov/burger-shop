import { describe, expect, it, vi } from 'vitest';

import { findBonusTransactions, insertSignUpBonus } from './bonus.repository.ts';
import { getBonusUseCase } from './get-bonus.use-case.ts';

vi.mock('./bonus.repository.ts', () => ({
  findBonusTransactions: vi.fn(),
  insertSignUpBonus: vi.fn(),
}));

describe('getBonusUseCase', () => {
  it('начисляет бонус за регистрацию до чтения операций', async () => {
    vi.mocked(findBonusTransactions).mockResolvedValue([]);

    await getBonusUseCase('user-1');

    expect(insertSignUpBonus).toHaveBeenCalledWith('user-1');
    expect(findBonusTransactions).toHaveBeenCalledWith('user-1');
    expect(vi.mocked(insertSignUpBonus).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(findBonusTransactions).mock.invocationCallOrder[0],
    );
  });

  it('возвращает баланс и операции', async () => {
    vi.mocked(findBonusTransactions).mockResolvedValue([
      {
        id: '1',
        amount: 500,
        title: 'Регистрация',
        created_at: new Date('2026-10-01T12:00:00Z'),
      },
    ]);

    await expect(getBonusUseCase('user-1')).resolves.toEqual({
      balance: 500,
      transactions: [
        { id: '1', amount: 500, title: 'Регистрация', createdAt: '2026-10-01T12:00:00.000Z' },
      ],
    });
  });

  it('не читает операции, если начисление упало', async () => {
    const dbError = new Error('connection lost');
    vi.mocked(insertSignUpBonus).mockRejectedValue(dbError);

    await expect(getBonusUseCase('user-1')).rejects.toBe(dbError);
    expect(findBonusTransactions).not.toHaveBeenCalled();
  });
});
