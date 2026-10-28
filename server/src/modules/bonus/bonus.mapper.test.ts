import { describe, expect, it } from 'vitest';

import { toBonusResponse } from './bonus.mapper.ts';

describe('toBonusResponse', () => {
  it('считает баланс как сумму начислений и списаний', () => {
    const response = toBonusResponse([
      { id: '1', amount: 500, title: 'Регистрация', created_at: new Date() },
      { id: '2', amount: -120, title: 'Оплата заказа', created_at: new Date() },
      { id: '3', amount: 40, title: 'Кешбэк', created_at: new Date() },
    ]);

    expect(response.balance).toBe(420);
  });

  it('переводит строки в операции с датой в ISO и сохраняет порядок', () => {
    expect(
      toBonusResponse([
        {
          id: '2',
          amount: -120,
          title: 'Оплата заказа',
          created_at: new Date('2026-10-02T09:30:00Z'),
        },
        {
          id: '1',
          amount: 500,
          title: 'Регистрация',
          created_at: new Date('2026-10-01T12:00:00Z'),
        },
      ]).transactions,
    ).toEqual([
      { id: '2', amount: -120, title: 'Оплата заказа', createdAt: '2026-10-02T09:30:00.000Z' },
      { id: '1', amount: 500, title: 'Регистрация', createdAt: '2026-10-01T12:00:00.000Z' },
    ]);
  });

  it('возвращает нулевой баланс без операций', () => {
    expect(toBonusResponse([])).toEqual({ balance: 0, transactions: [] });
  });
});
