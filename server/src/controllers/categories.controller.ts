import type { Request, Response } from 'express';

export async function getCategories(_req: Request, res: Response) {
  const data = await fetch('https://6a58f0ff68601fc330e98c3a.mockapi.io/categories');
  const response = await data.json();

  res.json(response);
}
