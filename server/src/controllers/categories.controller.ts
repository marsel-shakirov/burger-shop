import type { Request, Response } from 'express';

const MOCK_API_URL = 'https://6a58f0ff68601fc330e98c3a.mockapi.io/categories';

export async function getCategories(_req: Request, res: Response) {
  const data = await fetch(MOCK_API_URL);
  const response = await data.json();

  res.json(response);
}
